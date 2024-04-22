import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IBook {
	name: string;
	lessons: number[];
}

export interface IPresentation {
	name: string;
}

interface LearningPlanState {
	books: IBook[];
	presentations: IPresentation[];
	isLoaded: boolean;
	isLoadedPresentations: boolean;
}

const initialState: LearningPlanState = {
	books: [],
	presentations: [],
	isLoaded: false,
	isLoadedPresentations: false,
};

const learningPlanSlice = createSlice({
	name: "learningPlan",
	initialState,
	reducers: {
		updateLoadedBooks(state, action: PayloadAction<boolean>) {
			state.isLoaded = action.payload;
		},
		updateLoadedPresentations(state, action: PayloadAction<boolean>) {
			state.isLoadedPresentations = action.payload;
		},
		setBooks(state, action: PayloadAction<IBook[]>) {
			state.books = action.payload;
		},
		setPresentations(state, action: PayloadAction<IPresentation[]>) {
			state.presentations = action.payload;
		},
		resetLearningPlan() {
			return initialState;
		},
	},
});

export default learningPlanSlice;
