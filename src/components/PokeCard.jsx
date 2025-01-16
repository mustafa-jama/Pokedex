import { useEffect, useRef, useState } from 'react';
import { getFullPokedexNumber, getPokedexNumber } from './utils';
import { TypeCard } from './TypeCard';
const BASE_URL = 'https://pokeapi.co/api/v2/pokemon/';

export function PokeCard(props) {
  const { selectedPokemon } = props;
  const [pokemonData, setPokemonData] = useState(null);
  const [loading, setLoading] = useState(false);

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
    return <div><h4>Loading...</h4></div>;
  }

  if (!pokemonData) {
    return <div><h4>No Pokémon data available.</h4></div>;
  }

  const { name, height, abilities , stats, types, moves, sprites } = pokemonData || {};

  return (
    <>
    <div className='poke-card'>
      <div >
        <h4>#{getFullPokedexNumber(selectedPokemon)}</h4>
        <h2>{name}</h2>
      </div>

      <div className='type-container'>
        {types.map((typeObj, typeIndex) => (
          <TypeCard key={typeIndex} type={typeObj?.type?.name} />
        ))}
      </div>

        <img className='default-img' src={'/pokemon/' + getFullPokedexNumber(selectedPokemon) + '.png'} alt={`${name}-large-img`}/>

      </div>
    </>
  );
}
