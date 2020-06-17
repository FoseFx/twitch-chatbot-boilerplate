/**
 * In order to function a Twitch Chatbot needs an http server.
 *
 * This server is responsible for
 *
 * 1. the connection between your bot and your bot's Twitch account and
 * 2. allowing streamers to "invite" your bot to their chat
 *
 */

import { StartServerOptions } from './server.types';

export async function startServer(
  _options: StartServerOptions,
): Promise<void> {}
