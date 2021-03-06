import React from 'react';
import test from 'tape';
import { LoginView } from './index';
import { shallow } from 'enzyme';
import { INIT, VALIDATING, VALIDATED } from 'src/status';
import { grabFromQuery } from 'src/actions/token';
import sinon from 'sinon';
import * as Redux from 'redux';

test('The LoginView', t => {

    t.plan(4);

    const query  = {},
          wrapper = shallow(<LoginView
            status={ INIT }
            query={ query }
            grabFromQuery={ actual => t.equal(actual, query, 'Should try to grab credentials from query.') }/>
        );

    const link = wrapper.find('a');

    t.equal(link.length, 1, 'Should have a link to allow the login.');

    const { href, target } = link.props();

    t.equal(href, '/oauth', 'Should have a link to allow the login.');
    t.equal(target, '_self', 'Should have a link to allow the login.');
});

test('The LoginView', t => {

    t.plan(2);

    const query   = {},
          wrapper = shallow(<LoginView
            status={ VALIDATING }
            query={ query }
            grabFromQuery={ actual => t.equal(actual, query, 'Should try to grab credentials from query.') }/>
        );

    t.equal(wrapper.text(), 'Validating...', 'Should show some feedback while validating.');
});

test('The LoginView', t => {

    t.plan(1);

    const wrapper = shallow(<LoginView
        status={ VALIDATED }
        query={ {} }
        grabFromQuery={ () => {} }/>
    );

    t.equal(wrapper.text(), 'Welcome!', 'Should show some feedback after succeeded validation.');
});

test('The LoginView mapStateToProps', t => {

    t.plan(1);

    const state = {
        token  : {
            status: VALIDATED
        }
    };

    const ownProps = {
        location: {
            query: {}
        }
    };

    const actual = LoginView.mapStateToProps(state, ownProps);

    const expected = {
        status: state.token.status,
        query : ownProps.location.query
    };

    t.deepEqual(actual, expected, 'Should map the props.');
});

test('The LoginView mapDispatchToProps', t => {

    t.plan(1);

    const expected = { grabFromQuery },
          spied    = sinon.spy(Redux, 'bindActionCreators');

    LoginView.mapDispatchToProps(() => {});
    t.deepEqual(spied.lastCall.args[0], expected, 'Should map the actions.');
    spied.restore();
});