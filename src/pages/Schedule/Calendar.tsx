import { FC, useEffect, useState } from "react";
import { weekdays } from "../../dates/dates";

import { AnimatePresence as AP, motion as m } from "framer-motion";
import { useAppSelector } from "../../hooks/useAppSelector";

interface CalendarProps {
	year: number;
	month: number;
}

const Calendar: FC<CalendarProps> = ({ year, month }) => {
	const lessons = useAppSelector((state) => state.lessons);

	const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
	const weekdayOfMonth = (new Date(year, month, 1).getDay() + 6) % 7;
	const lastDayOfPrevMonth = new Date(year, month, 0).getDate();
	const lastWeekdayOfMonth = (new Date(year, month, lastDayOfMonth).getDay() + 6) % 7;

	interface Day {
		day: number;
		month: number;
		year: number;
		isActive: boolean;
	}

	const [visibleDays, setVisibleDays] = useState<Day[]>([]);

	useEffect(() => {
		const prevMonthDays = Array.from({ length: weekdayOfMonth }, (_, i) => ({
			day: lastDayOfPrevMonth - weekdayOfMonth + i + 1,
			month: month - 1,
			year,
			isActive: false,
		}));

		const thisMonthDays = Array.from({ length: lastDayOfMonth }, (_, i) => ({
			day: i + 1,
			month,
			year,
			isActive: true,
		}));

		const nextMonthDays = Array.from({ length: 6 - lastWeekdayOfMonth }, (_, i) => ({
			day: i + 1,
			month,
			year,
			isActive: false,
		}));

		const newDays = [...prevMonthDays, ...thisMonthDays, ...nextMonthDays];

		setVisibleDays(newDays);
	}, [year, month]);

	return (
		<div className="calendar">
			<header className="calendar__header">
				{weekdays.map((weekday, index) => (
					<div key={index} className="calendar__header-item">
						{weekday}
					</div>
				))}
			</header>
			<main className="calendar__body">
				<AP mode="wait" initial={false}>
					{visibleDays.map((day, index) => {
						const isLearningDay = lessons.lessons.some(
							(lesson) => lesson.day === day.day && lesson.month === day.month && lesson.year === day.year
						);

						return (
							<m.div
								initial={{ opacity: 0, scale: 0.6, rotate: -35 }}
								animate={{ opacity: 1, scale: 1, rotate: 0 }}
								exit={{ opacity: 0, scale: 0.6, rotate: 35 }}
								transition={{ duration: 0.25, delay: index * 0.00675 }}
								key={`${day.year}-${day.month}-${day.day}-${Math.random() * 1000}`}
								className={`calendar-day${day.isActive ? " calendar-day_active" : ""}${
									isLearningDay ? " calendar-day_learn" : ""
								}`}
							>
								<div className="calendar-day__number">{day.day}</div>
							</m.div>
						);
					})}
				</AP>
			</main>
		</div>
	);
};

export default Calendar;
