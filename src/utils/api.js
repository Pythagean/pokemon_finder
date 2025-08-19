// utils/api.js
// Helper functions for fetching Pokémon data from PokéAPI

const API_BASE_URL = 'https://pokeapi.co/api/v2';
const POKEMON_URL = `${API_BASE_URL}/pokemon`;
const SPECIES_URL = `${API_BASE_URL}/pokemon-species`;

/**
 * Fetch data for a single Pokémon by ID
 * @param {number} id - Pokémon ID (1-151)
 * @returns {Promise<Object>} Pokémon data
 */
export async function fetchPokemonById(id) {
  // Fetch basic Pokémon data
  const pokemonResponse = await fetch(`${POKEMON_URL}/${id}`);
  if (!pokemonResponse.ok) throw new Error('Failed to fetch Pokémon');
  const pokemonData = await pokemonResponse.json();

  // Fetch species data for habitat information
  const speciesResponse = await fetch(`${SPECIES_URL}/${id}`);
  if (!speciesResponse.ok) throw new Error('Failed to fetch Pokémon species data');
  const speciesData = await speciesResponse.json();

  // Fetch evolution chain data
  const evolutionResponse = await fetch(speciesData.evolution_chain.url);
  if (!evolutionResponse.ok) throw new Error('Failed to fetch evolution data');
  const evolutionData = await evolutionResponse.json();

  // Calculate evolution stage
  let evolutionStage = 1;
  let evoCheck = evolutionData.chain;
  while (evoCheck.evolves_to.length > 0) {
    const nextEvo = evoCheck.evolves_to[0];
    const speciesName = speciesData.name;
    if (speciesName === nextEvo.species.name) {
      evolutionStage = 2;
      break;
    } else if (nextEvo.evolves_to.length > 0 && speciesName === nextEvo.evolves_to[0].species.name) {
      evolutionStage = 3;
      break;
    }
    evoCheck = nextEvo;
  }

  // Combine the data
  return {
    ...pokemonData,
    habitat: speciesData.habitat?.name || 'unknown',
    color: speciesData.color?.name || 'unknown',
    evolutionStage
  };
}

/**
 * Fetch data for multiple Pokémon by IDs (batched)
 * @param {number[]} ids - Array of Pokémon IDs
 * @returns {Promise<Object[]>} Array of Pokémon data
 */
export async function fetchPokemonBatch(ids) {
  return Promise.all(ids.map(fetchPokemonById));
}

/**
 * Fetch all 151 Pokémon (batched for performance)
 * @returns {Promise<Object[]>} Array of Pokémon data
 */
export async function fetchAllPokemon() {
  const ids = Array.from({ length: 151 }, (_, i) => i + 1);
  // Batch in groups of 20 for efficiency
  const batchSize = 20;
  const batches = [];
  for (let i = 0; i < ids.length; i += batchSize) {
    batches.push(ids.slice(i, i + batchSize));
  }
  const results = [];
  for (const batch of batches) {
    const data = await fetchPokemonBatch(batch);
    results.push(...data);
  }
  return results;
}
