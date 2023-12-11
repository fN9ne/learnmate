import { months } from "../../dates/dates";
import Calendar from "./Calendar";
import CurrentDate from "./CurrentDate";
import CurrentTime from "./CurrentTime";
import MonthChanger from "./MonthChanger";
import "./Schedule.scss";

import { FC, useState } from "react";

const Schedule: FC = () => {
	const date = new Date();

	const [currentMonth, setCurrentMonth] = useState<number>(date.getMonth());
	const [currentYear, setCurrentYear] = useState<number>(date.getFullYear());

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
