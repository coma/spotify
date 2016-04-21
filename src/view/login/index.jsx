import style from './style.css';
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetch } from '../../actions/account';
import moment from 'moment';

class LoginView extends Component {

    constructor (props) {

        super(props);

        if (props.token) {

            this.props.fetch(props.token);
        }
    }

    renderLogin () {

        return (
            <div className={ style.box }>
                <a href="/oauth" target="_self">login from Spotify</a>
            </div>
        );
    }

    renderFetching () {

        return (
            <div className={ style.box }>Fetching user...</div>
        );
    }

    render () {

        return this.props.token ? this.renderFetching() : this.renderLogin();
    }
}

LoginView.propTypes = {
    token: PropTypes.shape({
        access    : PropTypes.string.isRequired,
        refresh   : PropTypes.string.isRequired,
        expiration: PropTypes.instanceOf(moment).isRequired
    })
};

function mapStateToProps (state) {

    const { query } = state.routing.locationBeforeTransitions;

    if (!query.access_token) {

        return {};
    }

    return {
        token: {
            access    : query.access_token,
            refresh   : query.refresh_token,
            expiration: moment().add(+query.expires_in, 'seconds')
        }
    };
}

function mapDispatchToProps (dispatch) {

    return bindActionCreators({ fetch }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginView);
