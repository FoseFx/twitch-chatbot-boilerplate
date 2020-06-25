import {
  Request,
  Response,
  Express,
  NextFunction,
  RequestHandler,
} from 'express';
import * as express from 'express';
import { isSetupYet } from '../setup';
import { StartServerOptions } from './server.types';
import { getOAuthUrl, setupCallback } from './auth';
import { hasValidToken, onlyWhenSetup, hasCodeQuery } from './util';
import { addRH, addCallbackRH } from './add';
import { removeRH, removeCallbackRH } from './remove';

export function setUpRoutes(
  app: Express,
  startOptions: StartServerOptions,
): void {
  // Add
  app.get('/', _this.home);
  app.get('/add', onlyWhenSetup, addRH(startOptions));
  app.get(
    '/add/callback',
    onlyWhenSetup,
    hasCodeQuery,
    addCallbackRH(startOptions),
  );

  // Remove
  app.get('/remove', onlyWhenSetup, removeRH(startOptions));
  app.get(
    '/remove/callback',
    onlyWhenSetup,
    hasCodeQuery,
    removeCallbackRH(startOptions),
  );

  // Setup
  app.get('/setup', hasValidToken('query'), _this.setup(startOptions));
  app.get(
    '/setup/callback',
    hasValidToken('cookies'),
    hasCodeQuery,
    setupCallback(startOptions),
  );

  // Static
  app.use(express.static('public'));
  // 404
  app.get('*', _this.notfound);
  // Error page
  app.use(_this.errorpage);
}

export function home(_req: Request, res: Response): void {
  res.redirect('/add');
}

/** Using this route the owner can connect the bot's twitch account with the bot */
export function setup(startOptions: StartServerOptions): RequestHandler {
  return function (_req: Request, res: Response): void {
    if (isSetupYet()) {
      res.redirect('/add');
      return;
    }

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
  setup,
  notfound,
  errorpage,
};
