import * as fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import { Response as FetchResponse } from 'node-fetch';
import * as setup from '../../../src/core/setup';
import * as bot from '../../../src/core/bot/bot';
import {
  hasValidToken,
  onlyWhenSetup,
  hasCodeQuery,
  extractFetchErrorMessage,
  ensureFetchIsOk,
  verifyFilesExist,
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
      jest.spyOn(bot, 'isBotRunning').mockReturnValue(false);

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
      jest.spyOn(bot, 'isBotRunning').mockReturnValue(true);

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
    it('should call next when code is set', async () => {
      const req = ({ query: { code: 'test' } } as unknown) as Request;

      hasCodeQuery(req, res, next);
      expect(res.status).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });

  describe('extractFetchErrorMessage', () => {
    it('should return message when available', () => {
      expect(
        extractFetchErrorMessage({ status: 400, message: 'Mmhh' }),
      ).toEqual('Mmhh');
    });
    it('should return status when no message available', () => {
      expect(
        extractFetchErrorMessage({ status: 400, mmessage: 'Mmhh' } as unknown),
      ).toEqual('400');
    });
    it('should return object when no message or status available', () => {
      expect(extractFetchErrorMessage({ test: 'test' } as unknown)).toEqual(
        '{"test":"test"}',
      );
    });
  });

  describe('ensureFetchIsOk', () => {
    it('should return resp when is resp is ok', () => {
      const fakeResp = ({ ok: true } as unknown) as FetchResponse;

      return ensureFetchIsOk(fakeResp).then((r) => expect(r).toEqual(fakeResp));
    });
    it('should return error with json when json body', () => {
      expect.assertions(1);
      const fakeResp = ({
        ok: false,
        json: () => Promise.resolve({ test: 'test' }),
      } as unknown) as FetchResponse;

      return ensureFetchIsOk(fakeResp).catch((error) => {
        expect(error).toEqual(
          new Error(
            'An error has occurred while reaching out to the TwitchAPI: {"test":"test"}',
          ),
        );
      });
    });
    it('should return generic error when json() fails', () => {
      expect.assertions(1);
      const fakeResp = ({
        ok: false,
        json: () => Promise.reject('Who cares?'),
      } as unknown) as FetchResponse;

      return ensureFetchIsOk(fakeResp).catch((error) => {
        expect(error).toEqual(
          new Error(
            'An error has occurred while reaching out to the TwitchAPI',
          ),
        );
      });
    });
  });

  describe('verifyFilesExist', () => {
    let existsMock: jest.SpyInstance;

    beforeEach(() => {
      jest.resetAllMocks();
      existsMock = jest.spyOn(fs, 'existsSync');
    });

    it('should throw Error with missing files', () => {
      existsMock.mockImplementation((file) => {
        return file === 'views/ok.ejs';
      });

      expect(verifyFilesExist).toThrowError(
        new Error(
          `Can't start server, the following files are missing: ["views/add.ejs","views/add_success.ejs","views/error.ejs","views/remove.ejs","views/remove_success.ejs"]\nIn case you are using the npm package, read the setup guide!`,
        ),
      );
    });

    it('should not throw when every file exists', () => {
      existsMock.mockImplementation(() => true);
      expect(verifyFilesExist).not.toThrow();
    });
  });
});
