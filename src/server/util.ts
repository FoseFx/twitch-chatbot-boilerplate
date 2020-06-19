import * as express from 'express';
import {
  Express,
  RequestHandler,
  Request,
  Response,
  NextFunction,
} from 'express';
import { getOTP } from '../setup';

export function newExpressApp(): Express {
  return express();
}
/**
 *  This middleware ensures only the admin with the correct token can access the resource.
 * It also sets the cookie, in case there is none
 * */
export function hasValidToken(medium: 'query' | 'cookies'): RequestHandler {
  return function (req: Request, res: Response, next: NextFunction): void {
    const { token } = req[medium];
    if (!token || token !== getOTP()) {
      res.status(401);
      res.render('error', {
        heading: '401 - Unauthorized',
        message: 'Token invalid or not provided',
      });
    } else {
      res.cookie('token', token, { httpOnly: true });
      next();
    }
  };
}
