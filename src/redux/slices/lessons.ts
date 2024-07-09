import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ILesson {
	id: number;
	studentId: number;
	date: string;
	hasTime: boolean;
	info: {
		note: string;
		tasks: string;
		homework: string;
		stoppedAt: string;
	};
	isTest: boolean;
	isConstant: boolean | "ready";
}

interface lessonsState {
	lessons: ILesson[];
	isFetching: boolean;
}

const initialState: lessonsState = {
	lessons: [],
	isFetching: true,
};

const sortLessons = (lessons: ILesson[]): ILesson[] => {
	return lessons.sort(({ date: a }, { date: b }) => new Date(a).getTime() - new Date(b).getTime());
};

const lessonsSlice = createSlice({
	name: "lessons",
	initialState,
	reducers: {
		setIsLessonsFetching(state, action: PayloadAction<boolean>) {
			state.isFetching = action.payload;
		},
		setLessons(state, action: PayloadAction<lessonsState["lessons"]>) {
			state.lessons = sortLessons(action.payload);
		},
		addLesson(state, action: PayloadAction<ILesson>) {
			state.lessons = sortLessons([...state.lessons, action.payload]);
		},
		removeLesson(state, action: PayloadAction<number>) {
			state.lessons = sortLessons(state.lessons.filter((lesson) => lesson.id !== action.payload));
		},
		updateLesson(state, action: PayloadAction<{ id: number; data: Partial<ILesson> }>) {
			const { id, data } = action.payload;

			state.lessons = sortLessons(
				state.lessons.map((lesson) => {
					if (lesson.id === id) return { ...lesson, ...data };

					return lesson;
				})
			);
		},
	},
});

export default lessonsSlice;
