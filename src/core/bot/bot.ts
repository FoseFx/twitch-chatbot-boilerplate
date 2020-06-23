import { Client } from 'tmi.js';
import {
  AuthData,
  StartServerOptions,
  BasicProfile,
} from '../server/server.types';
import { refreshAccessToken } from '../server/auth';
import { getClientReadyEmitter } from '../event';

let _client: Client | null = null;

export async function startBot(
  options: StartServerOptions,
  authData: AuthData | null,
): Promise<void> {
  if (_client !== null || authData === null) {
    return;
  }
  _client = await _this._createNewClient(options, authData);
  getClientReadyEmitter().emit('clientReady', _client);
}

/**
 * @return {Promise<string>} - the channel the bot has joined
 */
export async function joinChannel(profile: BasicProfile): Promise<string> {
  if (_client === null) {
    throw new Error('Bot not running yet, try again later');
  }

  const channel = profile.login;

  return _client.join(channel).then(() => {
    return channel;
  });
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

  // Note: _handleConnectError causes recursion to this function
  return client
    .connect()
    .then(() => client)
    .catch((e) => _this._handleConnectError(options, authData, e));
}

export async function _handleConnectError(
  opts: StartServerOptions,
  authData: AuthData,
  error: string,
): Promise<Client> {
  if (error === 'Login authentication failed') {
    return _this._handleAuthError(opts, authData);
  } else {
    throw new Error(error);
  }
}

export function _handleAuthError(
  opts: StartServerOptions,
  authData: AuthData,
): Promise<Client> {
  return refreshAccessToken(opts, authData, true).then((newData) =>
    _this._createNewClient(opts, newData),
  );
}

export function _setClient(cl: Client): void {
  _client = cl;
}

export const _this = {
  startBot,
  joinChannel,
  _createNewClient,
  _handleConnectError,
  _handleAuthError,
  _setClient,
};
