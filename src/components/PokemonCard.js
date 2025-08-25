// components/PokemonCard.js
import React from 'react';


/**
 * Card for displaying a single Pokémon
 * @param {Object} props
 * @param {string} props.name - Pokémon name
 * @param {string} props.sprite - Sprite image URL
 * @param {boolean} [props.greyedOut] - If true, show greyed out (for future filters)
 */

export default function PokemonCard({ id, name, remoteSmall, remoteLarge, greyedOut = false, onClick }) {
  // Try small local thumbnail first, then full local, then remote small, then remote large
  const localThumb = process.env.PUBLIC_URL + `/pokemon/thumbs/${id}.png`;
  const localFull = process.env.PUBLIC_URL + `/pokemon/${id}.png`;

  // Prefer thumb if present, otherwise prefer the smaller remote sprite before falling back
  // to the large local full artwork to speed up initial loads when thumbnails aren't generated.
  const srcCandidates = [localThumb, remoteSmall, localFull, remoteLarge];

  function handleError(e) {
    if (!e || !e.target) return;
    const current = e.target.src;
    // Find next candidate that's different from current
    const idx = srcCandidates.indexOf(current);
    const next = idx >= 0 && idx < srcCandidates.length - 1 ? srcCandidates[idx + 1] : null;
    if (next && next !== current) e.target.src = next;
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
        src={localThumb}
        alt={name}
        className="pokemon-card-img"
        loading="lazy"
        onError={handleError}
      />
    </div>
  );
}
