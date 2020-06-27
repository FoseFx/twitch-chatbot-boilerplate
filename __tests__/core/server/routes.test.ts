import { Express, Request, Response } from 'express';
import {
  _this as routes,
  typicalRequestHandler,
} from '../../../src/core/server/routes';
import * as auth from '../../../src/core/server/auth';
import * as add from '../../../src/core/server/add';
import * as remove from '../../../src/core/server/remove';
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
    it('should call beforeRouteSetup() and setup routes correctly', () => {
      const addHandler = jest.fn();
      const addCbHandler = jest.fn();
      const removeHandler = jest.fn();
      const removeCbHandler = jest.fn();
      const setupHandler = jest.fn();
      const setupCbHandler = jest.fn();

      jest.spyOn(routes, 'typicalRequestHandler').mockImplementation((type) => {
        return type === 'add' ? addHandler : removeHandler;
      });
      jest.spyOn(add, 'addCallbackRH').mockReturnValue(addCbHandler);
      jest.spyOn(remove, 'removeCallbackRH').mockReturnValue(removeCbHandler);
      jest.spyOn(routes, 'setup').mockReturnValue(setupHandler);
      jest.spyOn(auth, 'setupCallback').mockReturnValue(setupCbHandler);

      const map = {};
      let use;
      const fakeApp = {
        get: (key, ...vals) => (map[key] = vals),
        use: (val) => (use = val),
      } as Express;

      const beforeRouteSetup = jest.fn();
      const options = ({ beforeRouteSetup } as unknown) as StartServerOptions;

      routes.setUpRoutes(fakeApp, options);

      expect(beforeRouteSetup).toHaveBeenCalledWith(fakeApp);

      expect(map['/'][0]).toEqual(routes.home);
      expect(map['*'][0]).toEqual(routes.notfound);
      expect(map['/add'][1]).toEqual(addHandler);
      expect(map['/add/callback'][2]).toEqual(addCbHandler);
      expect(map['/remove'][1]).toEqual(removeHandler);
      expect(map['/remove/callback'][2]).toEqual(removeCbHandler);
      expect(map['/setup'][1]).toEqual(setupHandler);
      expect(map['/setup/callback'][2]).toEqual(setupCbHandler);
      expect(use).toEqual(routes.errorpage);
    });
  });

  test('home should redirect to add', () => {
    const res = ({ redirect: jest.fn() } as unknown) as Response;
    routes.home({} as Request, res);
    expect(res.redirect).toHaveBeenCalledWith('/add');
  });

  describe('typicalRequestHandler', () => {
    const opts = {
      botname: 'Hey-Bot',
      host: 'http://localhost:8080',
    } as StartServerOptions;
    const exp = {
      botname: 'Hey-Bot',
      twitchURL: 'https://www.test.com/test?test',
    };

    let res;
    let getOAuthUrlSpy;
    beforeEach(() => {
      getOAuthUrlSpy = jest
        .spyOn(auth, 'getOAuthUrl')
        .mockReset()
        .mockReturnValue('https://www.test.com/test?test');

      res = ({
        render: jest.fn(),
      } as unknown) as Response;
    });
    it('should render add', () => {
      typicalRequestHandler('add', opts)({} as Request, res, null);
      expect(res.render).toHaveBeenCalledWith('add', exp);
      expect(getOAuthUrlSpy).toHaveBeenCalledWith(
        opts,
        [],
        'http://localhost:8080/add/callback',
      );
    });
    it('should render remove', () => {
      typicalRequestHandler('remove', opts)({} as Request, res, null);
      expect(res.render).toHaveBeenCalledWith('remove', exp);
      expect(getOAuthUrlSpy).toHaveBeenCalledWith(
        opts,
        [],
        'http://localhost:8080/remove/callback',
      );
    });
  });
});
