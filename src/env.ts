import * as dotenv from 'dotenv';

export function loadEnvVariables(): void {
  dotenv.config();

  const necessaryKeys = ['HOST', 'PORT'];
  const missingKeys = [];

  for (const key of necessaryKeys) {
    if (!(key in process.env)) {
      missingKeys.push(key);
    }
  }

  if (missingKeys.length !== 0) {
    throw new Error(
      'Not all necessary environment variables were set. Missing: ' +
        necessaryKeys.reduce((prev, current) => prev + ', ' + current),
    );
  }
}
