import { FC, useEffect } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";

import WrapperLayout from "./layouts/WrapperLayout";
import Welcome from "./pages/Welcome/Welcome";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import Schedule from "./pages/Schedule/Schedule";
import Students from "./pages/Students/Students";
import Student from "./pages/Student/Student";
import Payments from "./pages/Payments/Payments";
import LearningPlan from "./pages/LearningPlan/LearningPlan";
import NotFound from "./pages/NotFound/NotFound";

import { AnimatePresence as AP } from "framer-motion";
import AppLayout from "./layouts/AppLayout";
import { useActions } from "./hooks/useActions";
import { useAppSelector } from "./hooks/useAppSelector";
import CheckEmail from "./pages/CheckEmail/CheckEmail";

const App: FC = () => {
	const { isEmailSended } = useAppSelector((state) => state.user);

	const { updateAuthorizedStatus } = useActions();

	const location = useLocation();

	const navigate = useNavigate();

	useEffect(() => {
		const user = localStorage.getItem(`sb-${import.meta.env.VITE_SUPABASE_NAME}-auth-token`);

		if (user && JSON.parse(user).user.aud === "authenticated") {
			updateAuthorizedStatus(true);
		} else {
			updateAuthorizedStatus(false);
		}
	}, []);

	useEffect(() => {
		if (isEmailSended === true) {
			navigate("/check-email");
		}
	}, [isEmailSended]);

	return (
		<AP mode="wait" initial={false}>
			<Routes location={location} key={location.pathname}>
				<Route path="/" element={<WrapperLayout />}>
					<Route index element={<Navigate to="welcome" />} />
					<Route path="/welcome" element={<Welcome />} />
					<Route path="/signin" element={<SignIn />} />
					<Route path="/signup" element={<SignUp />} />
					<Route path="/check-email" element={<CheckEmail />} />
					<Route path="/app/" element={<AppLayout />}>
						<Route index element={<Navigate to="schedule" />} />
						<Route path="/app/schedule" element={<Schedule />} />
						<Route path="/app/students" element={<Students />} />
						<Route path="/app/student/:username" element={<Student />} />
						<Route path="/app/payments" element={<Payments />} />
						<Route path="/app/learning-plan" element={<LearningPlan />} />
					</Route>
					<Route path="*" element={<NotFound />} />
				</Route>
			</Routes>
		</AP>
	);
};

export default App;
