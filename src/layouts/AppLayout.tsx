import { FC } from "react";
import { Outlet } from "react-router-dom";

import Sidebar, { SidebarItem } from "../components/Sidebar/Sidebar";

import CalendarIcon from "../icons/calendar.svg?react";
import GroupIcon from "../icons/group.svg?react";
import PaymentsIcon from "../icons/payment.svg?react";
import ListIcon from "../icons/list.svg?react";

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
	return (
		<div className="app">
			<Sidebar pages={pages} />
			<Outlet />
		</div>
	);
};

export default AppLayout;
