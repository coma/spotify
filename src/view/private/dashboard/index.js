import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchReleases } from 'src/actions/releases';
import { INIT, FETCHING, FETCHED } from 'src/status';
import style from './index.css';
import Spinner from 'src/component/spinner';

export class DashboardView extends Component {

    static mapStateToProps ({ releases }) {

        return releases;
    }

    static mapDispatchToProps (dispatch) {

        return bindActionCreators({ fetchReleases }, dispatch);
    }

    componentWillMount () {

        if ([FETCHED, FETCHING].indexOf(this.props.status) < 0) {

            this.props.fetchReleases();
        }
    }

    renderReleasesFetching () {

        return <Spinner/>;
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

            case FETCHED:
                return this.renderReleasesFetched();

            default:
                return this.renderReleasesFetching();
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

export default connect(DashboardView.mapStateToProps, DashboardView.mapDispatchToProps)(DashboardView);
