// components/PokemonGrid.js
import React, { useState } from 'react';
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
      <div className="pokemon-grid">
        {pokemonList.map((pokemon) => (
          <PokemonCard
            key={pokemon.id}
            name={pokemon.name}
            sprite={pokemon.sprites?.other?.["official-artwork"]?.front_default}
            greyedOut={!!greyed[pokemon.id]}
            onClick={() => onCardClick && onCardClick(pokemon.id)}
          />
        ))}
      </div>
    </div>
  );
}
