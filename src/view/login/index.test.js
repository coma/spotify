import React from 'react';
import test from 'tape';
import { LoginView } from './index';
import { shallow } from 'enzyme';
import { INIT, VALIDATING, VALIDATED } from 'src/status';

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