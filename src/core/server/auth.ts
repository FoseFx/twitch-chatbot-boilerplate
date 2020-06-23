import fetch from 'node-fetch';
import { Response as FetchResponse } from 'node-fetch';
import { Request, Response, RequestHandler, NextFunction } from 'express';
import {
  StartServerOptions,
  TokenResponse,
  AuthData,
  BasicProfile,
} from './server.types';
import { writeToDisk, finishSetup } from '../setup';
import { ensureFetchIsOk } from './util';

/**
 * Converts array of scope strings to a list usable in URLs
 */
export function scopesToString(scopes: string[]): string {
  let string = '';

  for (const scope of scopes) {
    string += scope + ' ';
  }
  return string.substr(0, string.length - 1); // remove last " "
}

/** Generates the Twitch-Authwall-URL */
export function getOAuthUrl(
  opts: StartServerOptions,
  scopes: string[],
  callbackURI: string,
): string {
  const claims = {
    id_token: { email: null },
    userinfo: {},
  };

  const redirectURL =
    `https://id.twitch.tv/oauth2/authorize` +
    `?client_id=${opts.clientId}` +
    `&redirect_uri=${callbackURI}` +
    `&response_type=code` +
    `&scope=${_this.scopesToString(scopes)}` +
    `&claims=${JSON.stringify(claims)}` +
    `&force_verify=true`;
  return redirectURL;
}

/** The RequestHandler that handles /setup/callback */
export function setupCallback(options: StartServerOptions): RequestHandler {
  return function (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { code } = req.query; // authorization code

    return _this
      .obtainAccessToken(
        options,
        code as string,
        `${options.host}/setup/callback`,
      )
      .then((token) => finishSetup(options, token))
      .then(() => res.render('ok'))
      .catch((e) => next(e));
  };
}

export function obtainAccessToken(
  opts: StartServerOptions,
  code: string,
  redirectURI: string,
): Promise<TokenResponse> {
  const reqURL =
    `https://id.twitch.tv/oauth2/token` +
    `?client_id=${opts.clientId}` +
    `&client_secret=${opts.clientSecret}` +
    `&code=${code}` +
    `&grant_type=authorization_code` +
    `&redirect_uri=${redirectURI}`;

  return fetch(reqURL, {
    method: 'post',
  })
    .then(ensureFetchIsOk)
    .then((resp: FetchResponse) => resp.json());
}

export async function refreshAccessToken(
  options: StartServerOptions,
  authData: AuthData,
  write: boolean,
): Promise<AuthData> {
  const refreshURL =
    `https://id.twitch.tv/oauth2/token` +
    `?grant_type=refresh_token` +
    `&refresh_token=${encodeURIComponent(authData.refresh_token)}` +
    `&client_id=${options.clientId}` +
    `&client_secret=${options.clientSecret}`;

  const resp = await fetch(refreshURL, {
    method: 'POST',
  });
  if (!resp.ok) {
    throw new Error(
      'Refresh request was rejected: ' +
        resp.status +
        ': ' +
        (await resp.text()),
    );
  }

  const json = (await resp.json()) as TokenResponse;
  if (write) {
    writeToDisk(json);
  }
  return json;
}

export function getBasicProfileInfo(
  options: StartServerOptions,
  authData: AuthData,
): Promise<BasicProfile> {
  return fetch(`https://api.twitch.tv/helix/users`, {
    method: 'get',
    headers: {
      'Client-Id': options.clientId,
      Authorization: 'Bearer ' + authData.access_token,
    },
  })
    .then(ensureFetchIsOk)
    .then((resp) => resp.json())
    .then((json) => json.data[0]);
}

export const _this = {
  obtainAccessToken,
  scopesToString,
  getOAuthUrl,
  setupCallback,
  refreshAccessToken,
};
