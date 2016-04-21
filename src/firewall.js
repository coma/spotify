import { FETCHED } from './status';

export default function firewall (store) {

    return (nextState, replace) => {

        if (store.getState().account.status !== FETCHED) {

            replace('/login');
        }
    }
}