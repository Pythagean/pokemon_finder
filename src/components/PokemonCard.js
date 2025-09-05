// components/PokemonCard.js
import React from 'react';
import thumbs from '../assets/thumbs';


/**
 * Card for displaying a single Pokémon
 * @param {Object} props
 * @param {string} props.name - Pokémon name
 * @param {string} props.sprite - Sprite image URL
 * @param {boolean} [props.greyedOut] - If true, show greyed out (for future filters)
 */


export default function PokemonCard({ id, name, remoteSmall, remoteLarge, greyedOut = false, onClick }) {
  // Use imported thumbs bundle, fallback to remoteSmall, then remoteLarge
  const localThumb = thumbs[id];
  const srcCandidates = [localThumb, remoteSmall, remoteLarge];

  function handleError(e) {
    if (!e || !e.target) return;
    const current = e.target.src;
    // Find next candidate that's different from current
    const idx = srcCandidates.findIndex(src => src === current || (typeof src === 'object' && src?.default === current));
    const next = idx >= 0 && idx < srcCandidates.length - 1 ? srcCandidates[idx + 1] : null;
    if (next && next !== current) {
      if (typeof next === 'object' && next?.default) {
        e.target.src = next.default;
      } else {
        e.target.src = next;
      }
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
        src={typeof localThumb === 'object' && localThumb?.default ? localThumb.default : localThumb}
        alt={name}
        className="pokemon-card-img"
        loading="lazy"
        onError={handleError}
      />
    </div>
  );
}
