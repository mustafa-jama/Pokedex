import { first151Pokemon, getFullPokedexNumber} from "./utils"
export function  SideNave (){

return(

  <nav>
      <div classname={`header`}>

        <h1 className="text-gradient"> Pokedex</h1>
      </div>

      <input placeholder="enter pokemon"/>


      {first151Pokemon.map((pokemon, pokemonIndex) => {

          return(


                <button className={`nav-card`}>
                    <p>{getFullPokedexNumber(pokemonIndex)}</p>
                      <p> {pokemon}</p>

                </button>

          )
      })}


  </nav>

)



}
