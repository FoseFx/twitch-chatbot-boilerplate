import { Client } from 'tmi.js';
import { AuthData, StartServerOptions } from '../server/server.types';
import { refreshAccessToken } from '../server/auth';

let _client: Client | null = null;

export async function startBot(
  options: StartServerOptions,
  authData: AuthData | null,
): Promise<void> {
  if (_client !== null || authData === null) {
    return;
  }
  _client = await _createNewClient(options, authData);
}

export async function _createNewClient(
  options: StartServerOptions,
  authData: AuthData,
): Promise<Client> {
  const client = Client({
    options: {
      debug: true,
    },
    connection: {
      secure: true,
      reconnect: true,
    },
    identity: {
      username: options.clientId,
      password: authData.access_token,
    },
    channels: [
      /* TODO */
    ],
  });

  return _connectClient(options, authData, client);
}

export function _connectClient(
  options: StartServerOptions,
  authData: AuthData,
  client: Client,
): Promise<Client> {
  // Note: _handleConnectError can cause recursion to this function
  return client
    .connect()
    .then(() => client)
    .catch((e) => _handleConnectError(options, authData, client, e));
}

export async function _handleConnectError(
  opts: StartServerOptions,
  authData: AuthData,
  client: Client,
  error: string,
): Promise<Client> {
  if (error === 'Login authentication failed') {
    return _handleAuthError(opts, authData, client);
  } else {
    throw new Error(error);
  }
}

export function _handleAuthError(
  opts: StartServerOptions,
  authData: AuthData,
  client: Client,
): Promise<Client> {
  return refreshAccessToken(opts, authData, true).then((newData) =>
    _connectClient(opts, newData, client),
  );
}

export const _this = {
  startBot,
  _createNewClient,
  _handleConnectError,
};
