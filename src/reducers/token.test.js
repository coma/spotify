import test from 'tape';
import faker from 'faker';

import {
    TOKEN_DELETED,
    TOKEN_INVALIDATED,
    TOKEN_REFRESHED,
    TOKEN_VALIDATED,
    TOKEN_VALIDATING
} from '../actions/token';

import {
    VALIDATING,
    VALIDATED,
    DELETING,
    INVALIDATED
} from '../status';

import reducer, {initialState} from './token';

test('The token reducer default', t => {

    const actual = reducer();

    t.plan(1);
    t.deepEqual(actual, initialState, 'Should return the state.');
});

test(`The token reducer on ${ TOKEN_DELETED }`, t => {

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

test(`The token reducer on ${ TOKEN_VALIDATING }`, t => {

    const action = {
        type: TOKEN_VALIDATING,
        data: {
            access: faker.random.uuid()
        }
    };

    const expected = {
        ... action.data,
        status: VALIDATING
    };

    t.plan(1);
    t.deepEqual(reducer(initialState, action), expected, 'Should return validating.');
});

test(`The token reducer on ${ TOKEN_VALIDATED }`, t => {

    const action = {
        type: TOKEN_VALIDATED,
        data: {
            access: faker.random.uuid()
        }
    };

    const state = {
        status: VALIDATED
    };

    const expected = {
        ...action.data,
        status: VALIDATED
    };

    t.plan(1);
    t.deepEqual(reducer(state, action), expected, 'Should return validated.');
});

test(`The token reducer on ${ TOKEN_REFRESHED }`, t => {

    const state = {
        status: VALIDATED,
        access: faker.random.uuid()
    };

    const action = {
        type: TOKEN_REFRESHED
    };

    const expected = {
        ...state,
        status: VALIDATED
    };

    t.plan(1);
    t.deepEqual(reducer(state, action), expected, 'Should return refreshed.');
});

test(`The token reducer on ${ TOKEN_INVALIDATED }`, t => {

    const action = {
        type: TOKEN_INVALIDATED
    };

    const expected = {
        status: INVALIDATED
    };

    t.plan(1);
    t.deepEqual(reducer(initialState, action), expected, 'Should return invalidated.');
});