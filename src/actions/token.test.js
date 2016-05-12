import test from 'tape';
import sinon from 'sinon';
import nock from 'nock';
import faker from 'faker';
import {ACCOUNT_FETCHED} from './account';
import Request from '../request';
import {push} from 'react-router-redux';

import {
    grabFromQuery,
    deleteToken,
    $private,
    TOKEN_INIT,
    TOKEN_VALIDATING,
    TOKEN_VALIDATED,
    TOKEN_DELETED,
    TOKEN_INVALIDATED,
    TOKEN_REFRESHED
} from './token';

function fakeQuery () {

    return {
        access_token : faker.random.uuid(),
        refresh_token: faker.random.uuid(),
        expires_in   : faker.random.number({min: 1000, max: 5000}).toString()
    };
}

function fakeToken (query = fakeQuery(), offset = faker.random.number({min: 0, max: 1000})) {

    return {
        access    : query.access_token,
        refresh   : query.refresh_token,
        expiration: Number.parseInt(query.expires_in, 10) + offset
    };
}

test('The grabFromQuery for a invalid query string', t => {

    t.plan(3);

    t.equal(grabFromQuery({}).type, TOKEN_INIT, `Should return ${ TOKEN_INIT } if some of the credential parameters are not present in the query string.`);

    t.equal(grabFromQuery({
        access_token: 'abc',
        expires_in  : 3600
    }).type, TOKEN_INIT, `Should return ${ TOKEN_INIT } if some of the credential parameters are not present in the query string.`);

    t.equal(grabFromQuery({
        access_token : 'abc',
        refresh_token: 'abc'
    }).type, TOKEN_INIT, `Should return ${ TOKEN_INIT } if some of the credential parameters are not present in the query string.`);
});

test('The grabFromQuery for a valid query string', t => {

    t.plan(4);

    const offset = faker.random.number({min: 0, max: 1000}),
          query  = fakeQuery(),
          token  = fakeToken(query, offset),
          clock  = sinon.useFakeTimers(offset),
          user   = {
              email: faker.internet.email()
          },
          state  = {
              token: {}
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
        push('/app')
    ];

    const action   = grabFromQuery(query),
          dispatch = actual => {

              if (expectedActions.length < 1) {

                  return clock.restore();
              }

              const expected = expectedActions.shift();
              t.deepEqual(actual, expected, `Should dispatch a ${ expected.type } action.`);
          };

    Request.setGetState(() => state);

    nock('https://api.spotify.com')
        .get('/v1/me')
        .reply(200, user);

    action(dispatch);
});

test('The grabFromQuery for an invalid token', t => {

    t.plan(2);

    const offset = faker.random.number({min: 0, max: 1000}),
          query  = fakeQuery(),
          token  = fakeToken(query, offset),
          clock  = sinon.useFakeTimers(offset);

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
          action   = deleteToken(),
          dispatch = sinon.spy();

    const spies = {
        clearTimeout: sinon.spy(clock, 'clearTimeout')
    };

    action(dispatch);

    t.deepEqual(dispatch.firstCall.args[0], {
        type: TOKEN_DELETED
    }, `Should dispatch a ${ TOKEN_DELETED } action.`);

    t.deepEqual(dispatch.secondCall.args[0], push('/login'), 'Should redirect to login.');

    t.ok(spies.clearTimeout.calledWith($private.refreshTimeout()), 'Should clear the refresh timeout.');

    clock.restore();
});

test('The delayRefresh', t => {

    t.plan(2);

    const offset   = faker.random.number({min: 0, max: 1000}),
          query    = fakeQuery(),
          token    = fakeToken(query, offset),
          clock    = sinon.useFakeTimers(offset),
          dispatch = sinon.spy(),
          delay    = 1000 * (token.expiration - $private.TIME_OFFSET);

    const spies = {
        setTimeout: sinon.spy(clock, 'setTimeout')
    };

    const stubs = {
        now: sinon.stub(Date, 'now', () => 0)
    };

    $private.delayRefresh(token, dispatch);

    t.equal(spies.setTimeout.lastCall.args[1], delay, 'Should set a delay to refresh the token.');
    t.ok(spies.setTimeout.returned($private.refreshTimeout()), 'Should keep a reference to the delayed call.');

    nock('http://localhost:80')
        .post('/oauth/refresh')
        .query(q => true)
        .reply(200, fakeQuery());

    clock.tick(delay);
    clock.restore();
    stubs.now.restore();
});

test('The refreshToken on success', t => {

    t.plan(1);

    const offset   = faker.random.number({min: 0, max: 1000}),
          query    = fakeQuery(),
          token    = fakeToken(query, offset),
          dispatch = sinon.spy();

    nock('http://localhost:80')
        .post('/oauth/refresh')
        .query(q => {

            nock.cleanAll();
            t.equal(q.refresh_token, token.refresh, 'Should send the refresh token as part of the query string.');
            t.end();
        })
        .reply(200, fakeQuery());

    $private.refreshToken(token, dispatch);
});

test('The refreshToken on error', t => {

    t.plan(1);

    const offset   = faker.random.number({min: 0, max: 1000}),
          query    = fakeQuery(),
          token    = fakeToken(query, offset),
          dispatch = sinon.spy();

    nock('http://localhost:80')
        .post('/oauth/refresh')
        .query(q => {

            nock.cleanAll();
            t.equal(q.refresh_token, token.refresh, 'Should send the refresh token as part of the query string.');
            t.end();
        })
        .reply(403);

    $private.refreshToken(token, dispatch);
});

test('The onRefreshed', t => {

    t.plan(2);

    const offset   = faker.random.number({min: 0, max: 1000}),
          now      = faker.random.number({min: 0, max: 1000}),
          query    = fakeQuery(),
          token    = fakeToken(query, offset),
          clock    = sinon.useFakeTimers(offset),
          dispatch = sinon.spy();

    const spies = {
        setTimeout: sinon.spy(clock, 'setTimeout')
    };

    const stubs = {
        now: sinon.stub(Date, 'now', () => now)
    };

    $private.onRefreshed(query, token, dispatch);

    token.expiration = +query.expires_in + now;

    t.deepEqual(dispatch.lastCall.args[0], {
        type: TOKEN_REFRESHED,
        data: token
    }, `Should dispatch a ${ TOKEN_REFRESHED } action.`);

    t.ok(spies.setTimeout.returned($private.refreshTimeout()), 'Should keep a reference to the delayed call.');

    clock.restore();
    stubs.now.restore();
});