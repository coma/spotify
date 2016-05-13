import test from 'tape';
import faker from 'faker';

import { TOKEN_DELETED } from '../actions/token';

import {
    RELEASES_FETCHING,
    RELEASES_FETCHED,
    RELEASES_ERROR
} from '../actions/releases';

import {
    FETCHING,
    FETCHED,
    ERROR
} from '../status';

import reducer, { initialState } from './releases';

test('The releases reducer default', t => {

    const actual = reducer();

    t.plan(1);
    t.deepEqual(actual, initialState, 'Should return the state.');
});

test(`The releases reducer on ${ TOKEN_DELETED }`, t => {

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

test(`The releases reducer on ${ RELEASES_FETCHING }`, t => {

    const state = {
        name: 'foo'
    };

    const action = {
        type: RELEASES_FETCHING
    };

    const expected = {
        status: FETCHING
    };

    t.plan(1);
    t.deepEqual(reducer(state, action), expected, 'Should return fetching.');
});

test(`The releases reducer on ${ RELEASES_ERROR }`, t => {

    const state = {
        name: 'foo'
    };

    const action = {
        type: RELEASES_ERROR
    };

    const expected = {
        status: ERROR
    };

    t.plan(1);
    t.deepEqual(reducer(state, action), expected, 'Should return error.');
});

test(`The releases reducer on ${ RELEASES_FETCHED }`, t => {

    const action = {
        type: RELEASES_FETCHED,
        data: {
            albums: {
                items: [{
                    id    : faker.random.uuid(),
                    name  : faker.commerce.productName(),
                    images: [{
                        url: faker.internet.avatar()
                    }]
                }]
            }
        }
    };

    const expected = {
        status : FETCHED,
        list   : action.data.albums.items.map(album => ({
            id   : album.id,
            name : album.name,
            cover: album.images[0].url
        }))
    };

    t.plan(1);
    t.deepEqual(reducer(initialState, action), expected, 'Should return the fetched list.');
});