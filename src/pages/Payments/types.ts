import { Student } from "../../store/reducers/StudentsSlice";

export enum PaymentStatus {
	paid = "paid",
	notPaid = "notPaid",
}

export interface Payment {
	student: Student;
	date: {
		day: number;
		month: number;
		year: number;
		weekday: number;
	};
	status: PaymentStatus;
}
