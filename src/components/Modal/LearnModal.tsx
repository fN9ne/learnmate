import { FC, useEffect, useLayoutEffect, useRef, useState } from "react";
import ModalLayout from "./ModalLayout";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useActions } from "../../hooks/useActions";
import { months, weekdays } from "../../dates/dates";
import Description from "../Description";
import Button, { ButtonTypes } from "../Button";

import WriteIcon from "../../icons/write.svg?react";
import { Learn, LearnChange } from "../../store/reducers/LessonsSlice";
import Lesson from "./Lesson";
import { AnimatePresence as AP, motion as m } from "framer-motion";

const LearnModal: FC = () => {
	const { isLearnModalActive } = useAppSelector((state) => state.modal);
	const { lessons, pickedDay } = useAppSelector((state) => state.lessons);
	const { students } = useAppSelector((state) => state.students);
	const { updateLearnModalStatus, setPickedDay, setLessons, setStudents } = useActions();

	const [thisDayLessons, setThisDayLessons] = useState<Learn[]>([]);

	const [lessonAdded, setLessonAdded] = useState<boolean>(false);
	const [lastChildHash, setLastChildHash] = useState<string>("");

	const sortByTime = (a: Learn, b: Learn) => {
		const timeA = a.time.hour * 60 + a.time.minute;
		const timeB = b.time.hour * 60 + b.time.minute;
		return timeA - timeB;
	};

	useEffect(() => {
		if (lessons.length > 0) {
			setThisDayLessons(
				lessons.filter(
					(lesson) => lesson.day === pickedDay?.day && lesson.month === pickedDay?.month && lesson.year === pickedDay.year
				)
			);
		}
	}, [lessons, isLearnModalActive]);

	// useEffect(() => console.log(thisDayLessons), [thisDayLessons]);

	const generateHash = () => {
		const ascii = "abcdefghijklmnopqrstuvwxyz0123456789";
		return Array.from({ length: 16 }, () => ascii[Math.floor(Math.random() * ascii.length)]).join("");
	};

	const handleAddLesson = () => {
		const hash = generateHash();

		setThisDayLessons((prev) =>
			[
				...prev,
				{
					hash: hash,
					student: null,
					day: pickedDay!.day,
					month: pickedDay!.month,
					year: pickedDay!.year,
					time: {
						hour: 12,
						minute: 0,
					},
					isTest: false,
					homework: "",
					plan: "",
					note: "",
					stoppedAt: "",
				},
			].sort(sortByTime)
		);

		setLastChildHash(hash);

		setLessonAdded(true);
	};

	useLayoutEffect(() => {
		if (lessonAdded && lastChildHash !== "") {
			const trackElement = track.current as Element;
			const childrenArray = Array.from(trackElement?.children || []);
			const newLessonElement = childrenArray.find((child) => child.id === lastChildHash) as Element;

			if (newLessonElement) {
				newLessonElement.scrollIntoView({ behavior: "smooth" });
			}

			setLessonAdded(false);
		}
	}, [thisDayLessons]);

	const handleRemoveLesson = (indexToRemove: number) => {
		const newThisDayLessons = thisDayLessons.filter((_, index) => index !== indexToRemove).sort(sortByTime);

		setThisDayLessons(newThisDayLessons);

		handleSave(newThisDayLessons);
	};

	const handleSave = (thisDayLessons: Learn[]) => {
		const notThisDayLessons = lessons.filter(
			(lesson) => lesson.day !== pickedDay?.day || lesson.month !== pickedDay?.month || lesson.year !== pickedDay?.year
		);

		const newLessons = [...notThisDayLessons, ...thisDayLessons];
		const newStudents = students.map((student) => {
			const studentLessons = newLessons.filter((lesson) => lesson.student?.username === student.username);

			console.log(studentLessons);

			return {
				...student,
				lessons_count: studentLessons.length,
				lessons_history: studentLessons.map((lesson) => ({
					day: lesson.day,
					month: lesson.month,
					weekday: (new Date(lesson.year, lesson.month, lesson.day).getDay() + 6) % 7,
				})),
			};
		});

		setLessons(newLessons);
		setStudents(newStudents);
	};

	const handleClose = () => {
		updateLearnModalStatus(false);
		setPickedDay(null);
		setThisDayLessons(
			lessons
				.filter((lesson) => lesson.day === pickedDay?.day && lesson.month === pickedDay?.month && lesson.year === pickedDay.year)
				.sort(sortByTime)
		);
	};

	const changeLesson = (initial: Learn, indexToChange: number, newValues: LearnChange) => {
		let newLesson = {
			...initial,
			...newValues,
		};

		setThisDayLessons((prev) => {
			const newLessons = prev.map((lesson, index) => {
				if (index === indexToChange) {
					return newLesson;
				}

				return lesson;
			});

			return newLessons;
		});
	};

	const transitions = {
		initial: { opacity: 0, scale: 0.95 },
		animate: { opacity: 1, scale: 1 },
		exit: { opacity: 0, scale: 0.95 },
	};

	const track = useRef<HTMLDivElement | null>(null);

	return (
		<ModalLayout isActive={isLearnModalActive} onClose={handleClose} className="learn-modal">
			<div className="learn-modal__header">
				<div>
					<h2>
						{pickedDay
							? `${pickedDay.day} ${months[pickedDay.month][1]}, ${
									weekdays[(new Date(pickedDay.year, pickedDay.month, pickedDay.day).getDay() + 6) % 7]
							  }`
							: ""}
					</h2>
					<AP>
						{thisDayLessons.length > 0 && (
							<m.div {...transitions}>
								<Button
									text="Добавить занятие"
									icon={{ element: <WriteIcon /> }}
									onClick={() => {
										handleAddLesson();
									}}
								/>
							</m.div>
						)}
					</AP>
				</div>
				<AP>
					{thisDayLessons.length > 0 && (
						<m.div {...transitions}>
							<Description>Не забывайте нажимать на кнопку «Сохранить».</Description>
						</m.div>
					)}
				</AP>
			</div>
			<div className="learn-modal__body">
				<AP mode="wait" initial={false}>
					{thisDayLessons.length > 0 && (
						<>
							<m.div {...transitions} key={1} className="learn-modal__content" ref={track}>
								{thisDayLessons.map((lesson, index) => (
									<Lesson
										data={lesson}
										key={index}
										num={index + 1}
										onRemove={() => handleRemoveLesson(index)}
										changeLesson={(newValues) => changeLesson(lesson, index, newValues)}
									/>
								))}
							</m.div>
							<m.div {...transitions} key={2} className="learn-modal__footer">
								<>
									<Button
										text="Сохранить"
										type={ButtonTypes.primary}
										onClick={() => {
											handleSave(thisDayLessons);
											handleClose();
										}}
									/>
									<Button text="Отменить" onClick={handleClose} />
								</>
							</m.div>
						</>
					)}
					{thisDayLessons.length === 0 && (
						<m.div {...transitions} key={4} className="learn-modal__empty">
							<>
								<Description>{"На этот день пока что не назначено никакое занятие, добавить его?"}</Description>
								<Button text="Добавить занятие" icon={{ element: <WriteIcon /> }} onClick={handleAddLesson} />
							</>
						</m.div>
					)}
				</AP>
			</div>
		</ModalLayout>
	);
};

export default LearnModal;
