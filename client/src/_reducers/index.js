import { combineReducers } from "redux";
import user from "./user_reducer";

// Store안에 Reducer가 많이 있을 수 있다.
// combineReducers를 이용하여 rootReducer에서 하나로 합쳐준다.
const rootReducer = combineReducers({
  user,
});

export default rootReducer;
