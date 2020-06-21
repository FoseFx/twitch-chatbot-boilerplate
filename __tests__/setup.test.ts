import * as fs from 'fs';
import { _this as setup } from '../src/setup';
import * as bot from '../src/bot/bot';
import { TokenResponse, StartServerOptions } from '../src/server/server.types';

describe('setup.ts', () => {
  let oldWriteToDisk;
  let oldreadToDisk;
  beforeEach(() => {
    oldWriteToDisk = setup.writeToDisk;
    oldreadToDisk = setup.readFromDisk;
    jest.spyOn(bot, 'startBot').mockImplementation(() => Promise.resolve());
  });

  afterEach(() => {
    setup.writeToDisk = oldWriteToDisk;
    setup.readFromDisk = oldreadToDisk;
  });

  test('isSetupYet should return _isSetupYet and finishSetup should writeToDisk and startBot', async () => {
    setup.writeToDisk = jest.fn();
    expect(setup.isSetupYet()).toEqual(false);
    await setup.finishSetup({} as StartServerOptions, {} as TokenResponse);
    expect(setup.isSetupYet()).toEqual(true);
    expect(setup.writeToDisk).toHaveBeenCalled();
    expect(bot.startBot).toHaveBeenCalled();
  });

  it('should readFromDisk or return null', () => {
    const spy = jest
      .spyOn(fs, 'readFileSync')
      .mockReturnValue('{"some": "some"}');
    expect(setup.readFromDisk()).toEqual({ some: 'some' });
    spy.mockImplementation(() => {
      throw new Error('Error');
    });
    expect(setup.readFromDisk()).toEqual(null);
  });

  describe('writeToDisk', () => {
    it('should not create .config dir when it does exist', () => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      const mkdirSpy = jest
        .spyOn(fs, 'mkdirSync')
        .mockImplementation(() => ({}));
      const writeSpy = jest
        .spyOn(fs, 'writeFileSync')
        .mockImplementation(() => ({}));

      setup.writeToDisk({} as TokenResponse);

      expect(mkdirSpy).not.toBeCalled();
      expect(writeSpy).toBeCalled();
    });
    it('should create .config dir when it does not exist', () => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(false);
      const mkdirSpy = jest
        .spyOn(fs, 'mkdirSync')
        .mockImplementation(() => ({}));
      const writeSpy = jest
        .spyOn(fs, 'writeFileSync')
        .mockImplementation(() => ({}));

      const obj = {
        access_token: 'test1',
        refresh_token: 'test2',
      } as TokenResponse;

      setup.writeToDisk(obj);

      expect(mkdirSpy).toBeCalled();
      expect(writeSpy).toBeCalledWith(
        './.config/auth.json',
        JSON.stringify(obj, null, 2),
      );
    });
  });

  it('should getOTP', async () => {
    expect(setup.getOTP()).toEqual('');
    setup.readFromDisk = jest.fn().mockReturnValue(null);
    await setup.setup({} as StartServerOptions);
    expect(setup.getOTP()).not.toEqual('');
  });

  it('should not start setup process when readFromDisk returns something', async () => {
    const otp = setup.getOTP();
    setup.readFromDisk = jest.fn().mockReturnValue({});

    expect(await setup.setup({} as StartServerOptions)).not.toEqual(null);

    expect(setup.getOTP()).toEqual(otp);
  });
});
