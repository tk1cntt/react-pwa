import { combineReducers } from 'redux';
import runtime from './runtime';
import setting from './setting';
import authentication from './authentication';

export default combineReducers({
  runtime,
  authentication,
  setting
});
