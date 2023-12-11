import userSlice from "./UserSlice";
import lessonsSlice from "./LessonsSlice";
import studentsSlice from "./StudentsSlice";
import modalSlice from "./ModalSlice";

export default {
	...userSlice.actions,
	...lessonsSlice.actions,
	...studentsSlice.actions,
	...modalSlice.actions,
};
