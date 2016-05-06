import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import style from './top.css';
import Logo from 'src/logo';

class PrivateTop extends React.Component {

    render () {

        return (
            <div className={ style.main }>
                <Logo/>
                <div className={ style.user }>{ this.props.email }</div>
            </div>
        );
    }
}

PrivateTop.propTypes = {
    email   : PropTypes.string.isRequired,
    username: PropTypes.string.isRequired
};

function mapStateToProps ({ account }) {

    return account.profile;
}

export default connect(mapStateToProps)(PrivateTop);
