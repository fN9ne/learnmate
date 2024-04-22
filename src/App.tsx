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
import LogoutModal from "./components/Modal/LogoutModal";
import { Payment } from "./store/reducers/PaymentsSlice";
import { IBook, IPresentation } from "./store/reducers/LearningPlanSlice";
import PatchNoteModal from "./components/Modal/PatchNoteModal";

const App: FC = () => {
	const {
		updateAuthorizedStatus,
		updateEmail,
		updateLoadedLessons,
		updateLoadedStudents,
		updateLoadedPayments,
		updateLoadedBooks,
		updatePatchNoteModalStatus,
		updateLoadedPresentations,
	} = useActions();

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

	/* PATCH NOTES */

	useEffect(() => {
		const version = localStorage.getItem("version");

		if (!version || JSON.parse(version).ver !== import.meta.env.VITE_VERSION) {
			const patchDateArray = import.meta.env.VITE_PATCH_DATE.split(".");
			const patchDate = new Date(+patchDateArray[2], patchDateArray[1] - 1, +patchDateArray[0]);

			updatePatchNoteModalStatus(true);

			localStorage.setItem("version", JSON.stringify({ ver: import.meta.env.VITE_VERSION, date: patchDate }));
		}
	}, []);

	const { email } = useAppSelector((state) => state.user);
	const { setLessons, setStudents, setPayments, setBooks, setPresentations } = useActions();

	useEffect(() => {
		if (email) {
			const fetchData = async () => {
				const schedules = await supabase.from("schedules").select("schedule").eq("author_email", email);
				const students = await supabase.from("students").select("students").eq("author_email", email);
				const payments = await supabase.from("payments").select("payments").eq("author_email", email);
				const books = await supabase.from("learning_plan").select("books").eq("author_email", email);
				const presentations = await supabase.from("presentations").select("presentations").eq("author_email", email);

				if (schedules.data) {
					const learns: { schedule: Learn[] }[] = schedules.data;
					setLessons(learns[0].schedule);
					updateLoadedLessons(true);
				}

				if (students.data) {
					const studentsData: { students: Student[] }[] = students.data;
					setStudents(studentsData[0].students);
					updateLoadedStudents(true);
				}

				if (payments.data) {
					const paymentsData: { payments: Payment[] }[] = payments.data;
					setPayments(paymentsData[0].payments);
					updateLoadedPayments(true);
				}

				if (books.data) {
					const booksData: { books: IBook[] }[] = books.data;
					setBooks(booksData[0].books);
					updateLoadedBooks(true);
				}

				if (presentations.data) {
					const presentationsData: { presentations: IPresentation[] }[] = presentations.data;
					setPresentations(presentationsData[0].presentations);
					updateLoadedPresentations(true);
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
							<Route path="/app/student/:id" element={<StudentPage />} />
							<Route path="/app/payments" element={<Payments />} />
							<Route path="/app/learning-plan" element={<LearningPlan />} />
						</Route>
						<Route path="*" element={<NotFound />} />
					</Route>
				</Routes>
			</AP>
			<NewStudentModal />
			<LogoutModal />
			<PatchNoteModal />
		</>
	);
};

export default App;
