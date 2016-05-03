import { VALIDATING, VALIDATED, INVALIDATED, REFRESHED, DELETING, DELETED, INIT } from '../status';
import { ACCOUNT_FETCHED } from './account';
import { get } from '../request';
import request from 'superagent';
import { push } from 'react-router-redux';

export const TOKEN_INIT        = 'TOKEN_' + INIT;
export const TOKEN_VALIDATING  = 'TOKEN_' + VALIDATING;
export const TOKEN_VALIDATED   = 'TOKEN_' + VALIDATED;
export const TOKEN_INVALIDATED = 'TOKEN_' + INVALIDATED;
export const TOKEN_REFRESHED   = 'TOKEN_' + REFRESHED;
export const TOKEN_DELETING    = 'TOKEN_' + DELETING;
export const TOKEN_DELETED     = 'TOKEN_' + DELETED;

export function grabFromQuery (query) {

    if (!['access_token', 'refresh_token', 'expires_in'].every(n => query.hasOwnProperty(n))) {

        return {
            type: TOKEN_INIT
        };
    }

    const token = {
        access    : query.access_token,
        refresh   : query.refresh_token,
        expiration: +query.expires_in + Date.now()
    };

    return (dispatch, getState) => validateToken(token, dispatch, getState);
}

// https://github.com/spotify/web-api/issues/126
export function deleteToken () {

    return (dispatch, getState) => {

        cancelRefresh(getState);

        dispatch({
            type: TOKEN_DELETED
        });

        dispatch(push('/login'));
    };
}

function validateToken (token, dispatch, getState) {

    cancelRefresh(getState);

    dispatch({
        type: TOKEN_VALIDATING,
        data: token
    });

    get('me')
        .go()
        .then(response => onValidated(token, response.body, dispatch))
        .catch(error => onInvalidated(error, dispatch));
}

function onValidated (token, user, dispatch) {

    dispatch({
        type: TOKEN_VALIDATED,
        data: delayRefresh(token, dispatch)
    });

    dispatch({
        type: ACCOUNT_FETCHED,
        data: user
    });

    dispatch(push('/app'));
}

function onInvalidated (error, dispatch) {

    dispatch({
        type: TOKEN_INVALIDATED
    });
}

function cancelRefresh (getState) {

    clearTimeout(getState().token.delay);
}

function delayRefresh (token, dispatch, timeOffset = 10) {

    const delay = token.expiration - Date.now() - timeOffset,
          id    = setTimeout(() => refreshToken(token, dispatch), 1000 * delay);

    return {...token, delay: id};
}

function refreshToken (token, dispatch) {

    request
        .post('/oauth/refresh')
        .query({
            refresh_token: token.refresh
        })
        .end((error, { status, body }) => status === 200 ? onRefreshed(body, token, dispatch) : onInvalidated(error, dispatch));
}

function onRefreshed ({access_token, expires_in}, token, dispatch) {

    token = {
        ...token,
        access    : access_token,
        expiration: +expires_in + Date.now()
    };

    dispatch({
        type: TOKEN_REFRESHED,
        data: token
    });

    delayRefresh(token, dispatch);
}
