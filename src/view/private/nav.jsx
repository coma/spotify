import React from 'react';
import { Link } from 'react-router';

class PrivateNav extends React.Component {

    render () {

        return (
            <nav>
                <div>
                    <Link to="/app">Dashboard</Link>
                    <Link to="/app/playlist">Playlist</Link>
                </div>
            </nav>
        );
    }
}

export default PrivateNav;
