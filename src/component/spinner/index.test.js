import React from 'react';
import test from 'tape';
import Spinner from './index';
import { shallow } from 'enzyme';

test('The AppView', t => {

    t.plan(1);
    const wrapper = shallow(<Spinner/>);
    t.equal(wrapper.find('div').length, 4, 'Should contain 4 divs.');
});