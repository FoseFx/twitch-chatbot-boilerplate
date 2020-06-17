export interface StartServerOptions {
  host: string;
  port: number;
  botname: string;
  clientId: string;
  clientSecret: string;
  setupScopes: string[];
}

export interface AuthData {
  access_token: string;
  refresh_token: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  scope: string[];
  token_type: 'bearer';
}
