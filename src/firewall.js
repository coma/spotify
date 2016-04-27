import { VALIDATED } from './status';

export default function firewall (store) {

    return (nextState, replace) => {

        if (store.getState().token.status !== VALIDATED) {

            replace('/login');
        }
    }
}