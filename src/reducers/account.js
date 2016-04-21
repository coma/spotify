import { ACCOUNT_FETCHING, ACCOUNT_FETCHED, ACCOUNT_ERROR } from '../actions/account';
import { FETCHING, FETCHED, ERROR } from '../status';

export default function account (state = {}, action = {}) {

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

        default:
            return state;
    }
}
