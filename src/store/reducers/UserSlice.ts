import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
	isAuthorized: boolean | null;
	isEmailSended: boolean | null;
}

const initialState: UserState = {
	isAuthorized: null,
	isEmailSended: null,
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		updateAuthorizedStatus(state, action: PayloadAction<boolean>) {
			state.isAuthorized = action.payload;
		},
		updateEmailSendedStatus(state, action: PayloadAction<boolean>) {
			state.isEmailSended = action.payload;
		},
	},
});

export default userSlice;
