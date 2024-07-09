import { FC, useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Authorization, { AuthorizationTypes } from "./pages/Authorization";
import Header from "./components/Header";
import Schedule from "./pages/Schedule/Schedule";

import { AnimatePresence as AP } from "framer-motion";
import { useActions } from "./hooks/useActions";
import MainLayout from "./layouts/MainLayout";
import Students from "./pages/Students/Students";
import Payments from "./pages/Payments/Payments";
import LearningPlan from "./pages/LearningPlan/LearningPlan";
import Settings from "./pages/Settings/Settings";
import UsersGuide from "./pages/UsersGuide/UsersGuide";
import Student from "./pages/Student/Student";
import { useAppSelector } from "./hooks/useAppSelector";
import { Theme } from "./redux/slices/global";
import supabase from "./utils/supabase";
import UpcomingLessonModal from "./components/Modal/UpcomingLessonModal";

const App: FC = () => {
	const location = useLocation();

	const { setPickedDay, setIsDayPicked } = useActions();
	const { settings, googleAuthProgress, authorizedUser } = useAppSelector((state) => state.global);
	const { lessons } = useAppSelector((state) => state.lessons);
	const { students } = useAppSelector((state) => state.students);
	const { books, presentations } = useAppSelector((state) => state.lp);
	const { payments } = useAppSelector((state) => state.payments);
	const { notes } = useAppSelector((state) => state.notes);

	const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);

	const {
		setAuthorizedUser,
		setSettings,
		setGoogleAuthProgress,
		setLP,
		setLessons,
		setNotes,
		setPayments,
		setStudents,
		setIsLessonsFetching,
		setIsStudentsFetching,
		setIsNotesFetching,
		setIsPaymentsFetching,
	} = useActions();

	useEffect(() => {
		setTimeout(() => {
			const storedAuthData = localStorage.getItem(`sb-${import.meta.env.VITE_APP_NAME}-auth-token`);
			const storedSettingsData = localStorage.getItem("lm-settings");

			if (storedAuthData) {
				setAuthorizedUser(JSON.parse(storedAuthData).user.email);
			} else {
				if (googleAuthProgress) {
					setAuthorizedUser(null);
				} else {
					setTimeout(() => {
						const url = window.location.href;
						if (url.indexOf("#") > -1) {
							window.history.replaceState({}, document.title, url.replace(/#.*/, ""));
						}
						setGoogleAuthProgress(true);
					}, 500);
				}
			}

			if (storedSettingsData) {
				setSettings(JSON.parse(storedSettingsData));
			}

			const url = window.location.href;

			if (url.indexOf("#") > -1) {
				window.history.replaceState({}, document.title, url.replace(/#.*/, ""));
			}
		}, 500);
	}, [googleAuthProgress]);

	useEffect(() => {
		const getData = async () => {
			const { data: lessons } = await supabase.from("lessons").select("*").eq("author", authorizedUser);
			const { data: books } = await supabase.from("books").select("*").eq("author", authorizedUser);
			const { data: presentations } = await supabase.from("presentations").select("*").eq("author", authorizedUser);
			const { data: notes } = await supabase.from("notes").select("*").eq("author", authorizedUser);
			const { data: payments } = await supabase.from("payments").select("*").eq("author", authorizedUser);
			const { data: students } = await supabase.from("students").select("*").eq("author", authorizedUser);

			if (books && presentations) {
				setLP({ books: books[0].content, presentations: presentations[0].content, isFetching: false });
			}

			if (lessons) {
				setLessons(lessons[0].content);
				setIsLessonsFetching(false);
			}

			if (notes) {
				setNotes(notes[0].content);
				setIsNotesFetching(false);
			}

			if (payments) {
				setPayments(payments[0].content);
				setIsPaymentsFetching(false);
			}

			if (students) {
				setStudents(students[0].content);
				setIsStudentsFetching(false);
			}

			setIsDataLoaded(true);
		};

		const createTables = async () => {
			const { data } = await supabase.from("lessons").select("*").eq("author", authorizedUser);

			if (data && data.length === 0) {
				await supabase.from("lessons").insert([{ author: authorizedUser, content: [] }]);
				await supabase.from("books").insert([{ author: authorizedUser, content: [] }]);
				await supabase.from("presentations").insert([{ author: authorizedUser, content: [] }]);
				await supabase.from("notes").insert([{ author: authorizedUser, content: [] }]);
				await supabase.from("payments").insert([{ author: authorizedUser, content: [] }]);
				await supabase.from("students").insert([{ author: authorizedUser, content: [] }]);
			}
		};

		if (authorizedUser) {
			getData();
			createTables();
		}
	}, [authorizedUser]);

	/* updates */

	useEffect(() => {
		const updateLessons = async () => {
			await supabase.from("lessons").update({ content: lessons }).eq("author", authorizedUser);
		};

		if (lessons && authorizedUser && isDataLoaded) updateLessons();
	}, [lessons, authorizedUser]);

	useEffect(() => {
		const updateStudents = async () => {
			await supabase.from("students").update({ content: students }).eq("author", authorizedUser);
		};

		if (students && authorizedUser && isDataLoaded) updateStudents();
	}, [students, authorizedUser]);

	useEffect(() => {
		const updateNotes = async () => {
			await supabase.from("notes").update({ content: notes }).eq("author", authorizedUser);
		};

		if (notes && authorizedUser && isDataLoaded) updateNotes();
	}, [notes, authorizedUser]);

	useEffect(() => {
		const updateBooks = async () => {
			await supabase.from("books").update({ content: books }).eq("author", authorizedUser);
		};

		if (books && authorizedUser && isDataLoaded) updateBooks();
	}, [books, authorizedUser]);

	useEffect(() => {
		const updatePresentations = async () => {
			await supabase.from("presentations").update({ content: presentations }).eq("author", authorizedUser);
		};

		if (presentations && authorizedUser && isDataLoaded) updatePresentations();
	}, [presentations, authorizedUser]);

	useEffect(() => {
		const updatePayments = async () => {
			await supabase.from("payments").update({ content: payments }).eq("author", authorizedUser);
		};

		if (payments && authorizedUser && isDataLoaded) updatePayments();
	}, [payments, authorizedUser]);

	/* other */

	useEffect(() => {
		if (["/login", "/signup", "/email-confirm"].includes(location.pathname)) {
			document.documentElement.classList.remove("dark");
		} else if (settings.theme === Theme.System) {
			const isDarkMode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

			isDarkMode ? document.documentElement.classList.add("dark") : document.documentElement.classList.remove("dark");
		} else if (settings.theme === Theme.Dark) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, [location.pathname, settings.theme]);

	useEffect(() => {
		if (location.pathname !== "/schedule") {
			setTimeout(() => {
				setIsDayPicked(false);
				setPickedDay("");
			}, 300);
		}
	}, [location.pathname]);

	return (
		<>
			<Header />
			<AP mode="wait" initial={false}>
				<Routes location={location} key={location.pathname}>
					<Route index element={<Navigate to="login" />}></Route>
					<Route path="/login" element={<Authorization type={AuthorizationTypes.login} />} />
					<Route path="/signup" element={<Authorization type={AuthorizationTypes.signup} />} />
					<Route path="/email-confirm" element={<Authorization type={AuthorizationTypes.email} />} />
					<Route element={<MainLayout />}>
						<Route path="/schedule" element={<Schedule />} />
						<Route path="/student/:id" element={<Student />} />
						<Route path="/students" element={<Students />} />
						<Route path="/payments" element={<Payments />} />
						<Route path="/learning-plan" element={<LearningPlan />} />
						<Route path="/settings" element={<Settings />} />
						<Route path="/users-guide" element={<UsersGuide />} />
					</Route>
				</Routes>
			</AP>
			<UpcomingLessonModal />
		</>
	);
};

export default App;
