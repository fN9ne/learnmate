import Block from "@/components/UI/Block";
import { months } from "@/datetime";
import { useActions } from "@/hooks/useActions";
import { useAppSelector } from "@/hooks/useAppSelector";
import { ILesson } from "@/redux/slices/lessons";
import { ChangeEvent, Dispatch, FC, SetStateAction, useEffect, useState } from "react";

import PlusIcon from "@icons/plusAlt.svg?react";
import CheckIcon from "@icons/checkmark.svg?react";
import TrashIcon from "@icons/trash.svg?react";
import CaretsIcon from "@icons/carets.svg?react";
import CaretIcon from "@icons/caret.svg?react";
import WindowIcon from "@icons/window.svg?react";

import Button, { ButtonTypes } from "@/components/UI/Button";
import classNames from "classnames";
import { AnimatePresence as AP, motion as m } from "framer-motion";
import Switch from "@/components/UI/Switch";
import { IStudent } from "@/redux/slices/students";
import { generateId } from "@/functions";
import { IPayment } from "@/redux/slices/payments";

const Redactor: FC = () => {
	/* title setter */

	const { pickedDay } = useAppSelector((state) => state.global);
	const { payments } = useAppSelector((state) => state.payments);
	const { setPickedDay, setIsDayPicked, setLessons, setPayments } = useActions();

	const [title, setTitle] = useState<string>("");

	useEffect(() => {
		const date = new Date(pickedDay);

		setTitle(pickedDay ? `${date.getDate()} ${months[date.getMonth()][0]}, ${date.getFullYear()}` : "17 Июнь, 2024");
	}, [pickedDay]);

	/* lessons */

	const { lessons } = useAppSelector((state) => state.lessons);
	const [thisDayLessons, setThisDayLessons] = useState<ILesson[]>([]);
	const [sessionLessons, setSessionLessons] = useState<ILesson[]>([]);
	const [lessonsWithoutStudentId, setLessonsWithoutStudentId] = useState<number[]>([]);

	const sortLessons = (lesson: ILesson): boolean => {
		const date = new Date(lesson.date);
		const pickedDate = new Date(pickedDay);
		return (
			date.getDate() === pickedDate.getDate() &&
			date.getMonth() === pickedDate.getMonth() &&
			date.getFullYear() === pickedDate.getFullYear()
		);
	};

	useEffect(() => {
		setThisDayLessons(lessons.filter(sortLessons));
	}, [lessons]);

	useEffect(() => {
		setSessionLessons(lessons.filter(sortLessons));
	}, []);

	/* other */

	const updateThisDayLesson = (id: number, data: Partial<ILesson>) => {
		setThisDayLessons((state) =>
			state.map((lesson) => {
				if (lesson.id === id) {
					return {
						...lesson,
						...data,
					};
				}

				return lesson;
			})
		);
	};

	const handleSave = (isClose: boolean = true): void => {
		const isEqual = (lesson1: ILesson, lesson2: ILesson) => {
			return (
				lesson1.studentId === lesson2.studentId &&
				lesson1.date === lesson2.date &&
				lesson1.hasTime === lesson2.hasTime &&
				JSON.stringify(lesson1.info) === JSON.stringify(lesson2.info) &&
				lesson1.isConstant === lesson2.isConstant &&
				lesson1.isTest === lesson2.isTest
			);
		};

		const createRecurringLessons = (lesson: ILesson) => {
			const startDate = new Date(lesson.date);
			const recurringLessons: ILesson[] = [];
			const endDate = new Date(startDate);

			let currentId = thisDayLessons.length > 0 ? generateId(thisDayLessons) : generateId(lessons);

			endDate.setFullYear(startDate.getFullYear() + 1);
			startDate.setDate(startDate.getDate() + 7);

			while (startDate <= endDate) {
				const newLesson: ILesson = {
					...lesson,
					id: currentId++,
					date: new Date(startDate).toString(),
					isConstant: "ready",
				};

				recurringLessons.push(newLesson);

				startDate.setDate(startDate.getDate() + 7);
			}

			return recurringLessons;
		};

		const newLessons = thisDayLessons.filter((lesson) => !sessionLessons.some((sessLesson) => sessLesson.id === lesson.id));

		const updatedLessons = thisDayLessons.filter((lesson) =>
			sessionLessons.some((sessLesson) => sessLesson.id === lesson.id && !isEqual(lesson, sessLesson))
		);

		const deletedLessons = sessionLessons.filter((sessLesson) => !thisDayLessons.some((lesson) => lesson.id === sessLesson.id));

		const lessonsWithInvalidStudentId = [...newLessons, ...updatedLessons].filter((lesson) => lesson.studentId === -1);

		if (lessonsWithInvalidStudentId.length > 0) {
			setLessonsWithoutStudentId(lessonsWithInvalidStudentId.map((lesson) => lesson.id));
			return;
		}

		let finalLessons = [...lessons];

		const filteredLessons = finalLessons.filter(
			(lesson) => !deletedLessons.some((deletedLesson) => deletedLesson.id === lesson.id)
		);

		const mergedLessons = filteredLessons.map((lesson) => {
			const updatedLesson = updatedLessons.find((updated) => updated.id === lesson.id);
			return updatedLesson ? updatedLesson : lesson;
		});

		finalLessons = [...mergedLessons, ...newLessons];

		const recurringLessonsToCreate: ILesson[] = [];
		const paymentsToCreate: IPayment[] = [];
		const paymentsToRemove: Set<number> = new Set();

		const paymentsMap = new Map<number, IPayment>();
		payments.forEach((payment) => paymentsMap.set(payment.lessonId, payment));

		const newPayments: IPayment[] = [];
		const updatedPayments: IPayment[] = [];

		updatedLessons.forEach((lesson) => {
			if (lesson.isConstant === false) {
				const lessonDate = new Date(lesson.date);

				const existingPayments = payments.filter((payment) => payment.lessonId === lesson.id);
				existingPayments.forEach((payment) => paymentsToRemove.add(payment.id));

				finalLessons = finalLessons.filter((finalLesson) => {
					const finalLessonDate = new Date(finalLesson.date);
					if (finalLesson.id === lesson.id || finalLessonDate <= lessonDate) {
						return true;
					} else {
						const lessonPayments = payments.filter((payment) => payment.lessonId === finalLesson.id);
						lessonPayments.forEach((payment) => paymentsToRemove.add(payment.id));
						return false;
					}
				});
			} else if (lesson.isConstant === true) {
				const recurringLessons = createRecurringLessons(lesson);
				let startId = generateId(payments);
				recurringLessons.forEach((recLesson) => {
					const newPayment: IPayment = {
						id: startId++,
						lessonId: recLesson.id,
						isPaid: false,
					};
					paymentsToCreate.push(newPayment);
				});
				recurringLessonsToCreate.push(...recurringLessons);
			}
		});

		finalLessons = [...finalLessons, ...recurringLessonsToCreate];

		newLessons.forEach((lesson) => {
			if (!lesson.isTest) {
				if (lesson.isConstant === true) {
					const recurringLessons = createRecurringLessons(lesson);
					finalLessons = [...finalLessons, ...recurringLessons];
					let startId = generateId(payments) + 1;
					recurringLessons.forEach((recLesson) => {
						const newPayment: IPayment = {
							id: startId++,
							lessonId: recLesson.id,
							isPaid: false,
						};
						paymentsToCreate.push(newPayment);
					});
				}
				const newPayment: IPayment = {
					id: generateId(payments),
					lessonId: lesson.id,
					isPaid: false,
				};
				newPayments.push(newPayment);
				paymentsToCreate.push(newPayment);
			}
		});

		// Handle deleted lessons
		deletedLessons.forEach((deletedLesson) => {
			const lessonPayments = payments.filter((payment) => payment.lessonId === deletedLesson.id);
			lessonPayments.forEach((payment) => paymentsToRemove.add(payment.id));
		});

		updatedLessons.forEach((lesson) => {
			const existingPayment = paymentsMap.get(lesson.id);
			if (existingPayment) {
				if (lesson.isTest) {
					paymentsToRemove.add(existingPayment.id);
				} else {
					const updatedPayment: IPayment = {
						...existingPayment,
						isPaid: existingPayment.isPaid,
					};
					updatedPayments.push(updatedPayment);
					paymentsMap.set(lesson.id, updatedPayment);
				}
			} else {
				if (!lesson.isTest) {
					const payment: IPayment = {
						id: generateId([...payments, ...newPayments]) + 1,
						lessonId: lesson.id,
						isPaid: false,
					};
					newPayments.push(payment);
					paymentsToCreate.push(payment);
				}
			}
		});

		const combinedPayments = new Map<number, IPayment>();

		payments.forEach((payment) => {
			if (!paymentsToRemove.has(payment.id)) {
				combinedPayments.set(payment.lessonId, payment);
			}
		});

		updatedPayments.forEach((payment) => combinedPayments.set(payment.lessonId, payment));
		newPayments.forEach((payment) => combinedPayments.set(payment.lessonId, payment));
		paymentsToCreate.forEach((payment) => combinedPayments.set(payment.lessonId, payment));

		setLessons(finalLessons);
		setPayments(Array.from(combinedPayments.values()));

		if (isClose) handleCancel();
	};

	const handleCancel = (): void => {
		setIsDayPicked(false);

		setTimeout(() => {
			setPickedDay("");
		}, 200);
	};

	const handleRemove = (id: number) => {
		setThisDayLessons((state) => state.filter((lesson) => lesson.id !== id));
	};

	const handleCreateLesson = () => {
		setThisDayLessons((prevState) => [
			...prevState,
			{
				id: thisDayLessons.length > 0 ? generateId(thisDayLessons) : generateId(lessons),
				studentId: -1,
				date: new Date(pickedDay).toString(),
				hasTime: false,
				info: {
					homework: "",
					note: "",
					stoppedAt: "",
					tasks: "",
				},
				isConstant: false,
				isTest: false,
			},
		]);
	};

	const redactorClassNames = classNames("redactor", { "redactor--minified": thisDayLessons.length === 0 });

	const transitions = {
		initial: { opacity: 0, y: -10 },
		animate: { opacity: 1, y: 0 },
		exit: { opacity: 0, y: -10 },
	};

	return (
		<div className={redactorClassNames}>
			<Block
				title={title}
				onBack={() => {
					handleCancel();
					handleSave(false);
				}}
				headerContent={
					thisDayLessons.length !== 0 && (
						<m.div {...transitions} className="redactor__buttons">
							<Button onClick={() => handleSave()} icon={<CheckIcon />}>
								Сохранить
							</Button>
							<Button onClick={handleCancel} type={ButtonTypes.secondary} icon={<PlusIcon />}>
								Отменить
							</Button>
						</m.div>
					)
				}
			>
				<div className="redactor__content">
					{thisDayLessons.length === 0 ? (
						<div className="redactor__empty">
							<div className="redactor__description text text--n">
								На данный момент здесь пусто как на японской территории во время праздника цветения сакуры! Нажмите кнопку ниже,
								чтобы добавить занятие.
							</div>
							<Button onClick={handleCreateLesson} icon={<PlusIcon />}>
								Создать занятие
							</Button>
						</div>
					) : (
						<div className="redactor__lessons">
							{thisDayLessons.map((lesson, index) => (
								<Lesson
									lessonsWithoutStudentId={lessonsWithoutStudentId}
									setLessonsWithoutStudentId={setLessonsWithoutStudentId}
									onUpdate={(data: Partial<ILesson>) => updateThisDayLesson(lesson.id, data)}
									onRemove={() => handleRemove(lesson.id)}
									{...lesson}
									key={index}
									index={index + 1}
								/>
							))}
							<div className="lesson lesson--new" onClick={handleCreateLesson}>
								<div className="lesson__create"></div>
							</div>
						</div>
					)}
				</div>
			</Block>
		</div>
	);
};

