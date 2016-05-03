import React from 'react';
import style from './index.css';
import Top from './top';
import Nav from './nav';

class PrivateView extends React.Component {

    render () {

        return (
            <div className={ style.main }>
                <Top/>
                <div className={ style.body }>
                    <Nav/>
                    <main className={ style.content }>{ this.props.children }</main>
                </div>
            </div>
        );
    }
}

export default PrivateView;
