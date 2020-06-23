import { Request, Response } from 'express';
import * as add from '../../../src/core/server/add';
import * as auth from '../../../src/core/server/auth';
import * as bot from '../../../src/core/bot/bot';
import {
  StartServerOptions,
  BasicProfile,
  TokenResponse,
} from '../../../src/core/server/server.types';

describe('add', () => {
  describe('addRH', () => {
    it('should render', () => {
      jest
        .spyOn(auth, 'getOAuthUrl')
        .mockReturnValue('https://www.test.com/test?test');

      const res = ({
        render: jest.fn(),
      } as unknown) as Response;

      const opts = { botname: 'Hey-Bot' } as StartServerOptions;

      add.addRH(opts)({} as Request, res, null);

      expect(res.render).toHaveBeenCalledWith('add', {
        botname: 'Hey-Bot',
        twitchURL: 'https://www.test.com/test?test',
      });
    });
  });

  describe('addCallbackRH', () => {
    it('should join channel', () => {
      const oATSpy = jest
        .spyOn(auth, 'obtainAccessToken')
        .mockResolvedValue({} as TokenResponse);
      const gBPISpy = jest
        .spyOn(auth, 'getBasicProfileInfo')
        .mockResolvedValue({} as BasicProfile);
      const jCSpy = jest.spyOn(bot, 'joinChannel').mockResolvedValue('fosefx');

      const res = ({ render: jest.fn() } as unknown) as Response;

      const next = jest.fn();

      return add
        .addCallbackRH({ botname: 'test-bot' } as StartServerOptions)(
          ({
            query: { code: 'test' },
          } as unknown) as Request,
          res,
          next,
        )
        .then(() => {
          expect(oATSpy).toHaveBeenCalled();
          expect(gBPISpy).toHaveBeenCalled();
          expect(jCSpy).toHaveBeenCalled();
          expect(res.render).toHaveBeenCalledWith('add_success', {
            botname: 'test-bot',
            login: 'fosefx',
          });
          expect(next).not.toHaveBeenCalled();
        });
    });
  });
});
