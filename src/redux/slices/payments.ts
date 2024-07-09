import { generateId } from "@/functions";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IPayment {
	id: number;
	lessonId: number;
	isPaid: boolean;
}

interface paymentsState {
	payments: IPayment[];
	isFetching: boolean;
}

const initialState: paymentsState = {
	payments: [],
	isFetching: true,
};

const paymentsSlice = createSlice({
	name: "payments",
	initialState,
	reducers: {
		setIsPaymentsFetching(state, action: PayloadAction<boolean>) {
			state.isFetching = action.payload;
		},
		setPayments(state, action: PayloadAction<paymentsState["payments"]>) {
			state.payments = action.payload;
		},
		addPayment(state, action: PayloadAction<Omit<IPayment, "id">>) {
			state.payments = [...state.payments, { id: generateId(state.payments), ...action.payload }];
		},
		removePayment(state, action: PayloadAction<number>) {
			state.payments = state.payments.filter((payment) => payment.id !== action.payload);
		},
		updatePayment(state, action: PayloadAction<{ id: number; data: Partial<IPayment> }>) {
			const { id, data } = action.payload;

			state.payments = state.payments.map((payment) => {
				if (payment.id === id) return { ...payment, ...data };

				return payment;
			});
		},
	},
});

export default paymentsSlice;
