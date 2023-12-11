import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from "./reducers/UserSlice";
import lessonsSlice from "./reducers/LessonsSlice";
import studentsSlice from "./reducers/StudentsSlice";
import modalSlice from "./reducers/ModalSlice";

const rootReducer = combineReducers({
	user: userSlice.reducer,
	lessons: lessonsSlice.reducer,
	students: studentsSlice.reducer,
	modal: modalSlice.reducer,
});

export const setupStore = () => {
	return configureStore({
		reducer: rootReducer,
	});
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
