import React from 'react';
import test from 'tape';
import faker from 'faker';
import sinon from 'sinon';
import * as Redux from 'redux';
import {DashboardView} from './index';
import {shallow} from 'enzyme';
import {INIT, FETCHING, FETCHED} from 'src/status';
import { fetchReleases } from 'src/actions/releases';
import Spinner from 'src/component/spinner';

test(`The DashboardView on ${ INIT }`, t => {

    t.plan(2);

    const wrapper = shallow(<DashboardView
        status={ INIT }
        fetchReleases={ () => t.pass('Should try to fetch releases.') }/>
    );

    t.ok(wrapper.contains(<Spinner/>), 'Should show some feedback.');
});

test(`The DashboardView on ${ FETCHING }`, t => {

    t.plan(1);

    const wrapper = shallow(<DashboardView
        status={ FETCHING }
        fetchReleases={ () => t.fail('Should not try to fetch releases.') }/>
    );

    t.ok(wrapper.contains(<Spinner/>), 'Should show some feedback.');
});

test(`The DashboardView on ${ FETCHED }`, t => {

    const list = ((total, list = []) => {

        while (list.length < total) {

            list.push({
                id   : faker.random.uuid(),
                name : faker.commerce.productName(),
                cover: faker.internet.avatar()
            });
        }

        return list;

    })(faker.random.number({min: 1, max: 5}));

    const wrapper = shallow(<DashboardView
        status={ FETCHED }
        list={ list }
        fetchReleases={ () => t.fail('Should not try to fetch releases.') }/>
    );

    t.plan(2 * list.length);

    wrapper.find('li').forEach((li, i) => {

        t.equal(li.find('span').text(), list[i].name, 'Should render the name.');
        t.equal(li.find('img').props().src, list[i].cover, 'Should render the cover image.');
    });
});

test('The DashboardView mapStateToProps', t => {

    t.plan(1);

    const state = {
        releases: faker.internet.email()
    };

    const actual = DashboardView.mapStateToProps(state);

    t.equal(actual, state.releases, 'Should map the props.');
});

test('The DashboardView mapDispatchToProps', t => {

    t.plan(1);

    const expected = { fetchReleases },
          spied    = sinon.spy(Redux, 'bindActionCreators');

    DashboardView.mapDispatchToProps(() => {});
    t.deepEqual(spied.lastCall.args[0], expected, 'Should map the actions.');
    spied.restore();
});