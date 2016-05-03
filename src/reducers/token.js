import { TOKEN_VALIDATING, TOKEN_VALIDATED, TOKEN_REFRESHED, TOKEN_INVALIDATED, TOKEN_DELETING, TOKEN_DELETED } from '../actions/token';
import { INIT, VALIDATING, VALIDATED, INVALIDATED, DELETING } from '../status';

export default function token (state = {status: INIT}, action = {}) {

    switch (action.type) {

        case TOKEN_VALIDATING:

            return {
                ...action.data,
                status: VALIDATING
            };

        case TOKEN_VALIDATED:

            return {
                ...action.data,
                status: VALIDATED
            };

        case TOKEN_REFRESHED:

            return {
                ...state,
                ...action.data
            };

        case TOKEN_INVALIDATED:

            return {
                status: INVALIDATED
            };

        case TOKEN_DELETING:

            return {
                status: DELETING
            };

        case TOKEN_DELETED:

            return {
                status: INIT
            };

        default:
            return state;
    }
}
