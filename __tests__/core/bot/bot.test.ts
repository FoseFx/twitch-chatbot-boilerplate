import { _this as bot } from '../../../src/core/bot/bot';
import * as auth from '../../../src/core/server/auth';
import {
  StartServerOptions,
  AuthData,
  BasicProfile,
} from '../../../src/core/server/server.types';
import { Client } from 'tmi.js';
import * as clientReadyEventEmitter from '../../../src/core/event';
import * as tmijs from 'tmi.js';
import { EventEmitter } from 'events';

const opts = {} as StartServerOptions;
const authData = {} as AuthData;
const newClient = {} as Client;

describe('bot.ts', () => {
  let origCreateNewClient;
  beforeEach(() => {
    origCreateNewClient = bot._createNewClient;
  });

  afterEach(() => {
    bot._createNewClient = origCreateNewClient;
  });

  describe('_handleAuthError', () => {
    it('should reject when refreshAccessToken() rejects', () => {
      const err = new Error('Some Error');
      jest.spyOn(auth, 'refreshAccessToken').mockRejectedValue(err);

      return expect(bot._handleAuthError(opts, authData)).rejects.toEqual(err);
    });
    it('should createNewClient when refreshAccessToken() returns new AuthData', async () => {
      const newAuthData = { access_token: 'newAccessToken' } as AuthData;

      const createNewClientSpy = jest
        .spyOn(bot, '_createNewClient')
        .mockResolvedValue(newClient);
      jest.spyOn(auth, 'refreshAccessToken').mockResolvedValue(newAuthData);

      expect(await bot._handleAuthError(opts, authData)).toEqual(newClient);
      expect(createNewClientSpy).toHaveBeenCalled();
    });
  });

  describe('handleConnectError', () => {
    it('should call and return _handeAuthError() when the error is a login error', async () => {
      const handleAuthErrorSpy = jest
        .spyOn(bot, '_handleAuthError')
        .mockResolvedValue(newClient);

      const res = await bot._handleConnectError(
        opts,
        authData,
        'Login authentication failed',
      );
      expect(handleAuthErrorSpy).toHaveBeenCalled();
      expect(res).toEqual(newClient);
    });

    it('should return the error when it is not a login error', () => {
      const handleAuthErrorSpy = jest
        .spyOn(bot, '_handleAuthError')
        .mockResolvedValue(newClient)
        .mockReset();

      return expect(bot._handleConnectError(opts, authData, 'sth else failed'))
        .rejects.toEqual(Error('sth else failed'))
        .then(() => {
          expect(handleAuthErrorSpy).not.toHaveBeenCalled();
        });
    });
  });

  describe('_createNewClient', () => {
    it('should return new Client when connection is successful', async () => {
      const cl = ({
        connect: jest.fn().mockResolvedValue(undefined),
      } as unknown) as Client;

      jest.spyOn(tmijs, 'Client').mockReturnValue(cl);
      const hCESpy = jest.spyOn(bot, '_handleConnectError');

      await bot._createNewClient(opts, authData);
      expect(hCESpy).not.toHaveBeenCalled();
    });

    it('should call handleConnectError when connect fails', () => {
      const cl = ({
        connect: jest.fn().mockRejectedValue('somerror'),
      } as unknown) as Client;

      jest.spyOn(tmijs, 'Client').mockReturnValue(cl);

      const hCESpy = jest
        .spyOn(bot, '_handleConnectError')
        .mockImplementation((_opts, _authData, error) => {
          return Promise.reject(error);
        });

      return bot._createNewClient(opts, authData).catch((error) => {
        expect(error).toEqual('somerror');
        expect(hCESpy).toHaveBeenCalled();
      });
    });
  });

  describe('startBot', () => {
    it('should not start bot when not AuthData provided', () => {
      const spy = jest.spyOn(bot, '_createNewClient');
      bot.startBot(opts, null);
      expect(spy).not.toHaveBeenCalled();
    });
    it('should start bot when not started already', async () => {
      const fakeEmit = jest.fn();
      jest
        .spyOn(clientReadyEventEmitter, 'getClientReadyEmitter')
        .mockReturnValue(({ emit: fakeEmit } as unknown) as EventEmitter);
      const spy = jest
        .spyOn(bot, '_createNewClient')
        .mockResolvedValue(undefined)
        .mockReset();
      await bot.startBot(opts, authData);
      expect(spy).toHaveBeenCalled();
      expect(fakeEmit).toHaveBeenCalledWith('clientReady', undefined);
    });
    it('should not start bot when started already', () => {
      const spy = jest.spyOn(bot, '_createNewClient');
      bot.startBot(opts, authData);
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('joinChannel', () => {
    it('should throw an error, when bot not running', () => {
      bot._setClient(null);
      return bot
        .joinChannel({ login: 'test' } as BasicProfile)
        .catch((e) =>
          expect(e).toEqual(new Error('Bot not running yet, try again later')),
        );
    });
    it('should join channel', () => {
      expect.assertions(1);
      const fakeCl = ({
        join: jest.fn().mockResolvedValue([]),
      } as unknown) as Client;
      bot._setClient(fakeCl);
      return bot.joinChannel({ login: 'test' } as BasicProfile).then(() => {
        expect(fakeCl.join).toHaveBeenCalledWith('test');
      });
    });
  });
});
