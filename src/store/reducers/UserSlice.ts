import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
	isAuthorized: boolean;
}

const initialState: UserState = {
	isAuthorized: false,
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		updateAuthorizedStatus(state, action: PayloadAction<boolean>) {
			state.isAuthorized = action.payload;
		},
	},
});

export default userSlice;
