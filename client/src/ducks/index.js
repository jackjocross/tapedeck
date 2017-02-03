import fetch from 'isomorphic-fetch';
import { createSelector } from 'reselect';
import md5 from 'md5';

const REQUEST = 'fetch/REQUEST';
const SUCCESS = 'fetch/SUCCESS';
const FAILURE = 'fetch/FAILURE';

export default function reducer(state = {}, action) {
  const { data, err, key, type } = action;
  switch (type) {
    case REQUEST: {
      return {
        ...state,
        [key]: {
          loading: true,
        },
      };
    }
    case SUCCESS: {
      return {
        ...state,
        [key]: {
          data,
        },
      };
    }
    case FAILURE: {
      return {
        ...state,
        [key]: {
          err,
        },
      };
    }
    default:
      return state;
  }
}

export function load({ input, init }) {
  const key = md5(JSON.stringify({ input, init }));
  return (dispatch) => {
    dispatch({
      key,
      type: REQUEST,
    });
    fetch(input, init)
      .then(res => res.json())
      .then((data) => {
        dispatch({
          data,
          key,
          type: SUCCESS,
        });
      })
      .catch((err) => {
        dispatch({
          err,
          key,
          type: FAILURE,
        });
      });
  };
}

const getCache = (state, ownProps) => {
  const { input, init } = ownProps;
  const key = md5(JSON.stringify({ input, init }));
  return state[key] || {};
};

const getCacheProp = prop => createSelector(
  [getCache],
  cache => cache[prop],
);

export const getData = getCacheProp('data');
export const getError = getCacheProp('err');
export const getLoading = getCacheProp('loading');
