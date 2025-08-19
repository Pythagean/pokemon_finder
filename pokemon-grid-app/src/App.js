import React from 'react';
import PokemonGrid from './components/PokemonGrid';

function App() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Pokémon Grid</h1>
      <PokemonGrid />
    </div>
  );
}

export default App;