import { useAppSelector } from "@/hooks/useAppSelector";
import { FC } from "react";
import { AnimatePresence as AP, motion as m } from "framer-motion";

import LogoIcon from "@/img/logo.svg?react";
import ScheduleIcon from "@icons/schedule.svg?react";
import StudentsIcon from "@icons/students.svg?react";
import PaymentsIcon from "@icons/payments.svg?react";
import SettingsIcon from "@icons/settings.svg?react";
import LearningPlanIcon from "@icons/learningPlan.svg?react";
import LogoutIcon from "@icons/logout.svg?react";
import UpcomingIcon from "@icons/upcoming.svg?react";
import NoteIcon from "@icons/note.svg?react";

import Navbar, { INavbarItem } from "./Navbar";
import { useActions } from "@/hooks/useActions";
import supabase from "@/utils/supabase";
import { useNavigate } from "react-router-dom";
import { isWidthInViewport } from "@/functions";

const navLinks: INavbarItem[] = [
	{ name: "Расписание", path: "/schedule", icon: <ScheduleIcon /> },
	{ name: "Ученики", path: "/students", icon: <StudentsIcon /> },
	{ name: "Платежи", path: "/payments", icon: <PaymentsIcon /> },
	{ name: "Учебный план", path: "/learning-plan", icon: <LearningPlanIcon /> },
	{ name: "Настройки", path: "/settings", icon: <SettingsIcon /> },
];

const Header: FC = () => {
	const { isShowHeader, authorizedUser, shouldHighlight } = useAppSelector((state) => state.global);

	const { setAuthorizedUser, setHeaderVisibility, openModal } = useActions();

	const navigate = useNavigate();

	const transitions = {
		initial: { opacity: 0, y: -20 },
		animate: { opacity: 1, y: 0 },
		exit: { opacity: 0, y: -20 },
	};

	const handleLogout = async () => {
		setAuthorizedUser(null);
		setHeaderVisibility(false);

		await supabase.auth.signOut();

		navigate("/login");
	};

	return (
		<AP mode="wait" initial={false}>
			{isShowHeader && (
				<>
					<m.header key="header" {...transitions} className="header">
						<div className="header__container container">
							<div className="header__wrapper">
								<div className="header__content">
									<LogoIcon className="header__logo" />
									{!isWidthInViewport(425) && <Navbar links={navLinks} />}
									{!isWidthInViewport(425) && authorizedUser && (
										<div className="header-user">
											<div className="header-user__avatar">{authorizedUser.slice(0, 1)}</div>
											<div className="header-user__content">
												<div className="header-user__email text text--s">{authorizedUser}</div>
												<button onClick={handleLogout} className="header-user__logout">
													<LogoutIcon />
													<span>Выйти</span>
												</button>
											</div>
										</div>
									)}
									{isWidthInViewport(425) && (
										<>
											<div className="header-sidebar">
												<button
													onClick={() => openModal("upcomingLesson")}
													className={`header-sidebar-button${shouldHighlight ? " header-sidebar-button--highlighted" : ""}`}
												>
													<UpcomingIcon />
												</button>
												<button onClick={() => openModal("notes")} className="header-sidebar-button">
													<NoteIcon />
												</button>
											</div>
										</>
									)}
								</div>
							</div>
						</div>
					</m.header>
				</>
			)}
		</AP>
	);
};

export default Header;
