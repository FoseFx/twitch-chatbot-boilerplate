import { Request, Response, RequestHandler } from 'express';
import { getOAuthUrl } from './auth';
import { StartServerOptions } from './server.types';

/** Using this route streamers can remove the bot from their chat */
export function removeRH(startOptions: StartServerOptions): RequestHandler {
  const { botname } = startOptions;
  return function (_req: Request, res: Response): void {
    const twitchURL = getOAuthUrl(
      startOptions,
      [],
      `${startOptions.host}/remove/callback`,
    );
    res.render('remove', { botname, twitchURL });
  };
}
