import React from 'react';
import { Link } from 'react-router';
import style from './style.css';

class NotFoundView extends React.Component {

    render () {

        return (
            <div className={ style.main }>
                <h1>Not found</h1>
                <p>Try <Link to="login">this</Link>!</p>
            </div>
        );
    }
}

export default NotFoundView;
