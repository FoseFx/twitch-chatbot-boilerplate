import { Request, Response, Express, NextFunction } from 'express';
import { StartServerOptions } from './server.types';

export function setUpRoutes(
  app: Express,
  startOptions: StartServerOptions,
): void {
  app.get('/', home);
  app.get('/add', add(startOptions.botname));
  app.get('*', notfound);
  app.use(errorpage);
}

export function home(_req: Request, res: Response): void {
  res.redirect('/add');
}

export function add(botname: string) {
  return function add(_req: Request, res: Response): void {
    res.render('add', { botname });
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
