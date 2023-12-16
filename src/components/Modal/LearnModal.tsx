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
import { Payment } from "../../store/reducers/PaymentsSlice";

const LearnModal: FC = () => {
	const { isLearnModalActive } = useAppSelector((state) => state.modal);
	const { lessons, pickedDay } = useAppSelector((state) => state.lessons);
	const { students } = useAppSelector((state) => state.students);
	const { payments } = useAppSelector((state) => state.payments);
	const { updateLearnModalStatus, setPickedDay, setLessons, setStudents, setPayments } = useActions();

	const [thisDayLessons, setThisDayLessons] = useState<Learn[]>([]);
	const [thisDayPayments, setThisDayPayments] = useState<Payment[]>([]);

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

	useEffect(() => {
		if (payments.length > 0) {
			setThisDayPayments(
				payments.filter(
					(payment) =>
						payment.date.day === pickedDay?.day && payment.date.month === pickedDay?.month && payment.date.year === pickedDay.year
				)
			);
		}
	}, [payments, isLearnModalActive]);

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

		setThisDayPayments((prev) => [
			...prev,
			{
				hash,
				student: null,
				date: {
					day: pickedDay!.day,
					month: pickedDay!.month,
					year: pickedDay!.year,
					hour: 12,
					minute: 0,
				},
				status: false,
			},
		]);

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
		const newThisDayPayments = thisDayPayments.filter(
			(payment) => payment.hash !== thisDayLessons.filter((_, index) => index === indexToRemove)[0].hash
		);

		setThisDayLessons(newThisDayLessons);
		setThisDayPayments(newThisDayPayments);

		handleSave(newThisDayLessons, newThisDayPayments);
	};

	const handleSave = (thisDayLessons: Learn[], thisDayPayments: Payment[]) => {
		const notThisDayLessons = lessons.filter(
			(lesson) => lesson.day !== pickedDay?.day || lesson.month !== pickedDay?.month || lesson.year !== pickedDay?.year
		);

		const newLessons = [...notThisDayLessons, ...thisDayLessons].map((lesson) => {
			const studentLessons = [...notThisDayLessons, ...thisDayLessons].filter(
				(les) => les.student!.username === lesson.student!.username
			);

			return {
				...lesson,
				student: lesson.student
					? {
							...lesson.student,
							lessons_count: studentLessons.length,
							lessons_history: studentLessons.map((l) => l.hash),
					  }
					: null,
			};
		});

		const newStudents = students.map((student) => {
			const studentLessons = newLessons.filter((lesson) => lesson.student?.username === student.username);

			return {
				...student,
				lessons_count: studentLessons.length,
				lessons_history: studentLessons.map((lesson) => lesson.hash),
			};
		});

		const notThisDayPayments = payments.filter(
			(payment) =>
				payment.date.day !== pickedDay?.day || payment.date.month !== pickedDay?.month || payment.date.year !== pickedDay?.year
		);

		const newPayments = [...notThisDayPayments, ...thisDayPayments]
			.sort((a, b) => {
				const date1 = new Date(a.date.year, a.date.month, a.date.day);
				const date2 = new Date(b.date.year, b.date.month, b.date.day);

				if (date1 > date2) return -1;
				if (date1 < date2) return 1;

				return 0;
			})
			.map((payment) => {
				const studentLessons = [...notThisDayPayments, ...thisDayPayments].filter(
					(les) => les.student!.username === payment.student!.username
				);

				return {
					...payment,
					student: {
						...payment.student!,
						lessons_count: studentLessons.length,
						lessons_history: studentLessons.map((l) => l.hash),
					},
				};
			});

		setLessons(newLessons);
		setStudents(newStudents);
		setPayments(newPayments);
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

		if (Object.keys(newValues).includes("isTest")) {
			setThisDayPayments((prev) => {
				const newPayments = prev.map((payment) => {
					if (payment.hash === initial.hash) {
						return {
							...payment,
							status: newValues.isTest ? null : false,
						};
					}

					return payment;
				});

				return newPayments;
			});
		}

		if (Object.keys(newValues).includes("student")) {
			setThisDayPayments((prev) => {
				const newPayments = prev.map((payment) => {
					if (payment.hash === initial.hash) {
						return {
							...payment,
							student: newValues.student!,
						};
					}

					return payment;
				});

				return newPayments;
			});
		}
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
											handleSave(thisDayLessons, thisDayPayments);
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