export default Redactor;

const Lesson: FC<
	ILesson & {
		index: number;
		onUpdate: (data: Partial<ILesson>) => void;
		onRemove: () => void;
		lessonsWithoutStudentId: number[];
		setLessonsWithoutStudentId: Dispatch<SetStateAction<number[]>>;
	}
> = ({
	date,
	hasTime,
	info,
	id,
	isConstant,
	isTest,
	studentId,
	index,
	onUpdate,
	onRemove,
	lessonsWithoutStudentId,
	setLessonsWithoutStudentId,
}) => {
	const textareaNames = {
		note: " Заметки",
		tasks: " Задачи на занятие",
		homework: " Домашнее задание",
		stoppedAt: " Остановились на",
	};

	const onTimeChange = (type: TimeInputType, value: string, transition?: string) => {
		if (transition) {
			onUpdate({ date: new Date(new Date(new Date(date).setMinutes(+value)).setHours(+transition)).toString() });
		} else {
			onUpdate(
				type === TimeInputType.Hours
					? { date: new Date(new Date(date).setHours(+value)).toString() }
					: { date: new Date(new Date(date).setMinutes(+value)).toString() }
			);
		}
	};

	return (
		<div className="lesson">
			<div className="lesson__header">
				<h3 className="lesson__title">Занятие {index}</h3>
				<button onClick={onRemove} className="lesson__remove">
					<TrashIcon />
				</button>
			</div>
			<div className="lesson__body">
				<div className="lesson__col">
					<div className="lesson__item">
						<Selectbox
							id={id}
							lessonsWithoutStudentId={lessonsWithoutStudentId}
							setLessonsWithoutStudentId={setLessonsWithoutStudentId}
							value={studentId}
							onSelect={(value: number) => onUpdate({ studentId: value })}
						/>
					</div>
					<div className="lesson__item">
						<Switch onClick={(value: boolean) => onUpdate({ hasTime: value })} isChecked={hasTime} />
						<div className={`lesson__time-container${hasTime ? " lesson__time-container--active" : ""}`}>
							<TimeInput
								type={TimeInputType.Hours}
								value={new Date(date).getHours().toString()}
								onChange={(value: string, transition?: string) => onTimeChange(TimeInputType.Hours, value, transition)}
							/>
							<TimeInput
								type={TimeInputType.Minutes}
								value={new Date(date).getMinutes().toString()}
								altValue={new Date(date).getHours().toString()}
								onChange={(value: string, transition?: string) => onTimeChange(TimeInputType.Minutes, value, transition)}
							/>
						</div>
					</div>
				</div>
				<div className="lesson__col">
					<div className="lesson__item">
						<Switch onClick={(value: boolean) => onUpdate({ isTest: value })} isChecked={isTest} text="Пробное занятие" />
					</div>
					<div className="lesson__item">
						<Switch
							onClick={(value: boolean) => onUpdate({ isConstant: value })}
							isChecked={[true, "ready"].includes(isConstant)}
							text="Сделать постоянным"
						/>
					</div>
				</div>
			</div>
			<div className="lesson__footer">
				{Object.keys(info).map((textarea, index) => (
					<textarea
						key={index}
						value={info[textarea as keyof typeof info]}
						placeholder={textareaNames[textarea as keyof typeof info]}
						onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
							onUpdate({ info: { ...info, [textarea as keyof typeof info]: event.target.value } })
						}
					></textarea>
				))}
			</div>
		</div>
	);
};

