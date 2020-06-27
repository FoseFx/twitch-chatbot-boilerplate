import { Express } from 'express';
import * as env from '../../src/core/env';
import * as server from '../../src/core/server/server';
import * as event from '../../src/core/event';
import * as setup from '../../src/core/setup';
import * as bot from '../../src/core/bot/bot';
import { EventEmitter } from 'node-fetch/node_modules/form-data';
import { initialize } from '../../src/core/core';
import { AuthData } from '../../src/core/server/server.types';

describe('main.ts', () => {
  let lEVSpy;

  beforeEach(() => {
    jest.resetAllMocks();
    lEVSpy = jest.spyOn(env, 'loadEnvVariables').mockImplementation(() => ({}));
  });

  it('should test', () => expect(true).toEqual(true));
  describe('initialize()', () => {
    it('should initialize the process', async () => {
      let clientEmitter: EventEmitter;
      const sSSpy = jest
        .spyOn(server, 'startServer')
        .mockResolvedValue({} as Express);
      const sSpy = jest.spyOn(setup, 'setup').mockResolvedValue({} as AuthData);
      jest
        .spyOn(event, 'setClientReadyEmitter')
        .mockImplementation((ce) => (clientEmitter = ce));
      jest.spyOn(bot, 'startBot').mockImplementation(() => {
        clientEmitter.emit('clientReady', { test: 'test' });
        return Promise.resolve();
      });

      const { client } = await initialize();

      expect(((client as unknown) as { test: string }).test).toEqual('test');

      expect(lEVSpy).toHaveBeenCalled();
      expect(sSSpy).toHaveBeenCalled();
      expect(sSpy).toHaveBeenCalled();
    });

    it('should reject, when sth rejects', () => {
      expect.assertions(1);
      const err = new Error('Error lol');
      jest.spyOn(server, 'startServer').mockRejectedValue(err);

      return initialize().catch((e) => expect(e).toEqual(e));
    });

    it('should handle options', () => {
      expect.assertions(1);

      jest.spyOn(event, 'setClientReadyEmitter').mockReturnValue();

      jest.spyOn(server, 'startServer').mockImplementation((opts) => {
        expect(opts.beforeRouteSetup).toEqual(initOptions.beforeRouteSetup);
        return Promise.reject();
      });

      const initOptions = {
        beforeRouteSetup: jest.fn(),
      };

      return initialize(initOptions).catch(() => {});
    });
  });
});
