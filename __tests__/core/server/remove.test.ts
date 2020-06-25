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
  describe('removeCallbackRH', () => {
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
