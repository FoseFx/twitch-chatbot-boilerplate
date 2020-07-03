import { Express } from 'express';
import { Client } from 'tmi.js';
import { EventEmitter } from 'events';
import { StartServerOptions } from './server/server.types';
import { loadEnvVariables } from './env';
import { startServer } from './server/server';
import { setup } from './setup';
import * as bot from './bot/bot';
import { setClientReadyEmitter } from './event';

export interface InitializeOptions {
  beforeRouteSetup?: (app: Express) => void;
}

export function initialize(
  initializeOptions: InitializeOptions = {},
): Promise<{ client: Client; app: Express }> {
  return new Promise((resolve, reject) => {
    loadEnvVariables(); // make sure all variables are available

    const opts: StartServerOptions = {
      host: process.env.HOST,
      port: +process.env.PORT,
      botname: process.env.BOTNAME,
      clientId: process.env.TWITCH_CLIENT_ID,
      clientSecret: process.env.TWITCH_CLIENT_SECRET,
      setupScopes: ['chat:read', 'chat:edit'],
      beforeRouteSetup: initializeOptions.beforeRouteSetup,
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
      .then((authData) => bot.startBot(opts, authData))
      .catch((error) => reject(error));

    clientEventEmitter.once('clientReady', (client: Client) => {
      client.connect = () => {
        throw new Error(
          'The twitch-chatbot-boilerplate core gave you an already connected client, there is no need to call connect()',
        );
      };
      client.disconnect = () => {
        throw new Error('You should not call disconnect()');
      };

      resolve({ client, app });
    });
  });
}

export const joinChannel = bot.joinChannel;

export const leaveChannel = bot.leaveChannel;
