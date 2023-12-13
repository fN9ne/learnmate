import { FC, useEffect, useState } from "react";
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
	const { updateLearnModalStatus, setPickedDay, setLessons } = useActions();
	const { lessons, pickedDay } = useAppSelector((state) => state.lessons);

	const [thisDayLessons, setThisDayLessons] = useState<Learn[]>([]);

	const sortByTime = (a: Learn, b: Learn) => {
		const timeA = a.time.hour * 60 + a.time.minute;
		const timeB = b.time.hour * 60 + b.time.minute;
		return timeA - timeB;
	};

	useEffect(() => {
		if (lessons.length > 0) {
			setThisDayLessons(
				lessons
					.filter(
						(lesson) => lesson.day === pickedDay?.day && lesson.month === pickedDay?.month && lesson.year === pickedDay.year
					)
					.sort(sortByTime)
			);
		}
	}, [lessons, isLearnModalActive]);

	// useEffect(() => console.log(thisDayLessons), [thisDayLessons]);

	const handleAddLesson = () => {
		setThisDayLessons((prev) =>
			[
				...prev,
				{
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
	};
	const handleRemoveLesson = (indexToRemove: number) => {
		const newThisDayLessons = thisDayLessons.filter((_, index) => index !== indexToRemove).sort(sortByTime);

		setThisDayLessons(newThisDayLessons);

		handleSave(newThisDayLessons);
	};

	const handleSave = (thisDayLessons: Learn[]) => {
		const notThisDayLessons = lessons.filter(
			(lesson) => lesson.day !== pickedDay?.day || lesson.month !== pickedDay?.month || lesson.year !== pickedDay?.year
		);

		setLessons([...notThisDayLessons, ...thisDayLessons]);
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

	return (
		<ModalLayout isActive={isLearnModalActive} onClose={handleClose} className="learn-modal">
			<div className="learn-modal__header">
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
							<Button text="Добавить занятие" icon={{ element: <WriteIcon /> }} onClick={handleAddLesson} />
						</m.div>
					)}
				</AP>
			</div>
			<div className="learn-modal__body">
				<AP mode="wait" initial={false}>
					{thisDayLessons.length > 0 && (
						<>
							<m.div {...transitions} key={1} className="learn-modal__content">
								{thisDayLessons.map((lesson, index) => (
									<Lesson
										isLast={index + 1 === thisDayLessons.length && thisDayLessons.length !== 1}
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
