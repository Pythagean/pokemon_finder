import axios from 'axios';

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2/pokemon/';

export const fetchPokemonById = async (id) => {
    try {
        const response = await axios.get(`${POKEAPI_BASE_URL}${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching Pokémon with ID ${id}:`, error);
        throw error;
    }
};