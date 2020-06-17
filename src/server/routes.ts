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
  app.get('/', home);
  app.get('/add', add(startOptions));
  app.get('/setup', setup(startOptions));
  app.get('/setup/callback', setupCallback(startOptions));
  app.get('*', notfound);
  app.use(errorpage);
}

export function home(_req: Request, res: Response): void {
  res.redirect('/add');
}

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
