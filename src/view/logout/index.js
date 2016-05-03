import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { deleteToken } from 'src/actions/token';
import style from './style.css';

class LogoutView extends React.Component {

    componentWillMount () {

        this.props.deleteToken();
    }

    render () {

        return (
            <div className={ style.main }>Logging out...</div>
        );
    }
}

LogoutView.propTypes = {
    deleteToken: PropTypes.func.isRequired
};

function mapDispatchToProps (dispatch) {

    return bindActionCreators({ deleteToken }, dispatch);
}

export default connect(null, mapDispatchToProps)(LogoutView);
