import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Student } from "./StudentsSlice";

export interface Learn {
	hash: string;
	student: Student | null;
	day: number;
	month: number;
	year: number;
	time: {
		hour: number;
		minute: number;
	};
	isTest: boolean;
	homework: string;
	stoppedAt: string;
	note: string;
	plan: string;
}

export interface LearnChange {
	student?: Student;
	time?: {
		hour: number;
		minute: number;
	};
	isTest?: boolean;
	homework?: string;
	stoppedAt?: string;
	note?: string;
	plan?: string;
}

export interface Day {
	day: number;
	month: number;
	year: number;
}

interface LessonsState {
	lessons: Learn[];
	pickedDay: Day | null;
	isLoaded: boolean;
	fetching: boolean;
}

const initialState: LessonsState = {
	lessons: [],
	pickedDay: null,
	isLoaded: false,
	fetching: false,
};

const lessonsSlice = createSlice({
	name: "lessons",
	initialState,
	reducers: {
		updateFetchingLessons(state, action: PayloadAction<boolean>) {
			state.fetching = action.payload;
		},
		updateLoadedLessons(state, action: PayloadAction<boolean>) {
			state.isLoaded = action.payload;
		},
		addLesson(state, action: PayloadAction<Learn[]>) {
			state.lessons = [...state.lessons, ...action.payload];
		},
		setLessons(state, action: PayloadAction<Learn[]>) {
			state.lessons = action.payload;
		},
		setPickedDay(state, action: PayloadAction<Day | null>) {
			state.pickedDay = action.payload;
		},
		resetLessons() {
			return initialState;
		},
	},
});

export default lessonsSlice;
