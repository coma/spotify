import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import account from './account';
import releases from './releases';
import token from './token';

export default combineReducers({
    routing,
    account,
    releases,
    token
 });
