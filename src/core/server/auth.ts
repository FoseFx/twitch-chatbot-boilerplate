import fetch from 'node-fetch';
import { Response as FetchResponse } from 'node-fetch';
import { Request, Response, RequestHandler, NextFunction } from 'express';
import { StartServerOptions, TokenResponse, AuthData } from './server.types';
import { writeToDisk, finishSetup } from '../setup';

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
  return async function (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { code } = req.query; // authorization code
    if (!code) {
      res.status(400);
      res.render('error', {
        heading: 'Invalid response',
        message: 'Code not provided',
      });
      return;
    }

    await _this
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
  }).then((resp: FetchResponse) => {
    if (!resp.ok) {
      return resp
        .json()
        .then((j) => console.log(j))
        .catch(() => ({}))
        .then(() => {
          throw new Error(
            'An error has occurred while reaching out to the TwitchAPI',
          );
        });
    }
    return resp.json();
  });
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

export const _this = {
  obtainAccessToken,
  scopesToString,
  getOAuthUrl,
  setupCallback,
  refreshAccessToken,
};