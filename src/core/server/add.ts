import { StartServerOptions, AuthData } from './server.types';
import { RequestHandler, Request, Response, NextFunction } from 'express';
import { obtainAccessToken, getBasicProfileInfo } from './auth';
import { joinChannel } from '../bot/bot';

/** /add/callback RequestHandler */
export function addCallbackRH(options: StartServerOptions): RequestHandler {
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
      .then(joinChannel)
      .then((login) => res.render('add_success', { botname, login }))
      .catch((e) => next(e));
  };
}
