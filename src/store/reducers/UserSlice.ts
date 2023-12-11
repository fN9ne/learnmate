import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
	isAuthorized: boolean | null;
	email: string | null;
}

const initialState: UserState = {
	isAuthorized: null,
	email: null,
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		updateEmail(state, action: PayloadAction<string>) {
			state.email = action.payload;
		},
		updateAuthorizedStatus(state, action: PayloadAction<boolean>) {
			state.isAuthorized = action.payload;
		},
	},
});

export default userSlice;
