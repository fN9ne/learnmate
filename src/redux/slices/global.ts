import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum Theme {
	Light = "light",
	Dark = "dark",
	System = "system",
}

export enum StudentNicknameSource {
	Telegram = "telegram",
	Discord = "discord",
}

export interface ISettings {
	highlightUpcomingLesson: boolean;
	highlightUpcomingLessonTime: number;
	showInitialOnBackground: boolean;
	theme: Theme;
	defaultCost: number;
	studentNicknameSource: StudentNicknameSource;
}

interface GlobalState {
	googleAuthProgress: boolean;
	isShowHeader: boolean;
	shouldHighlight: boolean;
	pickedDay: string;
	isDayPicked: boolean;
	authorizedUser: string | null | undefined | "proccessing";
	storedEmail: string | null;
	settings: ISettings;
}

const initialState: GlobalState = {
	googleAuthProgress: false,
	shouldHighlight: false,
	isShowHeader: false,
	isDayPicked: false,
	pickedDay: "",
	authorizedUser: undefined,
	storedEmail: null,
	settings: {
		highlightUpcomingLessonTime: 0,
		highlightUpcomingLesson: false,
		showInitialOnBackground: false,
		theme: Theme.System,
		defaultCost: 350,
		studentNicknameSource: StudentNicknameSource.Telegram,
	},
};

const globalSlice = createSlice({
	name: "global",
	initialState,
	reducers: {
		setShouldHighlight(state, action: PayloadAction<boolean>) {
			state.shouldHighlight = action.payload;
		},
		setGoogleAuthProgress(state, action: PayloadAction<GlobalState["googleAuthProgress"]>) {
			state.googleAuthProgress = action.payload;
		},
		setIsDayPicked(state, action: PayloadAction<boolean>) {
			state.isDayPicked = action.payload;
		},
		setPickedDay(state, action: PayloadAction<string>) {
			state.pickedDay = action.payload;
		},
		setHeaderVisibility(state, action: PayloadAction<boolean>) {
			state.isShowHeader = action.payload;
		},
		setAuthorizedUser(state, action: PayloadAction<GlobalState["authorizedUser"]>) {
			state.authorizedUser = action.payload;
		},
		setStoredEmail(state, action: PayloadAction<GlobalState["storedEmail"]>) {
			state.storedEmail = action.payload;
		},
		setSettings(state, action: PayloadAction<GlobalState["settings"]>) {
			state.settings = action.payload;
		},
		updateSettings(state, action: PayloadAction<Partial<GlobalState["settings"]>>) {
			const newSettings = {
				...state.settings,
				...action.payload,
			};

			state.settings = newSettings;

			localStorage.setItem("lm-settings", JSON.stringify(newSettings));
		},
	},
});

export default globalSlice;
