import { useState } from 'react';
import {
  first151Pokemon,
  getFullPokedexNumber,
  getPokedexNumber,
} from './utils';
export default function SideNav(props) {
  const { setSelectedPokemon, showSideMenu, handleToggleMenu, selectedPokemon} = props;
  const [currentPokemon, setCurrentPokemon] = useState('');

  const filteredPokemon = first151Pokemon.filter((pokemon, pokeIndex) => {
    return (
      pokemon.toLowerCase().includes(currentPokemon.toLowerCase()) ||
      //pokeIndex.includes(getFullPokedexNumber(currentPokemon))

      getFullPokedexNumber(pokeIndex).includes(currentPokemon)
    );
  });

  return (
    <nav className={`${!showSideMenu ? "open" : ' '}`}>
      <div className={`header ${!showSideMenu ? "open" : ' '}`}>
        <button onClick={handleToggleMenu}className='open-nav-button'>
          <i className='fa-solid fa-arrow-left-long'></i>
        </button>
        <h1 className='text-gradient'> Pokédex</h1>
      </div>

      <input
        placeholder='E.g 001 or bulba...'
        value={currentPokemon}
        onChange={(e) => {
          setCurrentPokemon(e.target.value);
        }}
      />

      {filteredPokemon.map((pokemon) => {
        const pokemonIndex = first151Pokemon.indexOf(pokemon);
        console.log(`pokemonIndex: ${pokemonIndex}, selectedPokemon: ${selectedPokemon}`);
        return (
          <button
            key={pokemonIndex}
            onClick={() => setSelectedPokemon(pokemonIndex)}
            className={
              `nav-card ` + (pokemonIndex === selectedPokemon ? 'nav-card-selected' : '')} >
            <p>{getFullPokedexNumber(pokemonIndex)}</p>
            <p> {pokemon}</p>

          </button>

        );

      }

      )}
    </nav>


  );

}
