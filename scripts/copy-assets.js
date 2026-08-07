import { copyFileSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');

const DIST_PUBLIC = resolve(ROOT, 'dist', 'public');
const DIST_PUBLIC_JS = resolve(DIST_PUBLIC, 'js');
const SRC_FRONTEND_PUBLIC = resolve(ROOT, 'src', 'frontend', 'public');
const SRC_FRONTEND_STYLES = resolve(ROOT, 'src', 'frontend', 'styles');

const mode = process.argv[2];

if (mode === 'clean') {
  rmSync(DIST_PUBLIC, { recursive: true, force: true });
  mkdirSync(DIST_PUBLIC_JS, { recursive: true });
  console.log('[copy-assets] Cleaned dist/public and created dist/public/js');
} else if (mode === 'copy') {
  mkdirSync(DIST_PUBLIC, { recursive: true });
  
  copyFileSync(
    resolve(SRC_FRONTEND_PUBLIC, 'index.html'),
    resolve(DIST_PUBLIC, 'index.html')
  );
  
  copyFileSync(
    resolve(SRC_FRONTEND_STYLES, 'main.css'),
    resolve(DIST_PUBLIC, 'main.css')
  );
  
  console.log('[copy-assets] Copied index.html and main.css to dist/public');
} else {
  console.error(`[copy-assets] ERREUR : Mode inconnu "${mode}". Modes valides : clean, copy`);
  process.exit(1);
}
