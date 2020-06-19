import {
  Request,
  Response,
  Express,
  NextFunction,
  RequestHandler,
} from 'express';
import { isSetupYet, getOTP } from '../setup';
import { StartServerOptions } from './server.types';
import { getOAuthUrl, setupCallback } from './auth';

export function setUpRoutes(
  app: Express,
  startOptions: StartServerOptions,
): void {
  app.get('/', _this.home);
  app.get('/add', _this.add(startOptions));
  app.get('/setup', _this.setup(startOptions));
  app.get('/setup/callback', setupCallback(startOptions));
  app.get('*', _this.notfound);
  app.use(_this.errorpage);
}

export function home(_req: Request, res: Response): void {
  res.redirect('/add');
}

/** Using this route streamers can add the bot to their chat */
export function add(startOptions: StartServerOptions): RequestHandler {
  const { botname } = startOptions;
  return function (_req: Request, res: Response): void {
    if (isSetupYet()) {
      res.render('add', { botname });
      return;
    }
    res.status(503);
    res.render('error', {
      heading: '503 - Not set up yet',
      message: 'The owner did not finish the setup yet. Please be patient.',
    });
  };
}

/** Using this route the owner can connect the bot's twitch account with the bot */
export function setup(startOptions: StartServerOptions): RequestHandler {
  return function (req: Request, res: Response): void {
    if (isSetupYet()) {
      res.redirect('/add');
      return;
    }

    const { token } = req.query;
    if (!token || token !== getOTP()) {
      res.status(401);
      res.render('error', {
        heading: '401 - Unauthorized',
        message: 'Token invalid or not provided',
      });
      return;
    }

    res.cookie('token', token, { httpOnly: true });
    res.redirect(
      getOAuthUrl(
        startOptions,
        startOptions.setupScopes,
        `${startOptions.host}/setup/callback`,
      ),
    );
  };
}

export function notfound(_req: Request, res: Response): void {
  res.status(404).render('error', {
    heading: '404 - Not Found',
    message: 'The path you provided is invalid',
  });
}

export function errorpage(
  error: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  res.status(500);
  res.render('error', {
    heading: '500 - Internal Server Error',
    message: error.message,
  });
  throw error;
}

export const _this = {
  setUpRoutes,
  home,
  add,
  setup,
  notfound,
  errorpage,
};
