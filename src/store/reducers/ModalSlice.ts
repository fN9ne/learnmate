import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface ModalState {
	isNewStudentModalActive: boolean;
	isDeleteStudentModalActive: boolean;
	isLearnModalActive: boolean;
	isLogoutModalActive: boolean;
	isNewBookModalActive: boolean;
	isHistoryLessonModalActive: boolean;
	isEditStudentModalActive: boolean;
	isNewExtraBookModalActive: boolean;
	isPatchNoteModalActive: boolean;
}

const initialState: ModalState = {
	isNewStudentModalActive: false,
	isDeleteStudentModalActive: false,
	isLearnModalActive: false,
	isLogoutModalActive: false,
	isNewBookModalActive: false,
	isHistoryLessonModalActive: false,
	isEditStudentModalActive: false,
	isNewExtraBookModalActive: false,
	isPatchNoteModalActive: false,
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
		updateLogoutModalStatus(state, action: PayloadAction<boolean>) {
			state.isLogoutModalActive = action.payload;
			Object.values(state).some((value) => value === true)
				? (document.documentElement.style.overflow = "hidden")
				: (document.documentElement.style.overflow = "visible");
		},
		updateNewBookModalStatus(state, action: PayloadAction<boolean>) {
			state.isNewBookModalActive = action.payload;
			Object.values(state).some((value) => value === true)
				? (document.documentElement.style.overflow = "hidden")
				: (document.documentElement.style.overflow = "visible");
		},
		updateHistoryLessonModalStatus(state, action: PayloadAction<boolean>) {
			state.isHistoryLessonModalActive = action.payload;
			Object.values(state).some((value) => value === true)
				? (document.documentElement.style.overflow = "hidden")
				: (document.documentElement.style.overflow = "visible");
		},
		updateEditStudentModalStatus(state, action: PayloadAction<boolean>) {
			state.isEditStudentModalActive = action.payload;
			Object.values(state).some((value) => value === true)
				? (document.documentElement.style.overflow = "hidden")
				: (document.documentElement.style.overflow = "visible");
		},
		updateNewExtraBookModalStatus(state, action: PayloadAction<boolean>) {
			state.isNewExtraBookModalActive = action.payload;
			Object.values(state).some((value) => value === true)
				? (document.documentElement.style.overflow = "hidden")
				: (document.documentElement.style.overflow = "visible");
		},
		updatePatchNoteModalStatus(state, action: PayloadAction<boolean>) {
			state.isPatchNoteModalActive = action.payload;
			Object.values(state).some((value) => value === true)
				? (document.documentElement.style.overflow = "hidden")
				: (document.documentElement.style.overflow = "visible");
		},

		resetModal() {
			return initialState;
		},
	},
});

export default modalSlice;
