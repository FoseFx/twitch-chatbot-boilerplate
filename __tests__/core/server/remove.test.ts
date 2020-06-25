import { Request, Response } from 'express';
import * as remove from '../../../src/core/server/remove';
import * as auth from '../../../src/core/server/auth';
import * as bot from '../../../src/core/bot/bot';
import {
  StartServerOptions,
  TokenResponse,
  BasicProfile,
} from '../../../src/core/server/server.types';

describe('remove', () => {
  describe('removeRH', () => {
    it('should render', () => {
      jest
        .spyOn(auth, 'getOAuthUrl')
        .mockReturnValue('https://www.test.com/test?test');

      const res = ({
        render: jest.fn(),
      } as unknown) as Response;

      const opts = { botname: 'Hey-Bot' } as StartServerOptions;

      remove.removeRH(opts)({} as Request, res, null);

      expect(res.render).toHaveBeenCalledWith('remove', {
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
      const lCSpy = jest.spyOn(bot, 'leaveChannel').mockResolvedValue('fosefx');

      const res = ({ render: jest.fn() } as unknown) as Response;

      const next = jest.fn();

      return remove
        .removeCallbackRH({ botname: 'test-bot' } as StartServerOptions)(
          ({
            query: { code: 'test' },
          } as unknown) as Request,
          res,
          next,
        )
        .then(() => {
          expect(oATSpy).toHaveBeenCalled();
          expect(gBPISpy).toHaveBeenCalled();
          expect(lCSpy).toHaveBeenCalled();
          expect(res.render).toHaveBeenCalledWith('remove_success', {
            botname: 'test-bot',
            login: 'fosefx',
          });
          expect(next).not.toHaveBeenCalled();
        });
    });
  });
});
