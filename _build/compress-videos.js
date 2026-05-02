/**
 * compress-videos.js
 * Re-encodes hero background videos for fast web loading:
 *   - Strips audio (videos are muted backgrounds)
 *   - movflags +faststart  → moov atom at front, playback starts while downloading
 *   - CRF 28              → ~40% smaller than default, imperceptible on a background
 *   - fps cap 24          → background loops don't need 30fps
 */

const ffmpegPath = require('ffmpeg-static');
const ffmpeg     = require('fluent-ffmpeg');
const path       = require('path');
const fs         = require('fs');

ffmpeg.setFfmpegPath(ffmpegPath);

const SRC_DIR  = path.join(__dirname, '..');
const DEST_DIR = path.join(__dirname, '..');

const jobs = [
  {
    input:  'hero-bg.mp4',
    output: 'hero-bg.mp4',
    label:  'Desktop hero (1440p→compressed)',
  },
  {
    input:  'hero-bg-mobile.mp4',
    output: 'hero-bg-mobile.mp4',
    label:  'Mobile hero (compressed)',
  },
];

function sizeKB(filePath) {
  try { return Math.round(fs.statSync(filePath).size / 1024); }
  catch (e) { return 0; }
}

function compress(job) {
  return new Promise((resolve, reject) => {
    const src  = path.join(SRC_DIR,  job.input);
    const tmp  = path.join(DEST_DIR, '_tmp_' + job.output);
    const dest = path.join(DEST_DIR, job.output);

    const beforeKB = sizeKB(src);
    console.log(`\n▶ ${job.label}`);
    console.log(`  Input:  ${beforeKB} KB`);

    ffmpeg(src)
      .noAudio()                             // strip audio — muted background
      .videoCodec('libx264')
      .outputOptions([
        '-crf 28',                           // quality vs size tradeoff
        '-preset fast',                      // encode speed
        '-vf fps=24',                        // cap at 24fps
        '-pix_fmt yuv420p',                  // max browser compatibility
        '-movflags +faststart',              // moov atom first → starts playing immediately
        '-profile:v baseline',              // broadest mobile compatibility
        '-level 3.1',
      ])
      .output(tmp)
      .on('end', () => {
        const afterKB = sizeKB(tmp);
        const saving  = Math.round((1 - afterKB / beforeKB) * 100);
        if (fs.existsSync(dest)) fs.unlinkSync(dest);
        fs.renameSync(tmp, dest);
        console.log(`  Output: ${afterKB} KB  (−${saving}% saved)`);
        resolve();
      })
      .on('error', (err) => {
        if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
        console.error(`  ✗ Error: ${err.message}`);
        reject(err);
      })
      .run();
  });
}

(async () => {
  console.log('=== Hero video compression ===');
  for (const job of jobs) {
    await compress(job);
  }
  console.log('\n✓ Done. Reload the page to see the faster video.');
})();
