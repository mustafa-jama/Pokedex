import { first151Pokemon, getFullPokedexNumber } from './utils';
export  function SideNav(props) {
  const { setSelectedPokemon } = props;

  return (
    <nav>
      <div className={`header`}>
        <h1 className='text-gradient'> Pokédex</h1>
      </div>

      <input placeholder='enter pokemon' />

      {first151Pokemon.map((pokemon, pokemonIndex) => {
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
