import style from './style.css';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { grabFromQuery } from '../../actions/token';
import { VALIDATING, VALIDATED } from '../../status';

class LoginView extends Component {

    constructor (props) {

        super(props);
        props.grabFromQuery(props.query);
    }

    renderLogin () {

        return (
            <div className={ style.box }>
                <a href="/oauth" target="_self">login from Spotify</a>
            </div>
        );
    }

    renderValidating () {

        return (
            <div className={ style.box }>Validating...</div>
        );
    }

    renderValidated () {

        return (
            <div className={ style.box }>Welcome!</div>
        );
    }

    render () {

        switch (this.props.status) {

            case VALIDATING:
                return this.renderValidating();

            case VALIDATED:
                return this.renderValidated();

            default:
                return this.renderLogin();
        }
    }
}

LoginView.propTypes = {
    status       : PropTypes.string.isRequired,
    query        : PropTypes.object.isRequired,
    grabFromQuery: PropTypes.func.isRequired
};

function mapStateToProps (state) {

    return {
        status: state.token.status,
        query : state.routing.locationBeforeTransitions.query
    };
}

function mapDispatchToProps (dispatch) {

    return bindActionCreators({ grabFromQuery }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginView);
