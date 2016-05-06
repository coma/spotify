import style from './style.css';
import buttonStyle from 'src/button.css';
import React, { Component, PropTypes } from 'react';
import { INIT, VALIDATING, VALIDATED } from 'src/status';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { grabFromQuery } from 'src/actions/token';

export class LoginView extends Component {

    static mapStateToProps (state) {

        return {
            status: state.token.status,
            query : state.routing.locationBeforeTransitions.query
        };
    }

    static mapDispatchToProps (dispatch) {

        return bindActionCreators({ grabFromQuery }, dispatch);
    }

    componentWillMount () {

        this.props.grabFromQuery(this.props.query);
    }

    renderLogin () {

        return (
            <div className={ style.main }>
                <a href="/oauth" target="_self" className={ buttonStyle.success }>login with Spotify</a>
            </div>
        );
    }

    renderValidating () {

        return (
            <div className={ style.main }>Validating...</div>
        );
    }

    renderValidated () {

        return (
            <div className={ style.main }>Welcome!</div>
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
    status       : PropTypes.oneOf([INIT, VALIDATING, VALIDATED]).isRequired,
    query        : PropTypes.object.isRequired,
    grabFromQuery: PropTypes.func.isRequired
};

export default connect(LoginView.mapStateToProps, LoginView.mapDispatchToProps)(LoginView);
