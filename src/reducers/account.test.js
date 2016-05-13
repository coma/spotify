import test from 'tape';
import faker from 'faker';

import { TOKEN_DELETED } from '../actions/token';

import {
    ACCOUNT_FETCHING,
    ACCOUNT_FETCHED,
    ACCOUNT_ERROR
} from '../actions/account';

import {
    FETCHING,
    FETCHED,
    ERROR
} from '../status';

import reducer, { initialState } from './account';

test('The account reducer default', t => {

    const actual = reducer();

    t.plan(1);
    t.deepEqual(actual, initialState, 'Should return the state.');
});

test(`The account reducer on ${ TOKEN_DELETED }`, t => {

    const state = {
        name: 'foo'
    };

    const action = {
        type: TOKEN_DELETED
    };

    const actual = reducer(state, action);

    t.plan(2);
    t.deepEqual(actual, initialState, 'Should return the initial state.');
    t.notEqual(actual, initialState, 'Should return a new object.');
});

test(`The account reducer on ${ ACCOUNT_FETCHING }`, t => {

    const state = {
        name: 'foo'
    };

    const action = {
        type: ACCOUNT_FETCHING
    };

    const expected = {
        status: FETCHING
    };

    t.plan(1);
    t.deepEqual(reducer(state, action), expected, 'Should return fetching.');
});

test(`The account reducer on ${ ACCOUNT_ERROR }`, t => {

    const state = {
        name: 'foo'
    };

    const action = {
        type: ACCOUNT_ERROR
    };

    const expected = {
        status: ERROR
    };

    t.plan(1);
    t.deepEqual(reducer(state, action), expected, 'Should return error.');
});

test(`The account reducer on ${ ACCOUNT_FETCHED }`, t => {

    const action = {
        type: ACCOUNT_FETCHED,
        data: {
            id          : faker.random.uuid(),
            email       : faker.internet.email(),
            display_name: faker.internet.userName()
        }
    };

    const expected = {
        status : FETCHED,
        profile: {
            email   : action.data.email,
            username: action.data.display_name
        }
    };

    t.plan(2);
    t.deepEqual(reducer(initialState, action), expected, 'Should return the fetched profile.');

    delete action.data.display_name;
    expected.profile.username = action.data.id;

    t.deepEqual(reducer(initialState, action), expected, 'Should return the fetched profile.');
});