import { Express } from 'express';
import { Client } from 'tmi.js';
import { EventEmitter } from 'events';
import { StartServerOptions } from './server/server.types';
import { loadEnvVariables } from './env';
import { startServer } from './server/server';
import { setup } from './setup';
import { startBot } from './bot/bot';
import { setClientReadyEmitter } from './event';

export function initialize(): Promise<{ client: Client; app: Express }> {
  return new Promise((resolve, reject) => {
    loadEnvVariables(); // make sure all variables are available

    const opts: StartServerOptions = {
      host: process.env.HOST,
      port: +process.env.PORT,
      botname: process.env.BOTNAME,
      clientId: process.env.TWITCH_CLIENT_ID,
      clientSecret: process.env.TWITCH_CLIENT_SECRET,
      setupScopes: ['chat:read', 'chat:edit'],
    };

    // after the bot is ready the "clientReady" event is fired on this one
    const clientEventEmitter = new EventEmitter();
    setClientReadyEmitter(clientEventEmitter);

    let app: Express;

    startServer(opts)
      .then((expressApp) => {
        app = expressApp;
        return setup(opts);
      })
      .then((authData) => startBot(opts, authData))
      .catch((error) => reject(error));

    clientEventEmitter.once('clientReady', (client: Client) => {
      resolve({ client, app });
    });
  });
}
