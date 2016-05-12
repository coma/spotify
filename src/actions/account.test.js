import test from 'tape';
import faker from 'faker';
import nock from 'nock';

import {
    fetchAccount,
    ACCOUNT_FETCHING,
    ACCOUNT_FETCHED,
    ACCOUNT_ERROR
} from './account';

test('The fetchAccount on success', t => {

    t.plan(2);

    const action = fetchAccount(),
          user   = {
              email: faker.internet.email()
          };

    const expectedActions = [
        {
            type: ACCOUNT_FETCHING
        },
        {
            type: ACCOUNT_FETCHED,
            data: user
        }
    ];

    const dispatch = actual => {

        const expected = expectedActions.shift();
        t.deepEqual(actual, expected, `Should dispatch a ${ expected.type } action.`);
    };

    nock('https://api.spotify.com')
        .get('/v1/me')
        .reply(200, user);

    action(dispatch);
});

test('The fetchAccount on error', t => {

    t.plan(2);

    const action = fetchAccount();

    const expectedActions = [
        {
            type: ACCOUNT_FETCHING
        },
        {
            type: ACCOUNT_ERROR
        }
    ];

    const dispatch = actual => {

        const expected = expectedActions.shift();
        t.deepEqual(actual, expected, `Should dispatch a ${ expected.type } action.`);
    };

    nock('https://api.spotify.com')
        .get('/v1/me')
        .reply(404);

    action(dispatch);
});