import { combineReducers } from "redux";
import itemReducer from "./itemReducer";
import purchaseReducer from "./purchaseReducer";
import errorReducer from "./errorReducer";
import authReducer from "./authReducer";

export default combineReducers({
  purchases: purchaseReducer,
  item: itemReducer,
  error: errorReducer,
  auth: authReducer
});
