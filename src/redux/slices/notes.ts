import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface INote {
	id: number;
	content: string;
}

interface notesState {
	notes: INote[];
	isFetching: boolean;
}

const initialState: notesState = {
	notes: [],
	isFetching: true,
};

const notesSlice = createSlice({
	name: "notes",
	initialState,
	reducers: {
		setIsNotesFetching(state, action: PayloadAction<boolean>) {
			state.isFetching = action.payload;
		},
		setNotes(state, action: PayloadAction<notesState["notes"]>) {
			state.notes = action.payload;
		},
		addNote(state, action: PayloadAction<INote>) {
			state.notes = [...state.notes, action.payload];
		},
		removeNote(state, action: PayloadAction<number>) {
			state.notes = state.notes.filter((note) => note.id !== action.payload);
		},
		updateNote(state, action: PayloadAction<{ id: number; data: INote }>) {
			const { id, data } = action.payload;

			state.notes = state.notes.map((note) => {
				if (note.id === id) return data;

				return note;
			});
		},
	},
});

export default notesSlice;
