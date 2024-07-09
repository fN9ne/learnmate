import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IStudentBook {
	id: number;
	progress: number[];
}

export interface IAdditionalStudentBook {
	id: number;
	name: string;
	color: string | null;
	lessons: number;
	progress: number[];
}

export interface IStudent {
	id: number;
	color: string;
	name: string;
	username: string;
	discord: string;
	cost: number;
	note: string;
	learningPlan: IStudentBook[];
	additionalLearningPlan: IAdditionalStudentBook[];
	presentations: number[];
	isActive: boolean;
	createDate: string;
}

interface studentsState {
	students: IStudent[];
	isFetching: boolean;
}

const initialState: studentsState = {
	students: [],
	isFetching: true,
};

const studentsSlice = createSlice({
	name: "students",
	initialState,
	reducers: {
		setIsStudentsFetching(state, action: PayloadAction<boolean>) {
			state.isFetching = action.payload;
		},
		setStudents(state, action: PayloadAction<studentsState["students"]>) {
			state.students = action.payload;
		},
		addStudent(state, action: PayloadAction<IStudent>) {
			state.students = [...state.students, action.payload];
		},
		removeStudent(state, action: PayloadAction<number>) {
			state.students = state.students.filter((student) => student.id !== action.payload);
		},
		updateStudent(state, action: PayloadAction<{ id: number; data: Partial<IStudent> }>) {
			const { id, data } = action.payload;

			state.students = state.students.map((student) => {
				if (student.id === id) return { ...student, ...data };
				return student;
			});
		},
	},
});

export default studentsSlice;