interface SelectboxProps {
	id: number;
	value: number;
	lessonsWithoutStudentId: number[];
	setLessonsWithoutStudentId: Dispatch<SetStateAction<number[]>>;
	onSelect: (value: number) => void;
}

const Selectbox: FC<SelectboxProps> = ({ id, value, onSelect, lessonsWithoutStudentId, setLessonsWithoutStudentId }) => {
	const { students } = useAppSelector((state) => state.students);

	const [dropdownActive, setDropdownActive] = useState<boolean>(false);

	const [student, setStudent] = useState<IStudent | undefined>(undefined);

	useEffect(() => {
		setStudent(students.find((student) => student.id === value));
	}, [value]);

	useEffect(() => {
		const closeDropdown = (event: MouseEvent) => {
			const element = event.target as Element;

			if (!(element.closest(".select__item") || element.closest(".select__main"))) setDropdownActive(false);
		};

		document.addEventListener("click", closeDropdown);

		return () => document.removeEventListener("click", closeDropdown);
	}, []);

	const transitions = {
		initial: { opacity: 0, scale: 0.95, y: 20 },
		animate: { opacity: 1, scale: 1, y: 0 },
		exit: { opacity: 0, scale: 0.95, y: 20 },
	};

	const selectClassNames = classNames(
		"select__main",
		{ "select__main--active": dropdownActive && !lessonsWithoutStudentId.includes(id) },
		{ "select__main--error": lessonsWithoutStudentId.includes(id) }
	);

	return (
		<div className="select">
			<button className={selectClassNames} onClick={() => setDropdownActive((state) => !state)}>
				{student === undefined ? (
					<div className="select__placeholder">Выберите ученика</div>
				) : (
					<div className="select__value">
						<div className="select__color" style={{ backgroundColor: student.color }} />
						<div className="select__name">
							{student.name}, {student.username}
						</div>
						<a
							title={`Открыть страницу ученика "${student.name}, ${student.username}"`}
							href={`http://localhost:5173/student/${student.id}`}
							onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => event.stopPropagation()}
							target="_blank"
							className="select__open-student"
						>
							<WindowIcon />
						</a>
					</div>
				)}
				<CaretIcon />
			</button>
			<AP mode="wait" initial={false}>
				{dropdownActive && (
					<m.ul {...transitions} className="select__body">
						<div className="select__body-wrapper">
							{students
								.filter((student) => student.isActive)
								.map((student, index) => (
									<li
										className="select__item"
										onClick={() => {
											onSelect(student.id);
											setDropdownActive(false);
											setLessonsWithoutStudentId((state) => state.filter((lessonId) => lessonId !== id));
										}}
										key={index}
									>
										<div className="select__color" style={{ backgroundColor: student.color }} />
										<div className="select__name">
											{student.name}, {student.username}
										</div>
									</li>
								))}
						</div>
					</m.ul>
				)}
			</AP>
		</div>
	);
};

enum TimeInputType {
	Hours = "hours",
	Minutes = "minutes",
}

interface TimeInputProps {
	value: string;
	altValue?: string;
	type: TimeInputType;
	onChange: (value: string, transition?: string) => void;
}

const TimeInput: FC<TimeInputProps> = ({ onChange, value, type, altValue }) => {
	const handleChange = (value: string) => {
		if (type === TimeInputType.Hours) {
			if (+value === 24) {
				onChange("0");
			} else if (+value === -1) {
				onChange("23");
			} else {
				onChange(value);
			}
		} else {
			if (+value === 60) {
				onChange("0", altValue ? (+altValue + 1).toString() : undefined);
			} else if (+value === -1) {
				onChange("59", altValue ? (+altValue - 1).toString() : undefined);
			} else {
				onChange(value);
			}
		}
	};

	return (
		<div className="time-input">
			<input
				type="number"
				max={60}
				min={-1}
				value={+value < 10 ? `0${value}` : value}
				onChange={(event: ChangeEvent<HTMLInputElement>) => handleChange(event.target.value)}
			/>
			<div className="time-input__label">{type === TimeInputType.Hours ? "Часов" : "Минут"}</div>
			<CaretsIcon />
		</div>
	);
};
