import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import ReactDOM from 'react-dom';
import DevTools from '../store/tools';

class BrowserDevelopmentContainer extends Component {

    componentDidMount () {

        const div = document.createElement('div');
        document.body.appendChild(div);
        ReactDOM.render(<DevTools store={ this.props.store }/>, div);
    }

    render () {

        return (
            <Provider store={ this.props.store }>
                <Router history={ this.props.history }>{ this.props.routes }</Router>
            </Provider>
        );
    }
}

export default BrowserDevelopmentContainer;
