import React from 'react';
import style from './style.css';

class Spinner extends React.Component {

    render () {

        return (
            <div className={ style.main }>
                <div></div>
                <div></div>
                <div></div>
            </div>
        );
    }
}

export default Spinner;
