import { FETCHING, FETCHED, ERROR } from '../status';
import request from 'superagent';
import { push } from 'react-router-redux';

export const ACCOUNT_FETCHING = 'ACCOUNT_' + FETCHING;
export const ACCOUNT_FETCHED = 'ACCOUNT_' + FETCHED;
export const ACCOUNT_ERROR = 'ACCOUNT_' + ERROR;

export function fetch (token) {

    return dispatch => {

        dispatch({
            type: ACCOUNT_FETCHING
        });

        request
            .get('https://api.spotify.com/v1/me')
            .set('Authorization', 'Bearer ' + token.access)
            .end((error, response) => {

                dispatch({
                    type: ACCOUNT_FETCHED,
                    data: response.body
                });

                dispatch(push('/app'));
            });
    };
}
