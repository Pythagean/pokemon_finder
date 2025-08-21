const https = require('https');
const fs = require('fs');
const path = require('path');

// Downloads Gen 1 official artwork (ids 1..151) into public/pokemon/{id}.png
const OUT_DIR = path.join(__dirname, '..', 'public', 'pokemon');
const START = 1;
const END = 151;

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        file.close();
        fs.unlink(dest, () => {});
        return reject(new Error(`Failed to get '${url}' (${res.statusCode})`));
      }
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function main() {
  console.log(`Downloading Pokémon images to ${OUT_DIR}`);
  for (let id = START; id <= END; id++) {
    const url = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
    const dest = path.join(OUT_DIR, `${id}.png`);
    try {
      if (fs.existsSync(dest)) {
        console.log(`${id}.png already exists, skipping`);
        continue;
      }
      console.log(`Downloading ${id}.png ...`);
      // eslint-disable-next-line no-await-in-loop
      await download(url, dest);
      console.log(`Saved ${dest}`);
    } catch (err) {
      console.error(`Failed ${id}:`, err.message);
    }
  }
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
