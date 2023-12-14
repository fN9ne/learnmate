import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface Student {
	name: string;
	username: string;
	discord_username: string | null;
	payment: number;
	lessons_count: number;
	color: string;
	lessons_history: string[];
}

export enum StudentsShowType {
	table = "table",
	compact = "compact",
}

interface StudentsState {
	students: Student[];
	showType: StudentsShowType;
	fetching: boolean;
	studentToDelete: Student | null;
	isLoaded: boolean;
}

const initialState: StudentsState = {
	students: [],
	showType: StudentsShowType.compact,
	fetching: false,
	studentToDelete: null,
	isLoaded: false,
};

const studentsSlice = createSlice({
	name: "students",
	initialState,
	reducers: {
		updateLoadedStudents(state, action: PayloadAction<boolean>) {
			state.isLoaded = action.payload;
		},
		updateStudentToDelete(state, action: PayloadAction<Student>) {
			state.studentToDelete = action.payload;
		},
		updateStudentsFetching(state, action: PayloadAction<boolean>) {
			state.fetching = action.payload;
		},
		addStudent(state, action: PayloadAction<Student>) {
			state.students = [...state.students, action.payload];
		},
		removeStudent(state, action: PayloadAction<string>) {
			state.students = state.students.filter((student) => student.username !== action.payload);
		},
		setStudents(state, action: PayloadAction<Student[]>) {
			state.students = action.payload;
		},
		updateShowType(state, action: PayloadAction<StudentsShowType>) {
			state.showType = action.payload;
		},
		resetStudents() {
			return initialState;
		},
	},
});

export default studentsSlice;
