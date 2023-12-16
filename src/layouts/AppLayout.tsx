import { FC, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import Sidebar, { SidebarItem } from "../components/Sidebar/Sidebar";

import CalendarIcon from "../icons/calendar.svg?react";
import GroupIcon from "../icons/group.svg?react";
import PaymentsIcon from "../icons/payment.svg?react";
import ListIcon from "../icons/list.svg?react";
import { useAppSelector } from "../hooks/useAppSelector";

const pages: SidebarItem[] = [
	{
		icon: <CalendarIcon />,
		path: "/app/schedule",
		name: "Расписание",
	},
	{
		icon: <GroupIcon />,
		path: "/app/students",
		name: "Ученики",
	},
	{
		icon: <PaymentsIcon />,
		path: "/app/payments",
		name: "Платежи",
	},
	{
		icon: <ListIcon />,
		path: "/app/learning-plan",
		name: "Учебный план",
	},
];

const AppLayout: FC = () => {
	const { isAuthorized } = useAppSelector((state) => state.user);

	const navigate = useNavigate();

	useEffect(() => {
		if (isAuthorized === false) {
			navigate("/signin");
		}
	}, [isAuthorized]);

	return (
		<div className="app">
			<Sidebar pages={pages} />
			<Outlet />
		</div>
	);
};

export default AppLayout;
