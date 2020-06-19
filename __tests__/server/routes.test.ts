import { Express, Request, Response } from 'express';
import { _this as routes } from '../../src/server/routes';
import * as auth from '../../src/server/auth';
import * as setup from '../../src/setup';
import { StartServerOptions } from '../../src/server/server.types';

describe('routes', () => {
  describe('add', () => {
    it('should return 503 when not setup yet', () => {
      const spy = jest.spyOn(setup, 'isSetupYet').mockReturnValue(false);

      const res = ({
        status: jest.fn(),
        render: jest.fn(),
      } as unknown) as Response;

      const opts = { botname: 'Hey-Bot' } as StartServerOptions;

      routes.add(opts)({} as Request, res, null);

      expect(spy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(503);
    });

    it('should render when set-up', () => {
      jest.spyOn(setup, 'isSetupYet').mockReturnValue(true);

      const res = ({
        render: jest.fn(),
      } as unknown) as Response;

      const opts = { botname: 'Hey-Bot' } as StartServerOptions;

      routes.add(opts)({} as Request, res, null);

      expect(res.render).toHaveBeenCalledWith('add', { botname: 'Hey-Bot' });
    });
  });

  describe('setup', () => {
    it('should redirect to /add when setup already', () => {
      jest.spyOn(setup, 'isSetupYet').mockReturnValue(true);

      const res = ({
        redirect: jest.fn(),
      } as unknown) as Response;

      const opts = { botname: 'Hey-Bot' } as StartServerOptions;

      routes.setup(opts)({} as Request, res, null);

      expect(res.redirect).toHaveBeenCalledWith('/add');
    });

    it('should 401 when no token provided', () => {
      jest.spyOn(setup, 'isSetupYet').mockReturnValue(false);

      const req = {
        query: {},
      } as Request;

      const res = ({
        status: jest.fn(),
        render: jest.fn(),
      } as unknown) as Response;

      const opts = { botname: 'Hey-Bot' } as StartServerOptions;

      routes.setup(opts)(req, res, null);

      expect(res.status).toHaveBeenCalledWith(401);
    });
    it('should 401 when no token invalid', () => {
      jest.spyOn(setup, 'isSetupYet').mockReturnValue(false);
      jest.spyOn(setup, 'getOTP').mockReturnValue('testtest');

      const req = ({
        query: { token: 'test' },
      } as unknown) as Request;

      const res = ({
        status: jest.fn(),
        render: jest.fn(),
      } as unknown) as Response;

      const opts = { botname: 'Hey-Bot' } as StartServerOptions;

      routes.setup(opts)(req, res, null);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('should set cookie and redirect when token valid', () => {
      jest.spyOn(setup, 'isSetupYet').mockReturnValue(false);
      jest.spyOn(setup, 'getOTP').mockReturnValue('testtest');
      const spy = jest.spyOn(auth, 'getOAuthUrl').mockReturnValue('url');

      const req = ({
        query: { token: 'testtest' },
      } as unknown) as Request;

      const res = ({
        redirect: jest.fn(),
        cookie: jest.fn(),
      } as unknown) as Response;

      const opts = {
        botname: 'Hey-Bot',
        setupScopes: [''],
        host: 'test',
      } as StartServerOptions;

      routes.setup(opts)(req, res, null);

      expect(res.cookie).toHaveBeenCalledWith('token', 'testtest', {
        httpOnly: true,
      });
      expect(spy).toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith('url');
    });
  });

  describe('setUpRoutes', () => {
    it('should setup routes correctly', () => {
      const addHandler = jest.fn();
      const setupHandler = jest.fn();
      const setupCbHandler = jest.fn();

      jest.spyOn(routes, 'add').mockReturnValue(addHandler);
      jest.spyOn(routes, 'setup').mockReturnValue(setupHandler);
      jest.spyOn(auth, 'setupCallback').mockReturnValue(setupCbHandler);

      const map = {};
      let use;
      const fakeApp = {
        get: (key, val) => (map[key] = val),
        use: (val) => (use = val),
      } as Express;

      routes.setUpRoutes(fakeApp, {} as StartServerOptions);

      expect(map['/']).toEqual(routes.home);
      expect(map['*']).toEqual(routes.notfound);
      expect(map['/add']).toEqual(addHandler);
      expect(map['/setup']).toEqual(setupHandler);
      expect(map['/setup/callback']).toEqual(setupCbHandler);
      expect(use).toEqual(routes.errorpage);
    });
  });

  test('home should redirect to add', () => {
    const res = ({ redirect: jest.fn() } as unknown) as Response;
    routes.home({} as Request, res);
    expect(res.redirect).toHaveBeenCalledWith('/add');
  });
});
