import * as setup from '../../src/setup';
import { hasValidToken } from '../../src/server/util';

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

    describe('401s', () => {
      it('should 401 when no or invalid token provided in query', () => {
        const next = jest.fn();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let req = { query: {} } as any;

        hasValidToken('query')(req, res, next);

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

      it('should 401 when no or invalid token provided in cookies', () => {
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
          cookies: { token: 'test' },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any;

        hasValidToken('cookies')(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.render).toHaveBeenCalledWith('error', {
          heading: '401 - Unauthorized',
          message: 'Token invalid or not provided',
        });
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
});
