import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

export default function setup() {
  const indexPath = resolve(process.cwd(), 'dist/index.html');

  if (!existsSync(indexPath)) {
    execSync('npm run build', { stdio: 'inherit' });
  }
}
