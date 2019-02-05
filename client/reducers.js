/**
 * Root Reducer
 */
import { combineReducers } from 'redux';

// Import Reducers
import app from './modules/App/AppReducer';
import loans from './modules/Loans/LoansReducer';

// Combine all reducers into one root reducer
export default combineReducers({
  app,
  loans,
});
