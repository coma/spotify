import { RELEASES_FETCHED } from '../actions/releases';
import { TOKEN_DELETED } from '../actions/token';
import { ALBUM_FETCHING, ALBUM_FETCHED, ALBUM_ERROR } from '../actions/album';
import { FETCHING, FETCHED, ERROR, INIT } from '../status';

export default function album (state = {}, action = {}) {

    switch (action.type) {

        case RELEASES_FETCHED:

            action.data.albums.items.forEach(album => {

                if (!state[album.id]) {

                    state[album.id] = {
                        id    : album.id,
                        name  : album.name,
                        cover : album.images[0].url,
                        status: INIT
                    };
                }
            });

            return state;

        case ALBUM_FETCHING:

            state = {...state};
            state[action.data.id] = {
                ...action.data,
                status: FETCHING
            };

            return state;

        case ALBUM_FETCHED:

            state = {...state};
            state[action.data.id] = {
                id      : action.data.id,
                name    : action.data.name,
                year    : +action.data.release_date.split('-')[0],
                cover   : action.data.images[0].url,
                artists : action.data.artists.map(({id, name}) => ({id, name})),
                tracks  : action.data.tracks.items.map(({id, name, preview_url, disc_number, track_number, duration_ms}) => ({
                    id, name,
                    preview : preview_url,
                    disc    : disc_number,
                    number  : track_number,
                    duration: duration_ms
                })),
                status  : FETCHED
            };

            return state;

        case ALBUM_ERROR:

            state = {...state};
            state[action.data.id] = {
                ...action.data,
                status: ERROR
            };

            return state;

        case TOKEN_DELETED:

            return {};

        default:
            return state;
    }
}
