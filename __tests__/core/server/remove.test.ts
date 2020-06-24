import { Request, Response } from 'express';
import * as remove from '../../../src/core/server/remove';
import * as auth from '../../../src/core/server/auth';
import { StartServerOptions } from '../../../src/core/server/server.types';

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
});
