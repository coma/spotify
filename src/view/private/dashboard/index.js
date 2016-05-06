import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchReleases } from 'src/actions/releases';
import { INIT, FETCHING, FETCHED } from 'src/status';
import style from './index.css';

class DashboardView extends Component {

    componentWillMount () {

        if ([FETCHED, FETCHING].indexOf(this.props.status) < 0) {

            this.props.fetchReleases();
        }
    }

    renderReleasesFetching () {

        return (
            <div>Fetching...</div>
        );
    }

    renderReleasesFetched () {

        return (
            <ul className={ style.albums }>{ this.props.list.map(album => this.renderAlbum(album)) }</ul>
        );
    }

    renderAlbum ({id, cover, name}) {

        return (
            <li key={ id }>
                <div>
                    <img src={ cover }/>
                </div>
                <h2>
                    <span>{ name }</span>
                </h2>
            </li>
        );
    }

    renderReleases () {

        switch (this.props.status) {

            case FETCHING:
                return this.renderReleasesFetching();

            case FETCHED:
                return this.renderReleasesFetched();

            default:
                return false;
        }
    }

    render () {

        return (
            <div>
                <h1>Dashboard</h1>
                { this.renderReleases() }
            </div>
        );
    }
}

DashboardView.propTypes = {
    status: PropTypes.oneOf([INIT, FETCHING, FETCHED]).isRequired,
    list  : PropTypes.arrayOf(PropTypes.shape({
        id   : PropTypes.string.isRequired,
        name : PropTypes.string.isRequired,
        cover: PropTypes.string.isRequired
    }))
};

function mapStateToProps ({ releases }) {

    return releases;
}

function mapDispatchToProps (dispatch) {

    return bindActionCreators({ fetchReleases }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardView);
