import { useEffect, useRef, useState } from 'react';
import { getFullPokedexNumber, getPokedexNumber } from './utils';
import TypeCard from './TypeCard';
import Modal from 'module';
const BASE_URL = 'https://pokeapi.co/api/v2/pokemon/';

export function PokeCard(props) {
  const { selectedPokemon, isOpen, setIsOpen } = props;
  const [pokemonData, setPokemonData] = useState(null);
  const [loading, setLoading] = useState(false);
  //const [handleCloseModal,sethandleCloseModal]=(false)

  const abortControllerRef = useRef(null);

  useEffect(() => {
    const cache = JSON.parse(localStorage.getItem('pokedex')) || {};

    if (cache[selectedPokemon]) {
      setPokemonData(cache[selectedPokemon]);
      return;
    }

    const fetchPokedex = async () => {
      setLoading(true);
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      try {
        const response = await fetch(
          BASE_URL + getPokedexNumber(selectedPokemon),
          { signal }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch Pokémon data');
        }

        const pokemonData = await response.json();
        setPokemonData(pokemonData);
        const copyCache = { ...cache, [selectedPokemon]: pokemonData };
        localStorage.setItem('pokedex', JSON.stringify(copyCache));
      } catch (e) {
        console.error(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPokedex();
  }, [selectedPokemon]);

  if (loading) {
    return (
      <div>
        <h4>Loading...</h4>
      </div>
    );
  }

  if (!pokemonData) {
    return (
      <div>
        <h4>No Pokémon data available.</h4>
      </div>
    );
  }

  const { name, height, abilities, stats, types, moves, sprites } =
    pokemonData || {};

  const imgList = Object.keys(sprites || {}).filter((val) => {
    if (!sprites[val]) return false;
    if (['versions', 'other'].includes(val)) return false;
    return true;
  });

  return (
    <>
      <div className='poke-card'>


        <div>
          <h4>#{getFullPokedexNumber(selectedPokemon)}</h4>
          <h2>{name}</h2>
        </div>

        <div className='type-container'>
          {types.map((typeObj, typeIndex) => (
            <TypeCard key={typeIndex} type={typeObj?.type?.name} />
          ))}
        </div>

        <img
          className='default-img'
          src={'/pokemon/' + getFullPokedexNumber(selectedPokemon) + '.png'}
          alt={`${name}-large-img`}
        />

        <div className={'img-container'}>
          {imgList.map((spriteUrl, spriteIndex) => {
            const imgUrl = sprites[spriteUrl];
            return (
              <img
                key={spriteIndex}
                src={imgUrl}
                alt={`${name}-img-${spriteUrl}`}
              />
            );
          })}
        </div>

        <h3>Stats</h3>
        <div className={'stats-card'}>
          {stats.map((statObj, statIndex) => {
            return (
              <div key={statIndex} className='stat-item'>
                <p> {statObj?.stat?.name}</p>
                <h4>{statObj?.base_stat}</h4>
              </div>
            );
          })}
        </div>
        <h3>Moves</h3>
        <div className='pokemon-move-grid'>
          {moves.map((moveObj, moveIndex) => {
            return (
              <button
                className='button-card pokemon-move'
                key={moveIndex}
                onClick={() => {
                  <Modal handleCloseModal={handleCloseModal} />;
                }}
              >
                <p>{moveObj?.move?.name}</p>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
