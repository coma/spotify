import test from 'tape';
import sinon from 'sinon';
import nock from 'nock';
import { grabFromQuery, deleteToken, TIME_OFFSET, TOKEN_INIT, TOKEN_VALIDATING, TOKEN_VALIDATED, TOKEN_DELETED, TOKEN_INVALIDATED, TOKEN_REFRESHED } from './token';
import { ACCOUNT_FETCHED } from './account';
import Request from '../request';
import { push } from 'react-router-redux';

test('The grabFromQuery for a invalid query string', t => {

    t.plan(3);

    t.equal(grabFromQuery({}).type, TOKEN_INIT, `Should return ${ TOKEN_INIT } if some of the credential parameters are not present in the query string.`);
    t.equal(grabFromQuery({access_token: 'abc', expires_in: 3600}).type, TOKEN_INIT, `Should return ${ TOKEN_INIT } if some of the credential parameters are not present in the query string.`);
    t.equal(grabFromQuery({access_token: 'abc', refresh_token: 'abc'}).type, TOKEN_INIT, `Should return ${ TOKEN_INIT } if some of the credential parameters are not present in the query string.`);
});

test('The grabFromQuery for a valid query string', t => {

    t.plan(6);

    const offset = Math.round(1000 * Math.random()),
          delay  = 1000 * (3600 - TIME_OFFSET),
          clock  = sinon.useFakeTimers(offset),
          sto    = sinon.spy(clock, 'setTimeout');

    const query = {
        access_token : Math.random(),
        refresh_token: Math.random(),
        expires_in   : '3600'
    };

    const token = {
        access    : query.access_token,
        refresh   : query.refresh_token,
        expiration: 3600 + offset
    };

    const user = {
        name: 'Juanito Coyote'
    };

    const state = {
        token: {
            delay: Math.random()
        }
    };

    const expectedActions = [
        {
            type: TOKEN_VALIDATING,
            data: token
        },
        {
            type: TOKEN_VALIDATED,
            data: token
        },
        {
            type: ACCOUNT_FETCHED,
            data: user
        },
        push('/app'),
        {
            type: TOKEN_REFRESHED,
            data: token
        }
    ];

    const action   = grabFromQuery(query),
          dispatch = actual => {

              if (expectedActions.length < 1) {

                  return clock.restore();
              }

              const expected = expectedActions.shift();
              t.deepEqual(actual, expected, `Should dispatch a ${ expected.type } action.`);

              if (expectedActions.length === 1) {

                  t.equal(sto.lastCall.args[1], delay, 'Should set a timeout to refresh the token.');

                  nock('http://localhost:80')
                      .post('/oauth/refresh')
                      .query(q => true)
                      .reply(200, query);

                  clock.tick(delay);
                  token.expiration += delay;
              }
          };

    Request.setGetState(() => state);

    nock('https://api.spotify.com')
        .get('/v1/me')
        .reply(200, user);

    action(dispatch);
});

test('The grabFromQuery for an invalid token', t => {

    t.plan(2);

    const clock = sinon.useFakeTimers();

    const query = {
        access_token : Math.random(),
        refresh_token: Math.random(),
        expires_in   : '3600'
    };

    const token = {
        access    : query.access_token,
        refresh   : query.refresh_token,
        expiration: 3600
    };

    const expectedActions = [
        {
            type: TOKEN_VALIDATING,
            data: token
        },
        {
            type: TOKEN_INVALIDATED
        }
    ];

    const action   = grabFromQuery(query),
          dispatch = actual => {

              const expected = expectedActions.shift();
              t.deepEqual(actual, expected, `Should dispatch a ${ expected.type } action.`);

              if (expectedActions.length < 1) {

                  clock.restore();
              }
          };

    nock('https://api.spotify.com')
        .get('/v1/me')
        .reply(403);

    action(dispatch);
});

test('The deleteToken', t => {

    t.plan(3);

    const clock    = sinon.useFakeTimers(),
          cto      = sinon.spy(clock, 'clearTimeout'),
          action   = deleteToken(),
          dispatch = sinon.spy();

    action(dispatch);

    t.deepEqual(dispatch.firstCall.args[0], {
        type: TOKEN_DELETED
    }, `Should dispatch a ${ TOKEN_DELETED } action.`);

    t.deepEqual(dispatch.secondCall.args[0], push('/login'), 'Should redirect to login.');

    t.ok(cto.called, 'Should clear the refresh timeout.');

    clock.restore();
});