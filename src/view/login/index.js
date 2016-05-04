import style from './style.css';
import buttonStyle from 'src/button.css';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { grabFromQuery } from 'src/actions/token';
import { INIT, VALIDATING, VALIDATED } from 'src/status';

export class LoginView extends Component {

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
