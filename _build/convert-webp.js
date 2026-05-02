const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const logosDir = path.join(__dirname, '../logos');
const rootDir = path.join(__dirname, '..');

const jobs = [
  // logos/
  { src: path.join(logosDir, 'batifer.jpg'),             dest: path.join(logosDir, 'batifer.webp') },
  { src: path.join(logosDir, 'saint-gobain.png'),        dest: path.join(logosDir, 'saint-gobain.webp') },
  { src: path.join(logosDir, 'sogea-maroc.png'),         dest: path.join(logosDir, 'sogea-maroc.webp') },
  { src: path.join(logosDir, 'tectra.png'),              dest: path.join(logosDir, 'tectra.webp') },
  { src: path.join(logosDir, 'profils-recrutement.png'), dest: path.join(logosDir, 'profils-recrutement.webp') },
  // root
  { src: path.join(rootDir, 'logo.png'),                 dest: path.join(rootDir, 'logo.webp') },
];

(async () => {
  for (const { src, dest } of jobs) {
    if (!fs.existsSync(src)) { console.log(`SKIP (not found): ${src}`); continue; }
    try {
      const info = await sharp(src).webp({ quality: 82 }).toFile(dest);
      const srcSize  = fs.statSync(src).size;
      const destSize = info.size;
      console.log(`OK  ${path.basename(src)} → ${path.basename(dest)} | ${(srcSize/1024).toFixed(1)}KB → ${(destSize/1024).toFixed(1)}KB (${Math.round((1 - destSize/srcSize)*100)}% smaller)`);
    } catch(e) {
      console.error(`ERR ${path.basename(src)}: ${e.message}`);
    }
  }
})();
