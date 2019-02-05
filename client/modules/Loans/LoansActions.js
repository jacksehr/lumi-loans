import callApi from '../../util/apiCaller';

// Export Constants
export const GOT_LOANS = 'GOT_LOANS';
export const SET_FILTER = 'SET_FILTER';

// Export Actions
export function gotData(data) {
  return {
    type: GOT_LOANS,
    data
  };
}

export function setFilter(query) {
  return {
    type: SET_FILTER,
    query,
  };
}

function fetchData(endpoint, actionToDispatch, queryString = '', callback = () => {}) {
  return (dispatch) => {
    return callApi(`${endpoint}${queryString}`).then(
      res => {
        dispatch(actionToDispatch(res));
        callback();
      }
    );
  };
}

export const fetchLoans = (queryString = '', callback = () => {}) => fetchData('loans', gotData, queryString, callback);

