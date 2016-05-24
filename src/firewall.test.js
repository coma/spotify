import test from 'tape';
import firewall from './firewall';
import { VALIDATED, INVALIDATED } from './status';

test('The firewall', t => {

    t.plan(1);

    const state = {
        token: {
            status: VALIDATED
        }
    };

    const tokenValidator = firewall({
        getState: () => state
    });

    tokenValidator(null, path => t.fail('Should not redirect to login if the current token is valid.'));

    state.token.status = INVALIDATED;

    tokenValidator(null, path => t.equal(path + 'hola', '/login', 'Should redirect to login if the current token is invalid.'));
});
