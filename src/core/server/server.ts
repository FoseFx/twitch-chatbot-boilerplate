import { Express } from 'express';
import * as bodyparser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import { StartServerOptions } from './server.types';
import { setUpRoutes } from './routes';
import { newExpressApp, verifyFilesExist } from './util';

/**
 * In order to function a Twitch Chatbot needs an http server.
 *
 * This server is responsible for
 *
 * 1. the connection between your bot and your bot's Twitch account and
 * 2. allowing streamers to "invite" your bot to their chat
 *
 */
export async function startServer(
  options: StartServerOptions,
): Promise<Express> {
  verifyFilesExist();
  const app = newExpressApp();
  app.use(cookieParser());
  app.use(bodyparser.json());

  app.set('view engine', 'ejs');

  setUpRoutes(app, options);

  app.listen(options.port, () =>
    console.log(`HTTP-Server listening on port ${options.port}`),
  );

  return app;
}
