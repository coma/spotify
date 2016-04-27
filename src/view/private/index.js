import React from 'react';
import Nav from './nav';

class PrivateView extends React.Component {

    render () {

        return (
            <div>
            	<Nav/>
            	<main>{ this.props.children }</main>
            </div>
        );
    }
}

export default PrivateView;
