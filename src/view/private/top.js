import React from 'react';
import style from './top.css';
import Logo from 'src/logo';

class PrivateTop extends React.Component {

    render () {

        return (
            <div className={ style.main }>
                <Logo/>
            </div>
        );
    }
}

export default PrivateTop;
