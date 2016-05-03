import { ACCOUNT_FETCHING, ACCOUNT_FETCHED, ACCOUNT_ERROR } from '../actions/account';
import { TOKEN_DELETED } from '../actions/token';
import { FETCHING, FETCHED, ERROR, INIT } from '../status';

export default function account (state = {status: INIT}, action = {}) {

    switch (action.type) {

        case ACCOUNT_FETCHED:

            return {
                status: FETCHED,
                data  : {
                    email   : action.data.email,
                    username: action.data.display_name || action.data.id
                }
            };

        case ACCOUNT_FETCHING:

            return {
                status: FETCHING
            };

        case ACCOUNT_ERROR:

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
