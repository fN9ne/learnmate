import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Student } from "./StudentsSlice";

export interface Payment {
	hash: string;
	student: Student | null;
	date: {
		day: number;
		month: number;
		year: number;
		hour: number;
		minute: number;
	};
	status: boolean | null;
}

interface PaymentsState {
	payments: Payment[];
	isLoaded: boolean;
	fetching: boolean;
}

const initialState: PaymentsState = {
	payments: [],
	isLoaded: false,
	fetching: false,
};

const paymentsSlice = createSlice({
	name: "payments",
	initialState,
	reducers: {
		updateFetchingPayments(state, action: PayloadAction<boolean>) {
			state.fetching = action.payload;
		},
		updateLoadedPayments(state, action: PayloadAction<boolean>) {
			state.isLoaded = action.payload;
		},
		setPayments(state, action: PayloadAction<Payment[]>) {
			state.payments = action.payload;
		},
	},
});

export default paymentsSlice;
