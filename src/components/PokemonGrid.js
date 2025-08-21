// components/PokemonGrid.js
import React from 'react';
import PokemonCard from './PokemonCard';
import './PokemonGrid.css';

/**
 * Grid for displaying all Pokémon
 * @param {Object} props
 * @param {Array} props.pokemonList - Array of Pokémon objects ({ id, name, sprites })
 */
// Accepts: pokemonList, greyed (object), onCardClick (function)
export default function PokemonGrid({ pokemonList, greyed = {}, onCardClick }) {
  return (
    <div className="pokemon-grid-wrapper">
  <div className="pokemon-grid pokemon-grid-desktop pokemon-grid-mobile">
        {pokemonList.map((pokemon) => (
          <PokemonCard
            key={pokemon.id}
            id={pokemon.id}
            name={pokemon.name}
            remoteSprite={pokemon.sprites?.other?.["official-artwork"]?.front_default}
            greyedOut={!!greyed[pokemon.id]}
            onClick={() => onCardClick && onCardClick(pokemon.id)}
          />
        ))}
      </div>
    </div>
  );
}
