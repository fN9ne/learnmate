import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Learn {
	student: {
		id: number;
		name: string;
		username: string;
	};
	day: number;
	month: number;
	year: number;
	isTest: boolean;
	homework?: string;
	stoppedAt?: string;
	note?: string;
	plan?: string;
}

interface LessonsState {
	lessons: Learn[];
	pickedDay: {
		day: number;
		month: number;
		year: number;
	} | null;
}

const initialState: LessonsState = {
	lessons: [],
	pickedDay: null,
};

const lessonsSlice = createSlice({
	name: "lessons",
	initialState,
	reducers: {
		setLessons(state, action: PayloadAction<Learn[]>) {
			state.lessons = action.payload;
		},
	},
});

export default lessonsSlice;
