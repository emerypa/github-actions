import cryptoRandomString from 'crypto-random-string';
import crypto from 'crypto';
import jwtDecode from 'jwt-decode';

const RANDOM_VAL_LENGTH = 16;
const ORIGINAL_PATH_KEY = 'ORIGINAL_PATH';
const OAUTH_STATE_KEY = 'OAUTH_STATE';
const OAUTH_VERIFIER_KEY = 'OAUTH_VERIFIER';

const ALLOW_FAKE_LOGIN = "active"
const BASE_URI = "http://localhost:8080"
const AUTH_TENANT_ID = "5d3e2773-e07f-4432-a630-1a0f68a28a05"
const AUTH_CLIENT_ID = "83f761bc-dc02-441d-b5ee-3f652cfae1e6"
const AUTH_SCOPE = "openid profile email"

export const storeOriginalPath = (location) => {
  // Note that this requires setting "state" prop in the Redirect component (see App component)
  const originalPath =
    location.state && location.state.from && location.state.from.pathname + location.state.from.search;
  sessionStorage.setItem(ORIGINAL_PATH_KEY, originalPath || '/');
};

export const getAndClearStoredOriginalPath = () => {
  const originalPath = sessionStorage.getItem(ORIGINAL_PATH_KEY);
  sessionStorage.removeItem(ORIGINAL_PATH_KEY);
  return originalPath || '/';
};

const base64URLEncode = (str) => {
  return str.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, '');
};

const sha256 = (buffer) => {
  return crypto.createHash('sha256').update(buffer).digest();
};

export const generateAndStoreOAuthState = () => {
  const state = cryptoRandomString({
    length: RANDOM_VAL_LENGTH,
    type: 'url-safe',
  });
  sessionStorage.setItem(OAUTH_STATE_KEY, state);
  return state;
};

export const getAndClearStoredOAuthState = () => {
  const state = sessionStorage.getItem(OAUTH_STATE_KEY);
  sessionStorage.removeItem(OAUTH_STATE_KEY);
  return state;
};

export const generateAndStoreOAuthCodeVerifierAndChallenge = () => {
  const verifier = base64URLEncode(crypto.randomBytes(32));
  const challenge = base64URLEncode(sha256(verifier));
  sessionStorage.setItem(OAUTH_VERIFIER_KEY, verifier); // No need to store the challenge
  return challenge; // Only need to return challenge
};

export const getAndClearStoredOAuthVerifier = () => {
  const verifier = sessionStorage.getItem(OAUTH_VERIFIER_KEY);
  sessionStorage.removeItem(OAUTH_VERIFIER_KEY);
  return verifier;
};

export const getOAuthAuthorizeUri = (state, challenge) => {
  const tenantId = encodeURIComponent(AUTH_TENANT_ID);
  const clientId = encodeURIComponent(AUTH_CLIENT_ID);
  const redirectUri = encodeURIComponent(`${BASE_URI}/oidc-login/callback`);
  const scope = encodeURIComponent(AUTH_SCOPE);
  return (
    'https://login.microsoftonline.com/' +
    `${tenantId}` +
    '/oauth2/v2.0/authorize' +
    `?client_id=${clientId}` +
    '&response_type=code' +
    `&redirect_uri=${redirectUri}` +
    `&scope=${scope}` +
    '&response_mode=query' +
    `&state=${state}` +
    `&code_challenge=${challenge}` +
    '&code_challenge_method=S256'
  );
};

export const fetchAndDecodeOAuthTokens = async (code, verifier) => {
  const tenantId = encodeURIComponent(AUTH_TENANT_ID);
  const clientId = encodeURIComponent(AUTH_CLIENT_ID);
  const redirectUri = encodeURIComponent(`${BASE_URI}/oidc-login/callback`);
  const scope = encodeURIComponent(AUTH_SCOPE);

  const oauthTokenUri = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
  const method = 'POST';
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Accept: 'application/json',
  };
  const body =
    `client_id=${clientId}` +
    '&grant_type=authorization_code' +
    `&scope=${scope}` +
    `&code=${code}` +
    `&redirect_uri=${redirectUri}` +
    `&code_verifier=${verifier}`;

  const response = await fetch(oauthTokenUri, { method, headers, body });
  const result = await response.json();

  // Use the ID token (OIDC) to get user information (authentication)
  const claims = jwtDecode(result.id_token);

  return {
    id: claims.preferred_username.split('@')[0], // e.g. lanid@MFCGD.com
    fullName: claims.name,
    email: claims.email,
    roles: claims.roles,
    idToken: result.id_token,
  };
};

export const getOAuthSignoutUri = () => {
  const tenantId = encodeURIComponent(AUTH_TENANT_ID);
  const postLogoutRedirectUri = encodeURIComponent(BASE_URI);

  return (
    'https://login.microsoftonline.com/' +
    `${tenantId}` +
    '/oauth2/logout' +
    `?post_logout_redirect_uri=${postLogoutRedirectUri}`
  );
};

export const injectUserAppData = async (user) => {
  // You can retrieve specific user app data here to store with the logged user info
  const userAppData = {};
  return Promise.resolve({ ...user, ...userAppData });
};
