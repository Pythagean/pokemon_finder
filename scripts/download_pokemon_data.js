const https = require('https');
const fs = require('fs');
const path = require('path');

const OUT_FILE = path.join(__dirname, '..', 'public', 'pokemon-data.json');
const API_BASE = 'https://pokeapi.co/api/v2';

async function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let raw = '';
      res.on('data', (chunk) => raw += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(raw));
          } catch (err) {
            reject(err);
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        }
      });
    }).on('error', reject);
  });
}

(async function main() {
  try {
    console.log('Fetching Pokémon data (1..151)...');
    const results = [];
    for (let id = 1; id <= 151; id++) {
      process.stdout.write(`.${id}`);
      const pUrl = `${API_BASE}/pokemon/${id}`;
      const sUrl = `${API_BASE}/pokemon-species/${id}`;
      const pokemon = await fetchJson(pUrl);
      const species = await fetchJson(sUrl);
      // get evolution chain (simplified)
      let evolution = null;
      try {
        const evo = await fetchJson(species.evolution_chain.url);
        // simplify evolution chain into an array of species { name, id }
        const walk = (node, acc = []) => {
          const m = node.species.url.match(/\/(\d+)\/?$/);
          const sid = m ? parseInt(m[1], 10) : null;
          acc.push({ name: node.species.name, id: sid });
          if (node.evolves_to && node.evolves_to.length > 0) {
            node.evolves_to.forEach(child => walk(child, acc));
          }
          return acc;
        };
        evolution = walk(evo.chain, []);
      } catch (e) {
        evolution = null;
      }

      // build compact object with only required fields
      const compact = {
        id: pokemon.id,
        name: pokemon.name,
        sprite: pokemon.sprites?.other?.['official-artwork']?.front_default || null,
        types: pokemon.types.map(t => t.type.name),
        height: pokemon.height,
        weight: pokemon.weight,
        habitat: species.habitat?.name || null,
        color: species.color?.name || null,
        evolution
      };
      results.push(compact);
    }
    fs.writeFileSync(OUT_FILE, JSON.stringify(results), 'utf8');
    console.log('\nSaved to', OUT_FILE);
  } catch (err) {
    console.error('Failed to download data:', err.message);
    process.exitCode = 1;
  }
})();
