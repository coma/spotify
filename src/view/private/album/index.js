import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchAlbum } from 'src/actions/album';
import { INIT, FETCHING, FETCHED } from 'src/status';
import Spinner from 'src/component/spinner';

export class AlbumView extends React.Component {

    static mapStateToProps ({album}, {params}) {

        return {
            album: album[params.id]
        };
    }

    static mapDispatchToProps (dispatch) {

        return bindActionCreators({fetchAlbum}, dispatch);
    }

    componentWillMount () {

        if ([FETCHED, FETCHING].indexOf(this.props.album.status) < 0) {

            this.props.fetchAlbum(this.props.album);
        }
    }

    renderAlbumFetched () {

        return (
            <div>
                <h2>{ this.props.album.year }</h2>
                <h2>Artists</h2>
                <ul>{ this.props.album.artists.map(a => <li key={ a.id }>{ a.name }</li>) }</ul>
                <h2>Tracks</h2>
                <ul>{ this.props.album.tracks.map(a => <li key={ a.id }>{ a.name }</li>) }</ul>
            </div>
        );
    }

    renderAlbumFetching () {

        return <Spinner/>;
    }

    renderAlbum () {

        switch (this.props.album.status) {

            case FETCHED:
                return this.renderAlbumFetched();

            default:
                return this.renderAlbumFetching();
        }
    }

    render () {

        return (
            <div>
                <h1>{ this.props.album.name }</h1>
                { this.renderAlbum() }
            </div>
        );
    }
}

AlbumView.propTypes = {
    album: PropTypes.shape({
        id     : PropTypes.string.isRequired,
        name   : PropTypes.string.isRequired,
        cover  : PropTypes.string.isRequired,
        status : PropTypes.oneOf([INIT, FETCHING, FETCHED]).isRequired,
        artists: PropTypes.arrayOf(PropTypes.shape({
            id   : PropTypes.string.isRequired,
            name : PropTypes.string.isRequired
        })),
        tracks : PropTypes.arrayOf(PropTypes.shape({
            id      : PropTypes.string.isRequired,
            name    : PropTypes.string.isRequired,
            year    : PropTypes.number.isRequired,
            disc    : PropTypes.number.isRequired,
            number  : PropTypes.number.isRequired,
            duration: PropTypes.number.isRequired,
            preview : PropTypes.string
        }))
    }).isRequired
};

export default connect(AlbumView.mapStateToProps, AlbumView.mapDispatchToProps)(AlbumView);
