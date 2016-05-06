import test from 'tape';
import nock from 'nock';
import Request from './request';

function mockHTTP (method = 'GET', code = 200) {

    return nock('https://api.spotify.com')
        .intercept('/v1/' + code, method)
        .reply(code);
}

test('The trimSlashes', t => {

    const expected = 'aaaaa',
          actual   = `/${ expected }/`;

    t.plan(1);
    t.equal(Request.trimSlashes(actual), expected, 'Should trim slashes.');
});

test('The getUrl', t => {

    const root     = 'http://pepe.com/',
          path     = '/lopez/',
          expected = 'http://pepe.com/lopez';

    t.plan(1);
    t.equal(Request.getUrl(path, root), expected, 'Should return a complete and well formed URL.');
});

test('The setGetState', t => {

    t.plan(1);

    const token = {
        access: Math.random()
    };

    Request.setGetState(() => ({token}));

    mockHTTP()
        .matchHeader('Authorization', 'Bearer ' + token.access);

    Request.get('/200').go().then(() => t.pass('Should set the auth token.'));
});

test('Every HTTP exported method', t => {

    const methods = {
        GET   : Request.get,
        POST  : Request.post,
        PATCH : Request.patch,
        PUT   : Request.put,
        HEAD  : Request.head,
        DELETE: Request.delete
    };

    const names = Object.keys(methods);

    t.plan(2 * names.length);

    names.forEach(n => {

        mockHTTP(n, 200);
        mockHTTP(n, 500);

        methods[n]('/200')
            .go()
            .then(() => t.pass(`Should do a good ${ n } HTTP request.`));

        methods[n]('/500')
            .go()
            .catch(() => t.pass(`Should do a bad ${ n } HTTP request.`));
    });
});