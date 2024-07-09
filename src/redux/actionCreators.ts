import globalSlice from "./slices/global";
import lessonsSlice from "./slices/lessons";
import lpSlice from "./slices/lp";
import modalSlice from "./slices/modal";
import notesSlice from "./slices/notes";
import paymentsSlice from "./slices/payments";
import studentsSlice from "./slices/students";

export default {
	...globalSlice.actions,
	...modalSlice.actions,
	...lessonsSlice.actions,
	...studentsSlice.actions,
	...notesSlice.actions,
	...lpSlice.actions,
	...paymentsSlice.actions,
};
