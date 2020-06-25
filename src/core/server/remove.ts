import { Request, Response, RequestHandler, NextFunction } from 'express';
import { getOAuthUrl, obtainAccessToken, getBasicProfileInfo } from './auth';
import { StartServerOptions, AuthData } from './server.types';
import { leaveChannel } from '../bot/bot';

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

/** /add/callback RequestHandler */
export function removeCallbackRH(options: StartServerOptions): RequestHandler {
  const { botname } = options;

  return function (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { code } = req.query;

    return obtainAccessToken(
      options,
      code as string,
      `${options.host}/setup/callback`,
    )
      .then((auth: AuthData) => getBasicProfileInfo(options, auth))
      .then(leaveChannel)
      .then((login) => res.render('remove_success', { botname, login }))
      .catch((e) => next(e));
  };
}
