import { compose, createStore, applyMiddleware } from 'redux';
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk';
import reducers from '../reducers';
import DevTools from './tools';

module.exports = function (history, initialState = {}) {

    const a     = compose(applyMiddleware(thunk), applyMiddleware(routerMiddleware(history)), DevTools.instrument()),
          c     = a(createStore),
          store = c(reducers, initialState);

    syncHistoryWithStore(history, store);

    if (module.hot) {

        module.hot.accept('../reducers', () => store.replaceReducer(require('../reducers').default));
    }

    return store;
};
