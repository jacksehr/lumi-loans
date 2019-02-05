import { GOT_LOANS, SET_FILTER } from './LoansActions';

// Initial State
const initialState = { data: [], query: '', pageCount: 0 };

const LoansReducer = (state = initialState, action) => {
  switch (action.type) {
    case GOT_LOANS :
      return {
        ...state,
        data: action.data.loans,
        pageCount: action.data.pageCount
      };
    case SET_FILTER:
      return {
        ...state,
        query: action.query
      };
    default:
      return state;
  }
};

/* Selectors */

// Get all loans
export const getLoans = state => state.loans.data;
export const getPageCount = state => state.loans.pageCount;
export const getFilter = state => state.loans.query;

// Export Reducer
export default LoansReducer;
