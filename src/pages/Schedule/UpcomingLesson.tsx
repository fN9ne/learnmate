import Block from "@/components/UI/Block";
import { FC, useEffect, useState } from "react";

import UpcomingIcon from "@icons/upcoming.svg?react";
import WindowIcon from "@icons/window.svg?react";
import { useAppSelector } from "@/hooks/useAppSelector";
import { months } from "@/datetime";
import { useActions } from "@/hooks/useActions";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "@/components/Loader";

const UpcomingLesson: FC = () => {
	const { lessons, isFetching: isLessonsFetching } = useAppSelector((state) => state.lessons);
	const { students, isFetching: isStudentsFetching } = useAppSelector((state) => state.students);
	const { settings, shouldHighlight } = useAppSelector((state) => state.global);
	const [currentDate, setCurrentDate] = useState<Date>(new Date());

	const { setPickedDay, setIsDayPicked, closeModal, setShouldHighlight } = useActions();

	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		const countdown = setInterval(() => setCurrentDate(new Date()), 1000);
		return () => clearInterval(countdown);
	}, []);

	const nextLesson = lessons.find((lesson) => new Date(lesson.date) > currentDate && lesson.hasTime);

	const formatDate = (date: Date) => `${date.getDate()} ${months[date.getMonth()][0]}`;
	const formatTime = (date: Date) =>
		`${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;

	const getCountdown = (date: Date) => {
		const diff = date.getTime() - currentDate.getTime();

		if (diff <= 0) return "Занятие уже началось";

		const timeUnits = [
			{ label: ["месяц", "месяца", "месяцев"], milliseconds: 1000 * 60 * 60 * 24 * 30 },
			{ label: ["неделя", "недели", "недель"], milliseconds: 1000 * 60 * 60 * 24 * 7 },
			{ label: ["день", "дня", "дней"], milliseconds: 1000 * 60 * 60 * 24 },
			{ label: ["час", "часа", "часов"], milliseconds: 1000 * 60 * 60 },
			{ label: ["минута", "минуты", "минут"], milliseconds: 1000 * 60 },
			{ label: ["секунда", "секунды", "секунд"], milliseconds: 1000 },
		];

		const formatUnit = (value: number, labels: string[]) => {
			if (value % 10 === 1 && value % 100 !== 11) return `${value} ${labels[0]}`;
			if ([2, 3, 4].includes(value % 10) && ![12, 13, 14].includes(value % 100)) return `${value} ${labels[1]}`;
			return `${value} ${labels[2]}`;
		};

		for (const { label, milliseconds } of timeUnits) {
			const value = Math.floor(diff / milliseconds);
			if (value > 0) {
				return formatUnit(value, label);
			}
		}

		return "Менее секунды";
	};

	const lessonDate = new Date(nextLesson ? nextLesson.date : "");

	useEffect(() => {
		setShouldHighlight(
			settings.highlightUpcomingLesson &&
				(lessonDate.getTime() - currentDate.getTime()) / 60000 <= settings.highlightUpcomingLessonTime
		);
	}, [currentDate]);

	if (isLessonsFetching || isStudentsFetching) {
		return (
			<Block small title="Ближайшее занятие" icon={<UpcomingIcon />}>
				<div className="upcoming-lesson">
					<Loader isFetching={isLessonsFetching || isStudentsFetching} className="upcoming-lesson__loader" />
				</div>
			</Block>
		);
	}

	if (!nextLesson) {
		return (
			<Block small title="Ближайшее занятие" icon={<UpcomingIcon />}>
				<div className="upcoming-lesson">
					<div className="upcoming-lesson__row">
						<div className="upcoming-lesson__label">
							<div className="text text--n">Ближайшего занятия нет, можете расслабиться и наслаждаться заслуженным отдыхом!</div>
						</div>
					</div>
				</div>
			</Block>
		);
	}

	const handleOpenLesson = (): void => {
		setIsDayPicked(false);
		closeModal("upcomingLesson");

		let timeout = 200;

		if (location.pathname !== "/schedule") {
			timeout = 310;
			navigate("/schedule");
		}

		setTimeout(() => {
			setIsDayPicked(true);
			setPickedDay(`${lessonDate.getFullYear()}-${lessonDate.getMonth() + 1}-${lessonDate.getDate()}`);
		}, timeout);
	};

	return (
		<Block small title="Ближайшее занятие" icon={<UpcomingIcon />} className={`${shouldHighlight ? "_highlighted" : ""}`}>
			<div className="upcoming-lesson">
				<div className="upcoming-lesson__row upcoming-lesson__row--delimiter">
					<div className="upcoming-lesson__date">{formatDate(lessonDate)}</div>
					<div className="upcoming-lesson__time">{formatTime(lessonDate)}</div>
				</div>
				<div className="upcoming-lesson__row">
					<div className="upcoming-lesson__label">До занятия:</div>
					<div className="upcoming-lesson__countdown">{getCountdown(lessonDate)}</div>
				</div>
				<div className="upcoming-lesson__row">
					<div className="upcoming-lesson__label">Ученик:</div>
					<div className="upcoming-lesson-student">
						<div
							className="upcoming-lesson-student__color"
							style={{ backgroundColor: students[nextLesson.studentId].color }}
						></div>
						<div className="upcoming-lesson-student__name">
							{students[nextLesson.studentId].name}, {students[nextLesson.studentId].username}
						</div>
					</div>
				</div>
				<button className="link" onClick={handleOpenLesson}>
					<WindowIcon />
					<span>Открыть занятие</span>
				</button>
			</div>
		</Block>
	);
};

export default UpcomingLesson;
