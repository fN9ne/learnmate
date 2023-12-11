import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface ModalState {
	isNewStudentModalActive: boolean;
	isDeleteStudentModalActive: boolean;
}

const initialState: ModalState = {
	isNewStudentModalActive: false,
	isDeleteStudentModalActive: false,
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
	},
});

export default modalSlice;
