import { useEffect, useRef, useState } from "react"

export function PokeCard(props){

  const {selectedPokemon} = props
  const [data,setData] = useState(null)
  const [loading,setLoading] = useState(false)

  const abortControllerRef = useRef()

  useEffect(() => {

          fetchPokedex = async() => {

            setLoading(true)

            abortControllerRef.current?.abort()

            abortControllerRef.current = new AbortController()
            const signal = abortControllerRef.current.signal

            try{
            const url = 'https://pokeapi.co/api/v2/pokemon/' + selectedPokemon
            const response = await fetch(url, signal)
            const pokemonData = await response.json()
            setData(pokemonData)
            }
            catch(e){

              console.log(e)
            }
            finally{

              setLoading(false)
            }
          }

          fetchPokedex()

  }, [selectedPokemon])

return (



  <div></div>

)




}
