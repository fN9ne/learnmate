import { months } from "../../dates/dates";
import { useActions } from "../../hooks/useActions";
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

	const { email } = useAppSelector((state) => state.user);
	const { lessons, isLoaded } = useAppSelector((state) => state.lessons);
	const { payments } = useAppSelector((state) => state.payments);
	const { students } = useAppSelector((state) => state.students);

	const { updateFetchingLessons } = useActions();

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
		if (email && isLoaded) {
			const updateStudents = async () => {
				updateFetchingLessons(true);

				await supabase.from("schedules").update({ schedule: lessons }).eq("author_email", email);
				await supabase.from("students").update({ students: students }).eq("author_email", email);
				await supabase.from("payments").update({ payments: payments }).eq("author_email", email);

				updateFetchingLessons(false);
			};

			updateStudents();
		}
	}, [email, lessons, students, payments, isLoaded]);

	const transitions = {
		initial: { opacity: 0, scale: 0.95 },
		animate: { opacity: 1, scale: 1 },
		exit: { opacity: 0, scale: 0.95 },
		transition: { duration: 0.3 },
	};

	return (
		<div className="schedule">
			<header className="schedule__header">
				<CurrentDate />
				<CurrentTime />
				<MonthChanger
					date={`${months[currentMonth][0]} ${currentYear}`}
					handleNextMonth={handleNextMonth}
					handlePrevMonth={handlePrevMonth}
					handleReset={handleReset}
				/>
			</header>
			<AP mode="wait" initial={false}>
				{!isLoaded && (
					<m.div {...transitions} key="loader" className="schedule__loader loader">
						<span></span>
					</m.div>
				)}
				{isLoaded && (
					<m.div {...transitions} key="calendar">
						<Calendar year={currentYear} month={currentMonth} />
					</m.div>
				)}
			</AP>
		</div>
	);
};

export default Schedule;
