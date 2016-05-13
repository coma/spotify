import { VALIDATING, VALIDATED, INVALIDATED, REFRESHED, DELETED, INIT } from '../status';
import { ACCOUNT_FETCHED } from './account';
import Request from '../request';
import request from 'superagent';
import { push } from 'react-router-redux';

export const TOKEN_INIT        = 'TOKEN_' + INIT;
export const TOKEN_VALIDATING  = 'TOKEN_' + VALIDATING;
export const TOKEN_VALIDATED   = 'TOKEN_' + VALIDATED;
export const TOKEN_INVALIDATED = 'TOKEN_' + INVALIDATED;
export const TOKEN_REFRESHED   = 'TOKEN_' + REFRESHED;
export const TOKEN_DELETED     = 'TOKEN_' + DELETED;

const TIME_OFFSET = 10;

let refreshTimeout = null;

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

    return dispatch => validateToken(token, dispatch);
}

// https://github.com/spotify/web-api/issues/126
export function deleteToken () {

    return dispatch => {

        cancelRefresh();

        dispatch({
            type: TOKEN_DELETED
        });

        dispatch(push('/login'));
    };
}

function validateToken (token, dispatch) {

    cancelRefresh();

    dispatch({
        type: TOKEN_VALIDATING,
        data: token
    });

    Request
        .get('me')
        .go()
        .then(response => onValidated(token, response.body, dispatch))
        .catch(error => onInvalidated(error, dispatch));
}

function onValidated (token, user, dispatch) {

    delayRefresh(token, dispatch);

    dispatch({
        type: TOKEN_VALIDATED,
        data: token
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

function cancelRefresh () {

    clearTimeout(refreshTimeout);
}

function delayRefresh (token, dispatch) {

    const delay = token.expiration - Date.now() - TIME_OFFSET;

    refreshTimeout = setTimeout(() => refreshToken(token, dispatch), 1000 * delay);
}

function refreshToken (token, dispatch) {

    request
        .post('/oauth/refresh')
        .query({
            refresh_token: token.refresh
        })
        .end((error, response) => error ? onInvalidated(error, dispatch) : onRefreshed(response.body, token, dispatch));
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

/* istanbul ignore next  */
if (process.env.NODE_ENV === 'test') {

    exports.$private = {
        TIME_OFFSET,
        refreshTimeout: () => refreshTimeout,
        validateToken,
        onValidated,
        onInvalidated,
        cancelRefresh,
        delayRefresh,
        refreshToken,
        onRefreshed
    };
}
