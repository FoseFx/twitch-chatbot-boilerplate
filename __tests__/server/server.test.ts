import { Express } from 'express';
import * as util from '../../src/server/util';
import * as routes from '../../src/server/routes';
import * as server from '../../src/server/server';
import { StartServerOptions } from '../../src/server/server.types';

describe('Server', () => {
  let consoleMock;
  let routesMock;
  let expressMock;
  let useMock;
  let setMock;
  let listenMock;
  beforeEach(() => {
    consoleMock = jest.spyOn(console, 'log');
    routesMock = jest.spyOn(routes, 'setUpRoutes').mockReturnValue(undefined);

    useMock = jest.fn();
    setMock = jest.fn();
    listenMock = jest.fn().mockImplementation((port, cb) => {
      cb();
      return port;
    });
    expressMock = jest.spyOn(util, 'newExpressApp').mockReturnValue({
      use: useMock,
      set: setMock,
      listen: listenMock,
    } as Express);
  });
  describe('startServer()', () => {
    it('should start express server and attach routes and middleware', () => {
      server.startServer({ port: 6969 } as StartServerOptions);
      expect(expressMock).toBeCalled();
      expect(setMock).toBeCalled();
      expect(routesMock).toBeCalled();
      expect(listenMock).toHaveLastReturnedWith(6969);
      expect(consoleMock).toHaveBeenCalledWith(
        'HTTP-Server listening on port 6969',
      );
    });
  });
});
