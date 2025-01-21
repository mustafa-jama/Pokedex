import { useState } from 'react';
import Header from './components/Header';
import SideNav from './components/SideNav';
import { PokeCard } from './components/PokeCard';

function App() {
  const [selectedPokemon, setSelectedPokemon] = useState(24);
  const[showSideMenu, setShowSideMenu] = useState(false);

  const handleToggleMenu = () => {
    setShowSideMenu(!showSideMenu);
  };

  return (
    <>
      <Header handleToggleMenu={handleToggleMenu} />
      <SideNav
        selectedPokemon={selectedPokemon}
        setSelectedPokemon={setSelectedPokemon}
        handleToggleMenu={handleToggleMenu}
        showSideMenu={showSideMenu}
      />
      <PokeCard selectedPokemon={selectedPokemon} />
    </>
  );
}

export default App;
