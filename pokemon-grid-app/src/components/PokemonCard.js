import React from 'react';

const PokemonCard = ({ pokemon }) => {
    return (
        <div className="border rounded-lg p-4 m-2 shadow-lg flex flex-col items-center">
            <img src={pokemon.sprites.front_default} alt={pokemon.name} className="w-24 h-24" />
            <h2 className="mt-2 text-lg font-semibold capitalize">{pokemon.name}</h2>
        </div>
    );
};

export default PokemonCard;