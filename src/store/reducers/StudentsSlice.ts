import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface Student {
	name: string;
	username: string;
	discord_username: string | null;
	payment: number;
	lessons_count: number;
	color: string;
	payed_lessons: number;
	lessons_history: { day: number; month: number; weekday: number }[];
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
}

const initialState: StudentsState = {
	students: [],
	showType: StudentsShowType.compact,
	fetching: false,
	studentToDelete: null,
};

const studentsSlice = createSlice({
	name: "students",
	initialState,
	reducers: {
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
	},
});

export default studentsSlice;
