import { Request, Response, RequestHandler, NextFunction } from 'express';
import { obtainAccessToken, getBasicProfileInfo } from './auth';
import { StartServerOptions, AuthData, BasicProfile } from './server.types';
import { leaveChannel } from '../bot/bot';

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
      .then((profile: BasicProfile) => leaveChannel(profile.login))
      .then((login) => res.render('remove_success', { botname, login }))
      .catch((e) => next(e));
  };
}
