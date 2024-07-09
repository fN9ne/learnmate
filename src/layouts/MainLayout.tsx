import { FC, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { motion as m } from "framer-motion";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useActions } from "@/hooks/useActions";
import UpcomingLesson from "@/pages/Schedule/UpcomingLesson";
import Notes from "@/pages/Schedule/Notes";

const MainLayout: FC = () => {
	const { authorizedUser, googleAuthProgress } = useAppSelector((state) => state.global);
	const { setHeaderVisibility } = useActions();

	useEffect(() => {
		setHeaderVisibility(true);
	}, []);

	const transitions = {
		initial: { opacity: 0, y: 20 },
		animate: { opacity: 1, y: 0 },
		exit: { opacity: 0, y: 20 },
	};

	const navigate = useNavigate();

	useEffect(() => {
		if (!googleAuthProgress && authorizedUser === null) {
			setHeaderVisibility(false);
			navigate("/");
		}
	}, [authorizedUser, googleAuthProgress]);

	return (
		<main className="page">
			<div className="container">
				<m.div {...transitions} className="page__content">
					<Outlet />
				</m.div>
				<aside className="sidebar">
					<UpcomingLesson />
					<Notes />
				</aside>
			</div>
		</main>
	);
};

export default MainLayout;
