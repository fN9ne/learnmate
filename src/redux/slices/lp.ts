import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IBook {
	id: number;
	name: string;
	color: string | null;
	lessons: number;
}

export interface IPresentation {
	id: number;
	name: string;
	color: string | null;
}

interface lpState {
	books: IBook[];
	presentations: IPresentation[];
	isFetching: boolean;
}

const initialState: lpState = {
	books: [],
	presentations: [],
	isFetching: true,
};

const lpSlice = createSlice({
	name: "lp",
	initialState,
	reducers: {
		setIsLPFetching(state, action: PayloadAction<boolean>) {
			state.isFetching = action.payload;
		},
		setLP(_, action: PayloadAction<lpState>) {
			return action.payload;
		},
		addBook(state, action: PayloadAction<IBook>) {
			state.books = [...state.books, action.payload];
		},
		removeBook(state, action: PayloadAction<number>) {
			state.books = state.books.filter((book) => book.id !== action.payload);
		},
		updateBook(state, action: PayloadAction<{ id: number; data: Partial<IBook> }>) {
			const { id, data } = action.payload;

			state.books = state.books.map((book) => {
				if (book.id === id) return { ...book, ...data };

				return book;
			});
		},
		addPresentation(state, action: PayloadAction<IPresentation>) {
			state.presentations = [...state.presentations, action.payload];
		},
		removePresentation(state, action: PayloadAction<number>) {
			state.presentations = state.presentations.filter((presentation) => presentation.id !== action.payload);
		},
		updatePresentation(state, action: PayloadAction<{ id: number; data: Partial<IPresentation> }>) {
			const { id, data } = action.payload;

			state.presentations = state.presentations.map((presentation) => {
				if (presentation.id === id) return { ...presentation, ...data };

				return presentation;
			});
		},
	},
});

export default lpSlice;
