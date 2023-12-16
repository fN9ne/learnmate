import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IBook {
	name: string;
	lessons: number[];
}

interface LearningPlanState {
	books: IBook[];
	isLoaded: boolean;
}

const initialState: LearningPlanState = {
	books: [],
	isLoaded: false,
};

const learningPlanSlice = createSlice({
	name: "learningPlan",
	initialState,
	reducers: {
		updateLoadedBooks(state, action: PayloadAction<boolean>) {
			state.isLoaded = action.payload;
		},
		setBooks(state, action: PayloadAction<IBook[]>) {
			state.books = action.payload;
		},
		resetLearningPlan() {
			return initialState;
		},
	},
});

export default learningPlanSlice;
