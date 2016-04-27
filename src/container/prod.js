import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';

class BrowserProductionContainer extends Component {

    render () {

        return (
            <Provider store={ this.props.store }>
                <Router history={ this.props.history }>{ this.props.routes }</Router>
            </Provider>
        );
    }
}

export default BrowserProductionContainer;
