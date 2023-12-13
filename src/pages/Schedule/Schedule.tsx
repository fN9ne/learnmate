import { months } from "../../dates/dates";
import { useAppSelector } from "../../hooks/useAppSelector";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import supabase from "../../services/createClient";
import Calendar from "./Calendar";
import CurrentDate from "./CurrentDate";
import CurrentTime from "./CurrentTime";
import MonthChanger from "./MonthChanger";
import "./Schedule.scss";

import { AnimatePresence as AP, motion as m } from "framer-motion";

import { FC, useEffect, useState } from "react";

const Schedule: FC = () => {
	useDocumentTitle("Расписание");

	const date = new Date();

	const [currentMonth, setCurrentMonth] = useState<number>(date.getMonth());
	const [currentYear, setCurrentYear] = useState<number>(date.getFullYear());

	const [fetching, setFetching] = useState<boolean>(true);

	const { email } = useAppSelector((state) => state.user);
	const { lessons } = useAppSelector((state) => state.lessons);

	const handlePrevMonth = () => {
		if (currentMonth - 1 < 0) {
			setCurrentMonth(11);
			setCurrentYear((year) => year - 1);
		} else {
			setCurrentMonth((month) => month - 1);
		}
	};
	const handleNextMonth = () => {
		if (currentMonth + 1 > 11) {
			setCurrentMonth(0);
			setCurrentYear((year) => year + 1);
		} else {
			setCurrentMonth((month) => month + 1);
		}
	};
	const handleReset = () => {
		setCurrentMonth(date.getMonth());
		setCurrentYear(date.getFullYear());
	};

	useEffect(() => {
		if (email) {
			const updateStudents = async () => {
				supabase.from("schedules").update({ schedule: lessons }).eq("author_email", email);

				setFetching(false);
			};

			updateStudents();
		}
	}, [lessons]);

	const transitions = {
		initial: { opacity: 0, scale: 0.95 },
		animate: { opacity: 1, scale: 1 },
		exit: { opacity: 0, scale: 0.95 },
		transition: { duration: 0.3 },
	};

	return (
		<div className="schedule">
			<header className="schedule__header">
				<MonthChanger
					date={`${months[currentMonth][0]} ${currentYear}`}
					handleNextMonth={handleNextMonth}
					handlePrevMonth={handlePrevMonth}
					handleReset={handleReset}
				/>
				<CurrentDate />
				<CurrentTime />
			</header>
			<AP mode="wait" initial={false}>
				{fetching && (
					<m.div {...transitions} key="loader" className="schedule__loader loader">
						<span></span>
					</m.div>
				)}
				{!fetching && (
					<m.div {...transitions} key="calendar">
						<Calendar year={currentYear} month={currentMonth} />
					</m.div>
				)}
			</AP>
		</div>
	);
};

export default Schedule;
