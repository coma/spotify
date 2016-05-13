import test from 'tape';
import faker from 'faker';
import nock from 'nock';

import {
    fetchReleases,
    RELEASES_FETCHING,
    RELEASES_FETCHED,
    RELEASES_ERROR
} from './releases';

test('The fetchReleases on success', t => {

    t.plan(2);

    const action   = fetchReleases(),
          releases = [faker.internet.email()];

    const expectedActions = [
        {
            type: RELEASES_FETCHING
        },
        {
            type: RELEASES_FETCHED,
            data: releases
        }
    ];

    const dispatch = actual => {

        const expected = expectedActions.shift();
        t.deepEqual(actual, expected, `Should dispatch a ${ expected.type } action.`);
    };

    nock('https://api.spotify.com')
        .get('/v1/browse/new-releases')
        .reply(200, releases);

    action(dispatch);
});

test('The fetchReleases on error', t => {

    t.plan(2);

    const action = fetchReleases();

    const expectedActions = [
        {
            type: RELEASES_FETCHING
        },
        {
            type: RELEASES_ERROR
        }
    ];

    const dispatch = actual => {

        const expected = expectedActions.shift();
        t.deepEqual(actual, expected, `Should dispatch a ${ expected.type } action.`);
    };

    nock('https://api.spotify.com')
        .get('/v1/browse/new-releases')
        .reply(404);

    action(dispatch);
});