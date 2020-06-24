import * as fs from 'fs';

export function ensureDirExists(dir: fs.PathLike): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}
