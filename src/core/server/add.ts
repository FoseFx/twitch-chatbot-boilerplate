import { StartServerOptions } from './server.types';
import { RequestHandler, Request, Response } from 'express';
import { getOAuthUrl } from './auth';

/** Using this route streamers can add the bot to their chat */
export function addRH(startOptions: StartServerOptions): RequestHandler {
  const { botname } = startOptions;
  return function (_req: Request, res: Response): void {
    const twitchURL = getOAuthUrl(
      startOptions,
      [],
      `${startOptions.host}/add/callback`,
    );
    res.render('add', { botname, twitchURL });
  };
}
