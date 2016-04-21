import React from 'react';
import { Route, IndexRoute } from 'react-router';

import AppView       from './view';
import NotFoundView  from './view/404';
import LoginView     from './view/login';
import LogoutView    from './view/logout';
import PrivateView   from './view/private';
import DashboardView from './view/private/dashboard';
import PlaylistView  from './view/private/playlist';

export default function routes (verifyToken) {

    return (
        <Route component={ AppView } path="/">
            <Route component={ LoginView } path="login"/>
            <Route component={ LogoutView } path="logout"/>
            <Route component={ PrivateView } path="app" onEnter={ verifyToken }>
                <IndexRoute component={ DashboardView }/>
                <Route component={ PlaylistView } path="playlist"/>
            </Route>
            <Route component={ NotFoundView } path="*"/>
        </Route>
    );
}
