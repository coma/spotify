import { FETCHING, FETCHED, ERROR } from '../status';
import Request from '../request';

export const RELEASES_FETCHING = 'RELEASES_' + FETCHING;
export const RELEASES_FETCHED  = 'RELEASES_' + FETCHED;
export const RELEASES_ERROR    = 'RELEASES_' + ERROR;

export function fetchReleases () {

    return dispatch => {

        dispatch({
            type: RELEASES_FETCHING
        });

        Request.get('browse/new-releases')
            .go()
            .then(response => {

                dispatch({
                    type: RELEASES_FETCHED,
                    data: response.body
                });
            })
            .catch(error => {

                dispatch({
                    type: RELEASES_ERROR
                });
            });
    };
}
