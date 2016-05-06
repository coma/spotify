import test from 'tape';
import sinon from 'sinon';
import { grabFromQuery, TOKEN_INIT, TOKEN_VALIDATING } from './token';
import Request from '../request';

test('The grabFromQuery', t => {

    t.plan(6);

    t.equal(grabFromQuery({}).type, TOKEN_INIT, `Should return ${ TOKEN_INIT } if some of the credential parameters are not present in the query string.`);
    t.equal(grabFromQuery({access_token: 'abc', expires_in: 3600}).type, TOKEN_INIT, `Should return ${ TOKEN_INIT } if some of the credential parameters are not present in the query string.`);
    t.equal(grabFromQuery({access_token: 'abc', refresh_token: 'abc'}).type, TOKEN_INIT, `Should return ${ TOKEN_INIT } if some of the credential parameters are not present in the query string.`);

    const clock = sinon.useFakeTimers(1000);

    const query = {
        access_token : 'abc',
        refresh_token: 'abc',
        expires_in   : '3600'
    };

    const state = {
        token: {
            delay: Math.random()
        }
    };

    const action   = grabFromQuery(query),
          dispatch = ({type, data}) => {

              t.equal(type, TOKEN_VALIDATING, `Should send a ${ TOKEN_VALIDATING } type`);
              t.deepEqual(data, {
                  access    : query.access_token,
                  refresh   : query.refresh_token,
                  expiration: +query.expires_in + 1000
              }, 'Should parse the token data');
          },
          getState = () => state;

    const stubbed = sinon.stub(Request, 'get', path => {

        t.equal(path, 'me', 'Should try to fetch the user profile');

        clock.restore();
        stubbed.restore();

        return {
            go: () => new Promise(() => {})
        };
    });

    action(dispatch, getState);
});