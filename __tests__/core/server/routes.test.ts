import { Express, Request, Response } from 'express';
import { _this as routes } from '../../../src/core/server/routes';
import * as auth from '../../../src/core/server/auth';
import * as add from '../../../src/core/server/add';
import * as setup from '../../../src/core/setup';
import { StartServerOptions } from '../../../src/core/server/server.types';

describe('routes', () => {
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

    it('should set cookie and redirect when token valid', () => {
      jest.spyOn(setup, 'isSetupYet').mockReturnValue(false);
      jest.spyOn(setup, 'getOTP').mockReturnValue('testtest');
      const spy = jest.spyOn(auth, 'getOAuthUrl').mockReturnValue('url');

      const req = ({} as unknown) as Request;

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

      expect(spy).toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith('url');
    });
  });

  describe('setUpRoutes', () => {
    it('should setup routes correctly', () => {
      const addHandler = jest.fn();
      const setupHandler = jest.fn();
      const setupCbHandler = jest.fn();

      jest.spyOn(add, 'addRH').mockReturnValue(addHandler);
      jest.spyOn(routes, 'setup').mockReturnValue(setupHandler);
      jest.spyOn(auth, 'setupCallback').mockReturnValue(setupCbHandler);

      const map = {};
      let use;
      const fakeApp = {
        get: (key, ...vals) => (map[key] = vals),
        use: (val) => (use = val),
      } as Express;

      routes.setUpRoutes(fakeApp, {} as StartServerOptions);

      expect(map['/'][0]).toEqual(routes.home);
      expect(map['*'][0]).toEqual(routes.notfound);
      expect(map['/add'][1]).toEqual(addHandler);
      expect(map['/setup'][1]).toEqual(setupHandler);
      expect(map['/setup/callback'][1]).toEqual(setupCbHandler);
      expect(use).toEqual(routes.errorpage);
    });
  });

  test('home should redirect to add', () => {
    const res = ({ redirect: jest.fn() } as unknown) as Response;
    routes.home({} as Request, res);
    expect(res.redirect).toHaveBeenCalledWith('/add');
  });
});
