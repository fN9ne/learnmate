import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface ModalState {
	isNewStudentModalActive: boolean;
	isDeleteStudentModalActive: boolean;
	isLearnModalActive: boolean;
}

const initialState: ModalState = {
	isNewStudentModalActive: false,
	isDeleteStudentModalActive: false,
	isLearnModalActive: false,
};

const modalSlice = createSlice({
	name: "modal",
	initialState,
	reducers: {
		updateNewStudentModalStatus(state, action: PayloadAction<boolean>) {
			state.isNewStudentModalActive = action.payload;
			Object.values(state).some((value) => value === true)
				? (document.documentElement.style.overflow = "hidden")
				: (document.documentElement.style.overflow = "visible");
		},
		updateDeleteStudentModalActive(state, action: PayloadAction<boolean>) {
			state.isDeleteStudentModalActive = action.payload;
			Object.values(state).some((value) => value === true)
				? (document.documentElement.style.overflow = "hidden")
				: (document.documentElement.style.overflow = "visible");
		},
		updateLearnModalStatus(state, action: PayloadAction<boolean>) {
			state.isLearnModalActive = action.payload;
			Object.values(state).some((value) => value === true)
				? (document.documentElement.style.overflow = "hidden")
				: (document.documentElement.style.overflow = "visible");
		},
	},
});

export default modalSlice;
