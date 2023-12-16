import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from "./reducers/UserSlice";
import lessonsSlice from "./reducers/LessonsSlice";
import studentsSlice from "./reducers/StudentsSlice";
import modalSlice from "./reducers/ModalSlice";
import paymentsSlice from "./reducers/PaymentsSlice";
import learningPlanSlice from "./reducers/LearningPlanSlice";

const rootReducer = combineReducers({
	user: userSlice.reducer,
	lessons: lessonsSlice.reducer,
	students: studentsSlice.reducer,
	modal: modalSlice.reducer,
	payments: paymentsSlice.reducer,
	learningPlan: learningPlanSlice.reducer,
});

export const setupStore = () => {
	return configureStore({
		reducer: rootReducer,
	});
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
