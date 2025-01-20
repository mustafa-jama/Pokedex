import { useState } from 'react';
import { first151Pokemon, getFullPokedexNumber } from './utils';
export default function SideNav(props) {
  const { setSelectedPokemon } = props;
  const[currentPokemon, setCurrentPokemon] = useState('')

  const filteredPokemon = first151Pokemon.filter((pokemon) => {

    return(

      pokemon.toLowerCase().includes(currentPokemon.toLowerCase())
    )
  })


  return (
    <nav>
      <div className={`header`}>
        <h1 className='text-gradient'> Pokédex</h1>
      </div>

      <input placeholder='enter pokemon' value={currentPokemon} onChange={(e) => {setCurrentPokemon(e.target.value)}} />



      {filteredPokemon.map((pokemon, pokemonIndex) => {
        return (
          <button
            key={pokemonIndex}
            onClick={() => setSelectedPokemon(pokemonIndex)}
            className={`nav-card`}
          >
            <p>{getFullPokedexNumber(pokemonIndex)}</p>
            <p> {pokemon}</p>
          </button>
        );
      })}
    </nav>
  );
}
