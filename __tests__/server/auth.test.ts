import { Request, Response } from 'express';
import * as nock from 'nock';
import { _this as auth } from '../../src/server/auth';
import * as setup from '../../src/setup';
import {
  StartServerOptions,
  TokenResponse,
  AuthData,
} from '../../src/server/server.types';

describe('auth', () => {
  afterEach(() => {
    nock.cleanAll();
  });
  it('should generate an OAuthUrl', () => {
    const opts = { clientId: 'someClientIdLol' } as StartServerOptions;
    const scopes = ['scope:one', 'something_else', 'anda:third_one'];
    const callbackURI = 'https://test.com/cb';
    const expectation =
      'https://id.twitch.tv/oauth2/authorize' +
      '?client_id=someClientIdLol' +
      '&redirect_uri=https://test.com/cb' +
      '&response_type=code' +
      '&scope=scope:one something_else anda:third_one' +
      '&claims={"id_token":{"email":null},"userinfo":{}}' +
      '&force_verify=true';
    expect(auth.getOAuthUrl(opts, scopes, callbackURI)).toEqual(expectation);
  });

  it('should create promise that requests token', async () => {
    const opts = {
      clientId: 'someCI',
      clientSecret: 'someSecret',
    } as StartServerOptions;

    const respObj = { test: 'test' };
    const code = 'test';
    const cbURL = 'https://test.com/cb';

    nock('https://id.twitch.tv')
      .post('/oauth2/token')
      .query({
        client_id: opts.clientId,
        client_secret: opts.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: cbURL,
      })
      .reply(200, respObj);

    expect(await auth.obtainAccessToken(opts, code, cbURL)).toEqual(respObj);
  });

  describe('setupCallback', () => {
    const opts = {} as StartServerOptions;

    it('should return 400 when no code is set', async () => {
      jest.spyOn(setup, 'getOTP').mockReturnValue('some');
      const req = { cookies: { token: 'some' }, query: {} } as Request;
      const res = ({
        status: jest.fn(),
        render: jest.fn(),
      } as unknown) as Response;

      await auth.setupCallback(opts)(req, res, null);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should fisnishSetup() and return ok, when ok', async () => {
      jest.spyOn(setup, 'getOTP').mockReturnValue('some');
      jest
        .spyOn(auth, 'obtainAccessToken')
        .mockResolvedValue({} as TokenResponse);

      const fSspy = jest
        .spyOn(setup, 'finishSetup')
        .mockResolvedValue(undefined);

      const req = ({
        cookies: { token: 'some' },
        query: { code: 'somecode' },
      } as unknown) as Request;

      const res = ({
        status: jest.fn(),
        render: jest.fn(),
      } as unknown) as Response;

      await auth.setupCallback(opts)(req, res, null);

      expect(res.render).toHaveBeenCalledWith('ok');
      expect(fSspy).toHaveBeenCalled();
    });
  });

  describe('refreshAccessToken', () => {
    const opts = ({
      clientId: 'clientId',
      clientSecret: 'clientSecret',
    } as unknown) as StartServerOptions;

    const authData = ({
      refresh_token: 'some refreshTöken',
    } as unknown) as AuthData;

    it('should return error when request fails', () => {
      const writeSpy = jest
        .spyOn(setup, 'writeToDisk')
        .mockImplementation(() => ({}));

      const respObj = { status: 400, message: 'Some Error idk' };

      nock('https://id.twitch.tv')
        .post('/oauth2/token')
        .query({
          grant_type: 'refresh_token',
          refresh_token: authData.refresh_token,
          client_id: opts.clientId,
          client_secret: opts.clientSecret,
        })
        .reply(400, respObj);

      return auth.refreshAccessToken(opts, authData, true).catch((e) => {
        expect(e).toEqual(
          new Error(
            'Refresh request was rejected: 400: ' + JSON.stringify(respObj),
          ),
        );
        expect(writeSpy).not.toHaveBeenCalled();
      });
    });
    it('should return new authData and writeToDisk', () => {
      const writeSpy = jest
        .spyOn(setup, 'writeToDisk')
        .mockImplementation(() => ({}));

      const respObj = {
        access_token: 'someAT',
        refresh_token: 'someRT',
        expires_in: 6969,
      } as TokenResponse;

      nock('https://id.twitch.tv')
        .post('/oauth2/token')
        .query({
          grant_type: 'refresh_token',
          refresh_token: authData.refresh_token,
          client_id: opts.clientId,
          client_secret: opts.clientSecret,
        })
        .reply(200, respObj);

      return auth
        .refreshAccessToken(opts, authData, true)
        .then((data: AuthData) => {
          expect(data).toEqual(respObj);
          expect(writeSpy).toHaveBeenCalled();
        });
    });
  });
});
