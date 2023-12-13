import { months } from "../../dates/dates";
import { useAppSelector } from "../../hooks/useAppSelector";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import supabase from "../../services/createClient";
import Calendar from "./Calendar";
import CurrentDate from "./CurrentDate";
import CurrentTime from "./CurrentTime";
import MonthChanger from "./MonthChanger";
import "./Schedule.scss";

import { FC, useEffect, useState } from "react";

const Schedule: FC = () => {
	useDocumentTitle("Расписание");

	const date = new Date();

	const [currentMonth, setCurrentMonth] = useState<number>(date.getMonth());
	const [currentYear, setCurrentYear] = useState<number>(date.getFullYear());

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
				const { error } = await supabase.from("schedules").update({ schedule: lessons }).eq("author_email", email);

				console.log(error === null ? "[SUCCESS]: Schedules обновлено без ошибок" : error);
			};

			updateStudents();
		}
	}, [lessons]);

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
			<Calendar year={currentYear} month={currentMonth} />
		</div>
	);
};

export default Schedule;
