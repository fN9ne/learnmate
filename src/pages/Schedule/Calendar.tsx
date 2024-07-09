import { months, weekdays } from "@/datetime";
import { FC, useEffect, useState } from "react";

import CaretIcon from "@icons/caret.svg?react";
import classNames from "classnames";

import { AnimatePresence as AP, motion as m } from "framer-motion";
import { useAppSelector } from "@/hooks/useAppSelector";
import { ILesson } from "@/redux/slices/lessons";
import { useActions } from "@/hooks/useActions";

interface CalendarProps {
	date: Date;
}

const Calendar: FC<CalendarProps> = ({ date }) => {
	const { updateLesson } = useActions();

	const currentDate = date;
	const currentMonth = currentDate.getMonth();
	const currentYear = currentDate.getFullYear();

	const getDaysInMonth = (year: number, month: number) => {
		return new Date(year, month + 1, 0).getDate();
	};

	const getFirstDayOfMonth = (year: number, month: number) => {
		return (new Date(year, month, 1).getDay() + 6) % 7;
	};

	const generateCalendar = () => {
		const daysInCurrentMonth = getDaysInMonth(currentYear, currentMonth);
		const firstDayOfCurrentMonth = getFirstDayOfMonth(currentYear, currentMonth);

		const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
		const previousMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
		const daysInPreviousMonth = getDaysInMonth(previousMonthYear, previousMonth);

		const calendarDays = [];
		const today = new Date();

		let nextMonthDayCounter = 1;

		for (let i = firstDayOfCurrentMonth - 1; i >= 0; i--) {
			calendarDays.push({
				day: daysInPreviousMonth - i,
				month: previousMonth,
				year: previousMonthYear,
				active: false,
				isCurrentDay: false,
			});
		}

		for (let i = 1; i <= daysInCurrentMonth; i++) {
			calendarDays.push({
				day: i,
				month: currentMonth,
				year: currentYear,
				active: true,
				isCurrentDay: i === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear(),
			});
		}

		while (calendarDays.length % 7 !== 0) {
			const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
			const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear;
			calendarDays.push({ day: nextMonthDayCounter, month: nextMonth, year: nextMonthYear, active: false, isCurrentDay: false });
			nextMonthDayCounter++;
		}

		return calendarDays;
	};

	const calendarDays = generateCalendar();

	/* drag'n'drop functional */

	const [dragginLesson, setDragginLesson] = useState<ILesson | null>(null);

	const dragStartHandler = (lesson: ILesson) => setDragginLesson(lesson);

	const dragLeaveHandler = (event: React.DragEvent<HTMLTableCellElement>) => {
		const targetElement = event.target as Element;
		const parent = targetElement.closest(".calendar-day");

		parent?.classList.remove("calendar-day--dragover");
	};

	const dragOverHandler = (event: React.DragEvent<HTMLTableCellElement>) => {
		event.preventDefault();

		const targetElement = event.target as Element;
		const parent = targetElement.closest(".calendar-day");

		parent?.classList.add("calendar-day--dragover");
	};

	const dragDropHandler = (event: React.DragEvent<HTMLTableCellElement>, date: Date) => {
		event.preventDefault();

		const targetElement = event.target as Element;
		const parent = targetElement.closest(".calendar-day");

		parent?.classList.remove("calendar-day--dragover");

		if (dragginLesson) {
			updateLesson({
				id: dragginLesson.id,
				data: {
					date: date.toString(),
				},
			});
		}
	};

	/* other */

	const transitions = {
		initial: { opacity: 0, y: -5 },
		animate: { opacity: 1, y: 0 },
		exit: { opacity: 0, y: -5 },
	};

	return (
		<div className="calendar-wrapper">
			<table className="calendar">
				<thead>
					<tr>
						{weekdays.map((weekday, index) => (
							<th key={index}>
								<span>{weekday}</span>
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					<AP mode="wait" initial={false}>
						{Array.from({ length: calendarDays.length / 7 }, (_, rowIndex) => (
							<m.tr key={rowIndex + "" + date} {...transitions} transition={{ delay: 0.025 * rowIndex }}>
								{calendarDays.slice(rowIndex * 7, rowIndex * 7 + 7).map((day, colIndex) => (
									<Day
										onDragLeave={dragLeaveHandler}
										onDragOver={dragOverHandler}
										onDragStart={dragStartHandler}
										onDrop={dragDropHandler}
										key={colIndex}
										isActive={day.active}
										isCurrent={day.isCurrentDay}
										day={day.day}
										month={day.month}
										year={day.year}
										dragginLesson={dragginLesson}
									/>
								))}
							</m.tr>
						))}
					</AP>
				</tbody>
			</table>
		</div>
	);
};

export default Calendar;

interface DayProps {
	onDragLeave: (event: React.DragEvent<HTMLTableCellElement>) => void;
	onDragOver: (event: React.DragEvent<HTMLTableCellElement>) => void;
	onDrop: (event: React.DragEvent<HTMLTableCellElement>, date: Date) => void;
	onDragStart: (lesson: ILesson) => void;
	isActive: boolean;
	isCurrent: boolean;
	day: number;
	month: number;
	year: number;
	dragginLesson: ILesson | null;
}

const Day: FC<DayProps> = ({
	isActive,
	isCurrent,
	day,
	month,
	year,
	onDragLeave,
	onDragOver,
	onDragStart,
	onDrop,
	dragginLesson,
}) => {
	const { lessons } = useAppSelector((state) => state.lessons);
	const { students } = useAppSelector((state) => state.students);

	const [thisDayLessons, setThisDayLessons] = useState<ILesson[]>([]);

	const { setPickedDay, setIsDayPicked } = useActions();

	useEffect(() => {
		setThisDayLessons(
			lessons.filter((lesson) => {
				const date = new Date(lesson.date);

				if (date.getDate() === day && date.getMonth() === month && date.getFullYear() === year) return true;

				return false;
			})
		);
	}, [lessons]);

	const isFutureDay = (lessonDate: Date): boolean => {
		const currentDate = new Date();
		return lessonDate > currentDate;
	};

	const isPastDay = (lessonDate: Date): boolean => {
		const currentDate = new Date();
		return lessonDate < currentDate;
	};

	const getUpcomingLessonsWithTime = (lessons: ILesson[]): ILesson[] => {
		const currentTime = new Date();
		const currentHour = currentTime.getHours();
		const currentMinute = currentTime.getMinutes();
		const currentTotalMinutes = currentHour * 60 + currentMinute;

		return lessons.filter((lesson) => {
			if (!lesson.hasTime) return false;

			const date = new Date(lesson.date);
			if (!isFutureDay(date)) return false;

			const lessonTotalMinute = date.getHours() * 60 + date.getMinutes();
			return lessonTotalMinute > currentTotalMinutes;
		});
	};

	const findNearestLesson = (lessons: ILesson[]): string | null => {
		if (!lessons || lessons.length === 0) {
			return null;
		}

		if (isFutureDay(new Date(year, month, day))) {
			const nearestLessons = lessons
				.filter((lesson) => lesson.hasTime)
				.sort((a, b) => {
					const dateA = new Date(a.date);
					const dateB = new Date(b.date);
					const timeA = dateA.getHours() * 60 + dateA.getMinutes();
					const timeB = dateB.getHours() * 60 + dateB.getMinutes();
					return timeA - timeB;
				});

			if (nearestLessons.length > 0) {
				return formatTime(new Date(nearestLessons[0].date).getHours(), new Date(nearestLessons[0].date).getMinutes());
			}
		}

		const upcomingLessonsWithTime = getUpcomingLessonsWithTime(lessons);

		if (upcomingLessonsWithTime.length > 0) {
			upcomingLessonsWithTime.sort((a, b) => {
				const dateA = new Date(a.date);
				const dateB = new Date(b.date);
				const timeA = dateA.getHours() * 60 + dateA.getMinutes();
				const timeB = dateB.getHours() * 60 + dateB.getMinutes();
				return timeA - timeB;
			});

			const nearestLesson = upcomingLessonsWithTime[0];

			const date = new Date(nearestLesson.date);

			const formattedTime = formatTime(date.getHours(), date.getMinutes());

			return formattedTime;
		}

		const lessonsWithNoTime = lessons.filter((lesson) => !lesson.hasTime);

		if (lessonsWithNoTime.length > 0) {
			return "No time";
		}

		if (isPastDay(new Date(year, month, day))) {
			return null;
		}

		return null;
	};

	const formatTime = (hour: number, minute: number): string => {
		const formattedHour = hour < 10 ? "0" + hour : hour;
		const formattedMinute = minute < 10 ? "0" + minute : minute;
		return `${formattedHour}:${formattedMinute}`;
	};

	const dayClassNames = classNames(
		"calendar-day",
		{ "calendar-day--inactive": !isActive },
		{ "calendar-day--current": isCurrent },
		{ "calendar-day--lessons": thisDayLessons.length > 0 && findNearestLesson(thisDayLessons) }
	);

	return (
		<td
			className={dayClassNames}
			onClick={() => {
				setPickedDay(`${year}-${month + 1}-${day}`);
				setIsDayPicked(true);
			}}
			onDragLeave={onDragLeave}
			onDragOver={onDragOver}
			onDrop={(event: React.DragEvent<HTMLTableCellElement>) => {
				if (dragginLesson && dragginLesson.hasTime) {
					const date = new Date(dragginLesson.date);

					onDrop(event, new Date(year, month, day, date.getHours(), date.getMinutes()));
				} else {
					onDrop(event, new Date(year, month, day));
				}
			}}
		>
			<div className="calendar-day__body">
				<div className="calendar-day__number">{day}</div>
				{thisDayLessons.length > 0 && findNearestLesson(thisDayLessons) && (
					<div className="calendar-day__time">{findNearestLesson(thisDayLessons)}</div>
				)}
				<div className="calendar-day__students">
					{thisDayLessons.slice(0, 5).map((lesson, index) => (
						<div
							className="calendar-day__student"
							draggable
							onDragStart={() => onDragStart(lesson)}
							key={index}
							style={{ backgroundColor: students.find((student) => student.id === lesson.studentId)?.color }}
						>
							{students.find((student) => student.id === lesson.studentId)?.name.slice(0, 1)}
						</div>
					))}
				</div>
			</div>
		</td>
	);
};

interface MonthChangerProps {
	year: number;
	month: number;
	nextMonth: () => void;
	prevMonth: () => void;
	reset: () => void;
}

export const MonthChanger: FC<MonthChangerProps> = ({ year, month, nextMonth, prevMonth, reset }) => {
	return (
		<div className="month-changer">
			<button onClick={prevMonth} className="month-changer__arrow">
				<CaretIcon />
			</button>
			<button title={"Вернуться к текущему месяцу"} onClick={reset} className="month-changer__display">
				{months[month][0]} {year}
			</button>
			<button onClick={nextMonth} className="month-changer__arrow">
				<CaretIcon />
			</button>
		</div>
	);
};
