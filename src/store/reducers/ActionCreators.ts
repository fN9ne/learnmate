import userSlice from "./UserSlice";
import lessonsSlice from "./LessonsSlice";
import studentsSlice from "./StudentsSlice";
import modalSlice from "./ModalSlice";
import paymentsSlice from "./PaymentsSlice";
import learningPlanSlice from "./LearningPlanSlice";

export default {
	...userSlice.actions,
	...lessonsSlice.actions,
	...studentsSlice.actions,
	...modalSlice.actions,
	...paymentsSlice.actions,
	...learningPlanSlice.actions,
};
