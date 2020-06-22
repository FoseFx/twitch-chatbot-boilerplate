import * as dotenv from 'dotenv';
import * as env from '../../src/core/env';

describe('env.ts', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    jest.spyOn(dotenv, 'config').mockReturnValue(undefined);
    process.env = {};
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it('should throw an error including the missing env variables', () => {
    process.env.HOST = 'http://localhost:3000';
    process.env.TWITCH_CLIENT_ID = 'http://localhost:3000';

    expect(env.loadEnvVariables).toThrow(
      'Not all necessary environment variables were set. Missing: PORT, TWITCH_CLIENT_SECRET, BOTNAME',
    );
  });

  it('be silet when everything is fine', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('../../.jest/utils').sampleEnv(process);
    expect(env.loadEnvVariables).not.toThrowError();
  });
});
