import { RELEASES_FETCHING, RELEASES_FETCHED, RELEASES_ERROR } from '../actions/releases';
import { TOKEN_DELETED } from '../actions/token';
import { FETCHING, FETCHED, ERROR, INIT } from '../status';

export const initialState = {
    status: INIT
};

export default function releases (state = initialState, action = {}) {

    switch (action.type) {

        case RELEASES_FETCHED:

            return {
                status: FETCHED,
                list  : action.data.albums.items.map(album => ({
                    id   : album.id,
                    name : album.name,
                    cover: album.images[0].url
                }))
            };

        case RELEASES_FETCHING:

            return {
                status: FETCHING
            };

        case RELEASES_ERROR:

            return {
                status: ERROR
            };

        case TOKEN_DELETED:

            return {
                status: INIT
            };

        default:
            return state;
    }
}
