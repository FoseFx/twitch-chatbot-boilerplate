import { Request, Response, Express, NextFunction } from 'express';

export function setUpRoutes(app: Express): void {
  app.get('/', home);
  app.get('*', notfound);
  app.use(errorpage);
}

export function home(_req: Request, res: Response): void {
  throw new Error('ksjidasd');
  res.render('index');
}

export function notfound(_req: Request, res: Response): void {
  res.status(404).render('error', {
    data: {
      heading: '404 - Not Found',
      message: 'The path you provided is invalid',
    },
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
    data: { heading: '500 - Internal Server Error', message: error.message },
  });
  throw error;
}
