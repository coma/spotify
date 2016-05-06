import style from './reset.css';
import React from 'react';
import { render } from 'react-dom';
import { browserHistory } from 'react-router';
import configureStore from './store';
import routes from './routes';
import Container from './container';
import firewall from './firewall';
import Request from './request';

const store = configureStore(browserHistory);

Request.setGetState(() => store.getState());
render(<Container store={ store } history={ browserHistory } routes={ routes(firewall(store)) }/>, document.getElementById('app'));
