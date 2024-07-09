import { combineReducers, configureStore } from "@reduxjs/toolkit";
import modalSlice from "./slices/modal";
import globalSlice from "./slices/global";
import lessonsSlice from "./slices/lessons";
import studentsSlice from "./slices/students";
import notesSlice from "./slices/notes";
import lpSlice from "./slices/lp";
import paymentsSlice from "./slices/payments";

const rootReducer = combineReducers({
	modal: modalSlice.reducer,
	global: globalSlice.reducer,
	lessons: lessonsSlice.reducer,
	students: studentsSlice.reducer,
	notes: notesSlice.reducer,
	lp: lpSlice.reducer,
	payments: paymentsSlice.reducer,
});

export const setupStore = () => {
	return configureStore({
		reducer: rootReducer,
	});
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
