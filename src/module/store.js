import {combineReducers, createStore} from 'redux';
import loginReducer from "./login/reducer";
import registerReducer from "./register/reducer";
import homeReducer from "./home/reducer";
import userManageReducer from "./user/user-manage/reducer";

const rootReducer = combineReducers({
    login: loginReducer,
    register: registerReducer,
    home: homeReducer,
    userManage: userManageReducer
});

const store = createStore(rootReducer);
export default store;