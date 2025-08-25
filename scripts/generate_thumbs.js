const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

// This script depends on the `sharp` npm package. Install it with:
// npm install --save-dev sharp

const POKEMON_DIR = path.join(__dirname, '..', 'public', 'pokemon');
const THUMBS_DIR = path.join(POKEMON_DIR, 'thumbs');

if (!fs.existsSync(POKEMON_DIR)) {
  console.error('No pokemon dir found at', POKEMON_DIR);
  process.exit(1);
}
if (!fs.existsSync(THUMBS_DIR)) fs.mkdirSync(THUMBS_DIR, { recursive: true });

async function makeThumb(src, dest) {
  // Use sharp if available, otherwise fall back to calling ImageMagick `convert` if present
  try {
  // eslint-disable-next-line global-require
  const sharp = require('sharp');
  // Resize so the longest edge is ~200px
  await sharp(src).resize(200, 200, { fit: 'inside' }).png({ quality: 80 }).toFile(dest);
    return true;
  } catch (err) {
    // Try ImageMagick convert as fallback
  const convert = spawnSync('convert', [src, '-resize', '200x200', dest]);
    return convert.status === 0;
  }
}

async function main() {
  const files = fs.readdirSync(POKEMON_DIR).filter(f => f.match(/^\d+\.png$/));
  for (const f of files) {
    const src = path.join(POKEMON_DIR, f);
    const dest = path.join(THUMBS_DIR, f);
    if (fs.existsSync(dest)) {
      console.log(`${f} already thumbnailed`);
      continue;
    }
    try {
      // eslint-disable-next-line no-await-in-loop
      const ok = await makeThumb(src, dest);
      console.log(`${f} -> ${ok ? 'ok' : 'failed'}`);
    } catch (err) {
      console.error('thumb failed', f, err.message);
    }
  }
}

main().catch(err => { console.error(err); process.exit(1); });
