import { FC, useEffect, useState } from "react";
import { weekdays } from "../../dates/dates";

import { AnimatePresence as AP, motion as m } from "framer-motion";
import { useAppSelector } from "../../hooks/useAppSelector";
import LearnModal from "../../components/Modal/LearnModal";
import { useActions } from "../../hooks/useActions";
import { Day as DayState, Learn } from "../../store/reducers/LessonsSlice";

interface CalendarProps {
	year: number;
	month: number;
}

const Calendar: FC<CalendarProps> = ({ year, month }) => {
	const lessons = useAppSelector((state) => state.lessons);

	const { setPickedDay, updateLearnModalStatus, setLessons, setPayments } = useActions();
	const { payments } = useAppSelector((state) => state.payments);

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
			month: month + 1,
			year,
			isActive: false,
		}));

		const newDays = [...prevMonthDays, ...thisMonthDays, ...nextMonthDays];

		setVisibleDays(newDays);
	}, [year, month]);

	const handleOpenModal = (day: DayState) => {
		updateLearnModalStatus(true);
		setPickedDay(day);
	};

	const [draggingLearn, setDraggingLearn] = useState<Learn | null>(null);

	/* Начало перемещения */
	const dragStartHandler = (lesson: Learn) => {
		setDraggingLearn(lesson);
	};

	/* Когда вышли за пределы другой карточки */
	const dragLeaveHandler = (event: React.DragEvent<HTMLDivElement>) => {
		const targetElement = event.target as Element;
		const parent = targetElement.closest(".calendar-day");

		parent?.classList.remove("calendar-day_dragover");
	};

	/* Когда находимся над другим элементом */
	const dragOverHandler = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();

		const targetElement = event.target as Element;
		const parent = targetElement.closest(".calendar-day");

		parent?.classList.add("calendar-day_dragover");
	};

	/* Когда отпустили карточку и должно происходить какое-то действие */
	const dragDropHandler = (event: React.DragEvent<HTMLDivElement>, day: Day) => {
		event.preventDefault();

		const targetElement = event.target as Element;
		const parent = targetElement.closest(".calendar-day");

		parent?.classList.remove("calendar-day_dragover");

		const newLessons = lessons.lessons.map((lesson) => {
			if (lesson.hash === draggingLearn?.hash) {
				return {
					...draggingLearn,
					day: day.day,
					month: day.month,
					year: day.year,
				};
			}

			return lesson;
		});

		const newPayments = payments.map((payment) => {
			if (payment.hash === draggingLearn?.hash) {
				return {
					...payment,
					date: {
						...payment.date,
						day: day.day,
						month: day.month,
						year: day.year,
					},
				};
			}

			return payment;
		});

		setLessons(newLessons);
		setPayments(newPayments);
	};

	const transitions = {
		initial: { opacity: 0, scale: 0.95 },
		animate: { opacity: 1, scale: 1 },
		exit: { opacity: 0, scale: 0.95 },
	};

	return (
		<div className="calendar">
			<div className="calendar__wrapper">
				<header className="calendar__header">
					{weekdays.map((weekday, index) => (
						<div key={index} className="calendar__header-item">
							{weekday[0]}
						</div>
					))}
				</header>
				<main className="calendar__body">
					<AP mode="wait" initial={false}>
						{visibleDays.map((day, index) => {
							const isLearningDay = lessons.lessons.some(
								(lesson) => lesson.day === day.day && lesson.month === day.month && lesson.year === day.year
							);

							const currentDate = new Date();

							const thisDayLessons = lessons.lessons.filter(
								(lesson) => lesson.day === day.day && lesson.month === day.month && lesson.year === day.year
							);

							const findNearestLesson = (lessons: Learn[]): string | null => {
								if (!lessons || lessons.length === 0) {
									return null;
								}

								const currentTime = new Date();
								const currentHour = currentTime.getHours();
								const currentMinute = currentTime.getMinutes();
								const currentTotalMinutes = currentHour * 60 + currentMinute;

								const upcomingLessons = lessons.filter((lesson) => {
									if (!lesson.time) return false;

									const lessonTotalMinutes = lesson.time.hour * 60 + lesson.time.minute;
								});
							};

							const formatTime = (hour: number, minute: number): string => {
								const formattedHour = hour < 10 ? "0" + hour : hour;
								const formattedMinute = minute < 10 ? "0" + minute : minute;
								return `${formattedHour}:${formattedMinute}`;
							};

							const isCurrentDay = (): boolean => {
								return (
									currentDate.getDate() === day.day &&
									currentDate.getMonth() === day.month &&
									currentDate.getFullYear() === day.year
								);
							};

							const isCurrentOrFutureDay = (): boolean => {
								const currDay = currentDate.getDate();
								const currMonth = currentDate.getMonth();
								const currYear = currentDate.getFullYear();

								if (
									currYear < day.year ||
									(currYear === day.year && currMonth < day.month) ||
									(currYear === day.year && currMonth === day.month && currDay <= day.day)
								) {
									return true;
								}
								return false;
							};

							return (
								<m.div
									initial={{ opacity: 0, scale: 0.6, rotate: -35 }}
									animate={{ opacity: 1, scale: 1, rotate: 0 }}
									exit={{ opacity: 0, scale: 0.6, rotate: 35 }}
									transition={{ duration: 0.25, delay: index * 0.00675 }}
									key={`${month}-${day.day}-${index}`}
									className={`calendar-day${day.isActive ? " calendar-day_active" : " calendar-day_inactive"}${
										isLearningDay ? " calendar-day_learn" : ""
									}${isCurrentDay() ? " calendar-day_current" : ""}`}
									onDragLeave={(event: React.DragEvent<HTMLDivElement>) => dragLeaveHandler(event)}
									onDragOver={(event: React.DragEvent<HTMLDivElement>) => dragOverHandler(event)}
									onDrop={(event: React.DragEvent<HTMLDivElement>) => dragDropHandler(event, day)}
									onClick={() => handleOpenModal({ day: day.day, month: day.month, year: day.year })}
								>
									<div className="calendar-day__number">{day.day}</div>
									{isLearningDay && (
										<>
											{isCurrentOrFutureDay() && (
												<m.div {...transitions} className="calendar-day__time">
													{findNearestLesson(thisDayLessons) !== null
														? findNearestLesson(thisDayLessons)!.time !== null
															? `
													Занятие в ${formatTime(findNearestLesson(thisDayLessons)!.time!.hour, findNearestLesson(thisDayLessons)!.time!.minute)}
													`
															: "Занятие в НВ"
														: null}
												</m.div>
											)}
											<m.div {...transitions} className="calendar-day__students">
												{thisDayLessons.map((lesson, index) => (
													<div
														onDragStart={() => dragStartHandler(lesson)}
														draggable
														className="calendar-day__student"
														key={index}
														style={{ backgroundColor: lesson.student?.color }}
													/>
												))}
											</m.div>
										</>
									)}
								</m.div>
							);
						})}
					</AP>
				</main>
			</div>
			<LearnModal />
		</div>
	);
};

export default Calendar;
