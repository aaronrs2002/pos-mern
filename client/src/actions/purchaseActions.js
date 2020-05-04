import axios from "axios";
import {
  /*GET_ITEMS,
  ADD_ITEM,
  DELETE_ITEM,
  UPDATE_ITEM,
  ITEMS_LOADING*/
  GET_PURCHASES,
  ADD_PURCHASE,
  UPDATE_PURCHASE,
  PURCHASES_LOADING
} from "./types";
import { tokenConfig } from "./authActions";
import { returnErrors } from "./errorActions";

/*
export const getItems = () => dispatch => {
  setItemsLoading();
  //dispatch(setItemsLoading());
  axios
    .get("/api/items")
    .then(res =>
      dispatch({
        type: GET_ITEMS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};
*/

export const getPurchases = () => dispatch => {
  setPurchaseLoading();
  //dispatch(setPurchaseLoading());
  axios
    .get("/api/purchases")
    .then(res =>
      dispatch({
        type: GET_PURCHASES,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

export const addPurchase = purchase => (dispatch, getState) => {
  axios
    .post("/api/purchases", purchase, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: ADD_PURCHASE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

/*
export const deleteItem = id => (dispatch, getState) => {
  axios
    .delete(`/api/items/${id}`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: DELETE_ITEM,
        payload: id
      });
    })
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};*/

export const updatePurchase = purchase => (dispatch, getState) => {
  axios
    .put("/api/purchases/updateData/", purchase, tokenConfig(getState))
    .then(res => {
      console.log("From actions: " + JSON.stringify(purchase));
      dispatch({
        type: UPDATE_PURCHASE,
        payload: res.data
      });
    })
    .catch(err => dispatch(returnErrors(err)));
};

export const setPurchaseLoading = () => {
  return PURCHASES_LOADING;
};
