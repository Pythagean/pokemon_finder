// components/PokemonCard.js
import React from 'react';


/**
 * Card for displaying a single Pokémon
 * @param {Object} props
 * @param {string} props.name - Pokémon name
 * @param {string} props.sprite - Sprite image URL
 * @param {boolean} [props.greyedOut] - If true, show greyed out (for future filters)
 */

export default function PokemonCard({ id, name, remoteSprite, greyedOut = false, onClick }) {
  const localPath = process.env.PUBLIC_URL + `/pokemon/${id}.png`;

  function handleError(e) {
    if (e && e.target && e.target.src !== remoteSprite) {
      e.target.src = remoteSprite || e.target.src;
    }
  }

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
        src={localPath}
        alt={name}
        className="pokemon-card-img"
        loading="lazy"
        onError={handleError}
      />
    </div>
  );
}
