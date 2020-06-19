import * as express from 'express';
import { Express } from 'express';

export function newExpressApp(): Express {
  return express();
}
