import { useEffect, useRef, useState } from 'react';
import { getFullPokedexNumber, getPokedexNumber } from './utils';
import TypeCard from './TypeCard';
import Modal from './Modal';
const BASE_URL = 'https://pokeapi.co/api/v2/pokemon/';

export function PokeCard(props) {
  const { selectedPokemon, isOpen, setIsOpen } = props;
  const [pokemonData, setPokemonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [skill, setSkill] = useState(null);
  const [loadingSkill, setLoadingSkill] = useState(false);

  const abortControllerRef = useRef(null);

  const fetchMoveData = async (move, moveUrl) => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    if (loadingSkill || !moveUrl || !move) {
      return;
    }

    let cache = {};
    if (localStorage.getItem('pokemon-moves')) {
      cache = JSON.parse(localStorage.getItem('pokemon-moves'));
    }

    if (move in cache) {
      setSkill(cache[move]);
      console.log('got it from cache')
      return;
    }

    try {
      setLoadingSkill(true)
      const response = await fetch(moveUrl,signal)
      const moveData = await response.json()
      console.log('Fetched Data',  moveData)
      const discription = moveData?.flavor_text_entries.filter((val) => {
        return val.version_group.name = 'firered-leafgreen'
      } )[0]?.flavor_text

      const skillData = {

        name: move,
        discription
      }
      setSkill(skillData)

      cache[move] = skillData

      localStorage.setItem('pokemon-moves',JSON.stringify(cache))



    } catch (e) {
      console.error(e.message);
    } finally {
      setLoadingSkill(false);
    }
  };

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
      {console.log('Skill state:', skill);}
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
        {skill && (
          <Modal

            handleCloseModal={() => {
              console.log("Modal is closing...")
              setSkill(null)
              console.log("Updated skill state:", skill);
            }}


          >
            <div>
              <h6>Name</h6>
              <h2 className='skill-name'>{skill.name}</h2>
            </div>
            <div>
              <h6>Description</h6>
              <p>{skill.discription}</p>
            </div>
          </Modal>
        )}
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
                  fetchMoveData(moveObj?.move?.name , moveObj?.move?.url)


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
