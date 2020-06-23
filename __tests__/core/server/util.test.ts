import { Request, Response, NextFunction } from 'express';
import * as setup from '../../../src/core/setup';
import {
  hasValidToken,
  onlyWhenSetup,
  hasCodeQuery,
} from '../../../src/core/server/util';

describe('util', () => {
  describe('hasValidToken()', () => {
    let res;
    beforeEach(() => {
      res = ({
        status: jest.fn(),
        render: jest.fn(),
        cookie: jest.fn(),
      } as unknown) as Response;
      jest.spyOn(setup, 'getOTP').mockReturnValue('testtest');
    });

    it('should 401 when no or invalid token provided', () => {
      const next = jest.fn();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let req = { cookies: {} } as any;

      hasValidToken('cookies')(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.render).toHaveBeenCalledWith('error', {
        heading: '401 - Unauthorized',
        message: 'Token invalid or not provided',
      });

      req = {
        query: { token: 'test' },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any;

      hasValidToken('query')(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.render).toHaveBeenCalledWith('error', {
        heading: '401 - Unauthorized',
        message: 'Token invalid or not provided',
      });
    });

    it('should call next and set cookie', () => {
      const next = jest.fn();

      const req = {
        query: { token: 'testtest' },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any;

      hasValidToken('query')(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.render).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.cookie).toHaveBeenCalledWith('token', 'testtest', {
        httpOnly: true,
      });
    });
  });

  describe('onlyWhenSetup', () => {
    it('should return 503 when not setup yet', () => {
      const spy = jest.spyOn(setup, 'isSetupYet').mockReturnValue(false);

      const res = ({
        status: jest.fn(),
        render: jest.fn(),
      } as unknown) as Response;

      const next = jest.fn();

      onlyWhenSetup(null, res, next);

      expect(spy).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(503);
    });

    it('should call next when setup', () => {
      jest.spyOn(setup, 'isSetupYet').mockReturnValue(true);

      const next = jest.fn();

      onlyWhenSetup(null, null, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe('hasCodeQuery', () => {
    let res: Response;
    let next: NextFunction;

    beforeEach(() => {
      res = ({
        status: jest.fn(),
        render: jest.fn(),
      } as unknown) as Response;
      next = jest.fn();
    });

    it('should return 400 when no code is set', async () => {
      const req = { query: {} } as Request;

      hasCodeQuery(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
