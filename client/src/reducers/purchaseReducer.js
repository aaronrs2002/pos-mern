import {
  GET_PURCHASES,
  ADD_PURCHASE,
  UPDATE_PURCHASE,
  PURCHASES_LOADING
} from "../actions/types";

const initialState = {
  purchases: [],
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_PURCHASES:
      return {
        ...state,
        purchases: action.payload,
        loading: false
      };

    case ADD_PURCHASE:
      return {
        ...state,
        purchases: [action.payload, ...state.purchases]
      };

    case UPDATE_PURCHASE:
      return {
        ...state,
        purchases: action.payload
      };

    case PURCHASES_LOADING:
      return {
        ...state,
        loading: true
      };

    default:
      return state;
  }
}
