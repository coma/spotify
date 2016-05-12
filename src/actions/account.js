import { FETCHING, FETCHED, ERROR } from '../status';
import Request from '../request';

export const ACCOUNT_FETCHING = 'ACCOUNT_' + FETCHING;
export const ACCOUNT_FETCHED  = 'ACCOUNT_' + FETCHED;
export const ACCOUNT_ERROR    = 'ACCOUNT_' + ERROR;

export function fetchAccount () {

    return dispatch => {

        dispatch({
            type: ACCOUNT_FETCHING
        });

        Request
            .get('me')
            .go()
            .then(response => {

                dispatch({
                    type: ACCOUNT_FETCHED,
                    data: response.body
                });
            })
            .catch(error => {

                dispatch({
                    type: ACCOUNT_ERROR
                });
            });
    };
}
