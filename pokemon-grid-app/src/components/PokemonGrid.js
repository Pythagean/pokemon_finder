import React, { useEffect, useState } from 'react';
import PokemonCard from './PokemonCard';
import { fetchPokemon } from '../utils/api';

const PokemonGrid = () => {
    const [pokemonList, setPokemonList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllPokemon = async () => {
            const promises = [];
            for (let i = 1; i <= 151; i++) {
                promises.push(fetchPokemon(i));
            }
            const results = await Promise.all(promises);
            setPokemonList(results);
            setLoading(false);
        };

        fetchAllPokemon();
    }, []);

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
            {pokemonList.map((pokemon) => (
                <PokemonCard key={pokemon.id} pokemon={pokemon} />
            ))}
        </div>
    );
};

export default PokemonGrid;