import { FETCHING, FETCHED, ERROR } from '../status';
import Request from '../request';

export const ALBUM_FETCHING = 'ALBUM_' + FETCHING;
export const ALBUM_FETCHED  = 'ALBUM_' + FETCHED;
export const ALBUM_ERROR    = 'ALBUM_' + ERROR;

export function fetchAlbum (album) {

    return dispatch => {

        dispatch({
            type: ALBUM_FETCHING,
            data: album
        });

        Request
            .get('albums/' + album.id)
            .go()
            .then(response => {

                dispatch({
                    type: ALBUM_FETCHED,
                    data: response.body
                });
            })
            .catch(error => {

                dispatch({
                    type: ALBUM_ERROR,
                    data: album
                });
            });
    };
}
