import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from "./reducers/UserSlice";

const rootReducer = combineReducers({
	user: userSlice.reducer,
});

export const setupStore = () => {
	return configureStore({
		reducer: rootReducer,
	});
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
