import { FC } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

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

const App: FC = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<WrapperLayout />}>
					<Route index element={<Navigate to="welcome" />} />
					<Route path="/welcome" element={<Welcome />} />
					<Route path="/signin" element={<SignIn />} />
					<Route path="/signup" element={<SignUp />} />
					<Route path="/app/">
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
		</BrowserRouter>
	);
};

export default App;
