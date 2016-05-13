import { TOKEN_VALIDATING, TOKEN_VALIDATED, TOKEN_REFRESHED, TOKEN_INVALIDATED, TOKEN_DELETED } from '../actions/token';
import { INIT, VALIDATING, VALIDATED, INVALIDATED } from '../status';

export const initialState = {
    status: INIT
};

export default function token (state = initialState, action = {}) {

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

        case TOKEN_DELETED:

            return {...initialState};

        default:
            return state;
    }
}
