// components/PokemonCard.js
import React from 'react';


/**
 * Card for displaying a single Pokémon
 * @param {Object} props
 * @param {string} props.name - Pokémon name
 * @param {string} props.sprite - Sprite image URL
 * @param {boolean} [props.greyedOut] - If true, show greyed out (for future filters)
 */

export default function PokemonCard({ name, sprite, greyedOut = false, onClick }) {
  return (
    <div
      className={`pokemon-card${greyedOut ? ' pokemon-card-greyed' : ''}`}
      onClick={onClick}
      style={{ userSelect: 'none' }}
      tabIndex={0}
      role="button"
      aria-pressed={greyedOut}
    >
      <img
        src={sprite}
        alt={name}
        className="pokemon-card-img"
        loading="lazy"
      />
    </div>
  );
}
