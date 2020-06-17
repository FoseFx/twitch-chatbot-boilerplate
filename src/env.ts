import * as dotenv from 'dotenv';

export function loadEnvVariables(): void {
  dotenv.config();

  const necessaryKeys = [
    'HOST',
    'PORT',
    'TWITCH_CLIENT_ID',
    'TWITCH_CLIENT_SECRET',
  ];
  const missingKeys = [];

  for (const key of necessaryKeys) {
    const varSet = key in process.env;

    if (!varSet) {
      missingKeys.push(key);
    }
  }

  if (missingKeys.length !== 0) {
    throw new Error(
      'Not all necessary environment variables were set. Missing: ' +
        missingKeys.reduce((prev, current) => prev + ', ' + current),
    );
  }
}
