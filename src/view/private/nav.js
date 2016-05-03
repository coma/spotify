import React, { Component, PropTypes } from 'react';
import { Link, IndexLink } from 'react-router';
import style from './nav.css'

class PrivateNav extends Component {

    render () {

        return (
            <nav className={ style.main }>
                <IndexLink to="/app" activeClassName={ style.current }>Dashboard</IndexLink>
                <Link to="/app/playlist" activeClassName={ style.current }>Playlist</Link>
                <Link to="/logout">Log out</Link>
            </nav>
        );
    }
}

export default PrivateNav;
