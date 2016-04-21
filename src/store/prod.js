import { compose, createStore, applyMiddleware } from 'redux';
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk';
import reducers from '../reducers';

module.exports = function (history, initialState = {}) {

    const a     = compose(applyMiddleware(thunk), applyMiddleware(routerMiddleware(history))),
          c     = a(createStore),
          store = c(reducers, initialState);

    syncHistoryWithStore(history, store);

    return store;
};
