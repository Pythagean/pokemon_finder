// utils/api.js
// Helper functions for fetching Pokémon data from PokéAPI

const API_BASE_URL = 'https://pokeapi.co/api/v2';
const POKEMON_URL = `${API_BASE_URL}/pokemon`;
const SPECIES_URL = `${API_BASE_URL}/pokemon-species`;

// Small helper to retry transient network failures
async function fetchWithRetry(url, options = {}, retries = 2, backoff = 300) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      return res;
    } catch (err) {
      if (attempt === retries) throw err;
      // small backoff
      // eslint-disable-next-line no-await-in-loop
      await new Promise(r => setTimeout(r, backoff * (attempt + 1)));
    }
  }
}

/**
 * Fetch data for a single Pokémon by ID
 * @param {number} id - Pokémon ID (1-151)
 * @returns {Promise<Object>} Pokémon data
 */
export async function fetchPokemonById(id) {
  // Fetch basic Pokémon data
  const pokemonResponse = await fetchWithRetry(`${POKEMON_URL}/${id}`);
  const pokemonData = await pokemonResponse.json();

  // Fetch species data for habitat information
  const speciesResponse = await fetchWithRetry(`${SPECIES_URL}/${id}`);
  const speciesData = await speciesResponse.json();

  // Fetch evolution chain data
  const evolutionResponse = await fetchWithRetry(speciesData.evolution_chain.url);
  const evolutionData = await evolutionResponse.json();

  // Calculate evolution stage
  // Determine evolution stage but only counting Gen-1 species (IDs 1..151)
  let evolutionStage = 1;
  try {
    // helper to extract species id from species.url
    const speciesIdFromUrl = (url) => {
      const m = url.match(/\/(\d+)\/?$/);
      return m ? parseInt(m[1], 10) : null;
    };

    // find path from chain root to target species; returns array of species nodes
    const findPath = (node, targetName, path = []) => {
      const thisSpecies = node.species || {};
      const thisId = speciesIdFromUrl(thisSpecies.url || '');
      const thisEntry = { name: thisSpecies.name, id: thisId };
      const newPath = [...path, thisEntry];
      if (thisSpecies.name === targetName) return newPath;
      if (!node.evolves_to || node.evolves_to.length === 0) return null;
      for (const child of node.evolves_to) {
        const res = findPath(child, targetName, newPath);
        if (res) return res;
      }
      return null;
    };

    const path = findPath(evolutionData.chain, speciesData.name) || [];
    // filter only Gen-1 species
    const gen1Path = path.filter(p => p.id && p.id <= 151);
    // find index of current species among gen1 entries
    const idx = gen1Path.findIndex(p => p.name === speciesData.name);
    if (idx >= 0) {
      evolutionStage = idx + 1; // stage is 1-based
    } else {
      // if species itself isn't Gen1 (shouldn't happen since we're fetching 1..151), fallback
      evolutionStage = 1;
    }
  } catch (e) {
    evolutionStage = 1;
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
  try {
    const localRes = await fetch(process.env.PUBLIC_URL + '/pokemon-data.json');
    if (localRes.ok) {
      const localData = await localRes.json();
      return localData.map((entry, idx) => {

        // Compute evolutionStage roughly based on species/evolution chain info
        let evolutionStage = entry.evoStage || 1;
        try {
          const evoChain = entry.evolution?.chain;
          let evoCheck = evoChain;
          const speciesName = entry.name;
          while (evoCheck && evoCheck.evolves_to && evoCheck.evolves_to.length > 0) {
            const nextEvo = evoCheck.evolves_to[0];
            if (speciesName === nextEvo.species.name) {
              evolutionStage = 2;
              break;
            } else if (
              nextEvo.evolves_to &&
              nextEvo.evolves_to.length > 0 &&
              speciesName === nextEvo.evolves_to[0].species.name
            ) {
              evolutionStage = 3;
              break;
            }
            evoCheck = nextEvo;
          }
        } catch (e) {
          evolutionStage = 1;
        }

        // Filter out steel and fairy types
        const filteredTypes = entry.types
          ?.filter(t => t !== 'steel' && t !== 'fairy')
          ?.map(t => t);

        return {
          ...entry,
          types: filteredTypes,
          habitat: entry.habitat || 'unknown',
          color: entry.color?.name || 'unknown',
          evolutionStage,
        };
      });
    }
  } catch (err) {
    console.log("ERR");
    // ignore and fall back to network
  }



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
