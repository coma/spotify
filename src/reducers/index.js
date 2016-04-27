import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import account from './account';
import token from './token';

export default combineReducers({
    routing,
    account,
    token
 });
