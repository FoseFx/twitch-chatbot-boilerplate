import { Request, Response } from 'express';
import * as add from '../../../src/core/server/add';
import * as auth from '../../../src/core/server/auth';
import { StartServerOptions } from '../../../src/core/server/server.types';

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
});
