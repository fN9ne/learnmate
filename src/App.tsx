import { FC, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import WrapperLayout from "./layouts/WrapperLayout";
import Welcome from "./pages/Welcome/Welcome";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import Schedule from "./pages/Schedule/Schedule";
import Students from "./pages/Students/Students";
import StudentPage from "./pages/Student/Student";
import Payments from "./pages/Payments/Payments";
import LearningPlan from "./pages/LearningPlan/LearningPlan";
import NotFound from "./pages/NotFound/NotFound";

import { AnimatePresence as AP } from "framer-motion";
import AppLayout from "./layouts/AppLayout";
import { useActions } from "./hooks/useActions";
import CheckEmail from "./pages/CheckEmail/CheckEmail";
import NewStudentModal from "./components/Modal/NewStudentModal";
import supabase from "./services/createClient";
import { useAppSelector } from "./hooks/useAppSelector";
import { Learn } from "./store/reducers/LessonsSlice";
import { Student } from "./store/reducers/StudentsSlice";

const App: FC = () => {
	const { updateAuthorizedStatus, updateEmail } = useActions();

	const location = useLocation();

	useEffect(() => {
		const user = localStorage.getItem(`sb-${import.meta.env.VITE_SUPABASE_NAME}-auth-token`);

		if (user && JSON.parse(user).user.aud === "authenticated") {
			updateAuthorizedStatus(true);
			updateEmail(JSON.parse(user).user.email);
		} else {
			updateAuthorizedStatus(false);
		}
	}, []);

	const { email } = useAppSelector((state) => state.user);
	const { setLessons, setStudents } = useActions();

	useEffect(() => {
		if (email) {
			const fetchData = async () => {
				const schedules = await supabase.from("schedules").select("schedule").eq("author_email", email);
				const students = await supabase.from("students").select("students").eq("author_email", email);

				if (schedules.data) {
					const learns: { schedule: Learn[] }[] = schedules.data;
					setLessons(learns[0].schedule);
				}

				if (students.data) {
					const studentsData: { students: Student[] }[] = students.data;
					setStudents(studentsData[0].students);
				}
			};

			fetchData();
		}
	}, [email]);

	return (
		<>
			<AP mode="wait" initial={false}>
				<Routes location={location} key={location.pathname}>
					<Route path="/" element={<WrapperLayout />}>
						<Route index element={<Navigate to="welcome" />} />
						<Route path="/welcome" element={<Welcome />} />
						<Route path="/signin" element={<SignIn />} />
						<Route path="/signup" element={<SignUp />} />
						<Route path="/check-email" element={<CheckEmail />} />
						<Route path="/check-email/:confirmed" element={<CheckEmail />} />
						<Route path="/app/" element={<AppLayout />}>
							<Route index element={<Navigate to="schedule" />} />
							<Route path="/app/schedule" element={<Schedule />} />
							<Route path="/app/students" element={<Students />} />
							<Route path="/app/student/:username" element={<StudentPage />} />
							<Route path="/app/payments" element={<Payments />} />
							<Route path="/app/learning-plan" element={<LearningPlan />} />
						</Route>
						<Route path="*" element={<NotFound />} />
					</Route>
				</Routes>
			</AP>
			<NewStudentModal />
		</>
	);
};

export default App;
