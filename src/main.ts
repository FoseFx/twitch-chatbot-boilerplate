import { loadEnvVariables } from './env';
import { startServer } from './server/server';
import { setup } from './setup';
import { StartServerOptions } from './server/server.types';

loadEnvVariables(); // make sure all variables are available

const opts: StartServerOptions = {
  host: process.env.HOST,
  port: +process.env.PORT,
  botname: process.env.BOTNAME,
  clientId: process.env.TWITCH_CLIENT_ID,
  clientSecret: process.env.TWITCH_CLIENT_SECRET,
  setupScopes: ['chat:read', 'chat:edit'],
};

startServer(opts)
  .then(() => setup(opts))
  .then(/* TODO: start bot, dont if authdata null */);
