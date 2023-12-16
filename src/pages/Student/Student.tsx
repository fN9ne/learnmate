import { useNavigate, useParams } from "react-router-dom";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import "./Student.scss";

import { FC, useEffect, useState } from "react";
import { Student as IStudent, IStudentBook } from "../../store/reducers/StudentsSlice";
import { useAppSelector } from "../../hooks/useAppSelector";

import { AnimatePresence as AP, motion as m } from "framer-motion";
import Description from "../../components/Description";
import Button, { ButtonTypes } from "../../components/Button";

import Arrow from "../../icons/arrow_long.svg?react";
import EditIcon from "../../icons/edit.svg?react";
import { months, weekdays } from "../../dates/dates";
import { Learn } from "../../store/reducers/LessonsSlice";
import HistoryLessonModal from "../../components/Modal/HistoryLessonModal";
import { useActions } from "../../hooks/useActions";
import EditStudentModal from "../../components/Modal/EditStudentModal";
import supabase from "../../services/createClient";
import Checkmark from "../../icons/checkmark.svg?react";
import ArrowDown from "../../icons/arrow_down.svg?react";
import BookIcon from "../../icons/book.svg?react";
import NewExtraBookModal from "../../components/Modal/NewExtraBookModal";
import TrashIcon from "../../icons/trash.svg?react";
import Plus from "../../icons/plus.svg?react";

const Student: FC = () => {
	const params = useParams();

	useDocumentTitle(`${params.username}`);

	const {
		updateHistoryLessonModalStatus,
		updateEditStudentModalStatus,
		updateNewExtraBookModalStatus,
		setStudents,
		setLessons,
		setPayments,
	} = useActions();

	const { students, isLoaded } = useAppSelector((state) => state.students);
	const { email } = useAppSelector((state) => state.user);
	const { lessons } = useAppSelector((state) => state.lessons);
	const { payments } = useAppSelector((state) => state.payments);

	const [isStudentLoaded, setIsStudentLoaded] = useState<boolean>(false);
	const [student, setStudent] = useState<IStudent | null>(null);
	const [history, setHistory] = useState<Learn[] | null>(null);

	const [lessonToModal, setLessonToModal] = useState<Learn | null>(null);

	const navigate = useNavigate();

	const [extraLP, setExtraLP] = useState<IStudentBook[] | null>(null);

	useEffect(() => {
		if (email && isLoaded) {
			const currentStudent = students.filter((student) => student.username === params.username);

			setStudent(currentStudent.length > 0 ? currentStudent[0] : null);

			const studentHistory = currentStudent[0].lessons_history
				.map((lesson) => {
					return lessons.filter((les) => les.hash === lesson)[0];
				})
				.sort((a, b) => {
					const dateA = new Date(a.year, a.month, a.day, a.time.hour, a.time.minute);
					const dateB = new Date(b.year, b.month, b.day, b.time.hour, b.time.minute);
					return dateB.getTime() - dateA.getTime();
				});

			setHistory(studentHistory);
			setExtraLP(currentStudent.length > 0 ? currentStudent[0].extra_lp : null);
			setIsStudentLoaded(true);

			const updateStudents = async () => {
				await supabase.from("students").update({ students: students }).eq("author_email", email);
				await supabase.from("schedules").update({ schedule: lessons }).eq("author_email", email);
				await supabase.from("payments").update({ payments: payments }).eq("author_email", email);
			};

			updateStudents();
		}
	}, [email, isLoaded, students, lessons, payments]);

	useEffect(() => {
		setExtraLP(student ? student.extra_lp : null);
	}, [student]);

	const calcClosestLesson = student?.lessons_history
		.map((hash) => {
			const currentLesson = lessons.filter((lesson) => lesson.hash === hash)[0];
			const date = new Date(
				currentLesson.year,
				currentLesson.month,
				currentLesson.day,
				currentLesson.time.hour,
				currentLesson.time.minute
			);
			const currentDate = new Date();

			if (currentDate <= date) {
				return date;
			}

			return null;
		})
		.filter(Boolean)
		.sort((a, b) => a!.getTime() - b!.getTime());

	const transitions = {
		initial: { opacity: 0, scale: 0.95 },
		animate: { opacity: 1, scale: 1 },
		exit: { opacity: 0, scale: 0.95 },
	};

	const hexToRgb = (hex: string) => {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

		return result
			? {
					r: parseInt(result[1], 16),
					g: parseInt(result[2], 16),
					b: parseInt(result[3], 16),
			  }
			: null;
	};

	const [isEditMode, setIsEditMode] = useState<boolean>(false);

	const handleSave = () => {
		const newStudents = students.map((stud) => {
			if (stud.username === student?.username) {
				return student;
			}

			return stud;
		});
		const newLessons = lessons.map((lesson) => {
			if (lesson.student?.username === student?.username) {
				return {
					...lesson,
					student: student,
				};
			}

			return lesson;
		});
		const newPayments = payments.map((payment) => {
			if (payment.student?.username === student?.username) {
				return {
					...payment,
					student: student,
				};
			}

			return payment;
		});

		setStudents(newStudents);
		setLessons(newLessons);
		setPayments(newPayments);

		setIsEditMode(false);
	};
	const handleCancel = () => {
		setIsEditMode(false);
		setStudent(students.filter((stud) => stud.username === student?.username)[0]);
	};

	return (
		<div className="student">
			<AP mode="wait" initial={false}>
				{isStudentLoaded ? (
					<m.div key="content" {...transitions} className="student__content">
						{student !== null ? (
							<>
								<div className="student__main">
									<div className="student-info">
										<div
											className="student-info__bg"
											style={{
												backgroundColor: `rgba(${hexToRgb(student.color)?.r}, ${hexToRgb(student.color)?.g}, ${
													hexToRgb(student.color)?.b
												}, 0.5)`,
											}}
										>
											<div className="student-info-avatar" style={{ backgroundColor: student.color }}>
												{student.name.slice(0, 1)}
											</div>
											<div className="student-info__bio">
												<div className="student-info__username">@{student.username}</div>
												<div className="student-info__name">{student.name}</div>
											</div>
											<div className="student-info__edit" onClick={() => updateEditStudentModalStatus(true)}>
												<EditIcon />
												<span>Редактировать ученика</span>
											</div>
										</div>
										<div className="student-info__main">
											<div className="student-info-props">
												<div className="student-info-props__item">
													<div className="student-info-props__label">Discord</div>
													<div className="student-info-props__value">
														{student.discord_username ? student.discord_username : "Нет"}
													</div>
												</div>
												<div className="student-info-props__item">
													<div className="student-info-props__label">Уроков</div>
													<div className="student-info-props__value">{student.lessons_count}</div>
												</div>
												<div className="student-info-props__item">
													<div className="student-info-props__label">Оплата</div>
													<div className="student-info-props__value">{student.payment} ₽</div>
												</div>
												<div className="student-info-props__item">
													<div className="student-info-props__label">Близжайшее занятие</div>
													<div className="student-info-props__value">
														{calcClosestLesson !== undefined && calcClosestLesson.length > 0
															? `${calcClosestLesson[0]!.getDate()} ${months[calcClosestLesson[0]!.getMonth()][1]}, ${
																	weekdays[(calcClosestLesson[0]!.getDay() + 6) % 7]
															  }, ${
																	calcClosestLesson[0]!.getHours() < 10
																		? "0" + calcClosestLesson[0]!.getHours()
																		: calcClosestLesson[0]!.getHours()
															  }:${
																	calcClosestLesson[0]!.getMinutes() < 10
																		? "0" + calcClosestLesson[0]!.getMinutes()
																		: calcClosestLesson[0]!.getMinutes()
															  }`
															: "Нет"}
													</div>
												</div>
											</div>
											<div className="student-info__note">
												<div className="student-info-props__label">Заметки</div>
												<div className="student-info-props__value">
													{student.note ? student.note : "Об ученике пока-что нет никаких записей"}
												</div>
											</div>
										</div>
									</div>
									<div className="student-lp">
										<div className="student-lp__header">
											<h3>Учебный план</h3>
										</div>
										<div className="student-lp__body">
											{student.learning_plan.map((book, index) => (
												<StudentBook student={student} key={index} book={book} />
											))}
										</div>
									</div>
									<div className="student-lp student-lp__extra">
										<div className="student-lp__header">
											<h3>Дополнительные книги</h3>
											<div className="student-lp-edit">
												{!isEditMode ? (
													<div onClick={() => setIsEditMode(true)} className="student-lp-edit__button">
														<EditIcon />
														<span>Редактировать</span>
													</div>
												) : (
													<>
														<div onClick={handleSave} className="student-lp-edit__save">
															Сохранить
														</div>
														<div onClick={handleCancel} className="student-lp-edit__cancel">
															Отмена
														</div>
													</>
												)}
											</div>
										</div>
										<div className="student-lp__body">
											{extraLP && extraLP.length > 0 ? (
												<>
													{extraLP.map((book, index) => (
														<StudentBook
															isEditMode={isEditMode}
															isExtra
															student={student}
															setStudent={(student: IStudent) => setStudent(student)}
															key={index}
															book={book}
														/>
													))}
													<Button
														onClick={() => updateNewExtraBookModalStatus(true)}
														text="Добавить книгу"
														icon={{ element: <BookIcon /> }}
													/>
												</>
											) : (
												<div className="student-lp-empty">
													<Description>У этого ученика пока что нет дополнительных книг, желаете добавить?</Description>
													<Button
														onClick={() => updateNewExtraBookModalStatus(true)}
														text="Добавить книгу"
														icon={{ element: <BookIcon /> }}
													/>
												</div>
											)}
										</div>
									</div>
								</div>
								<div className="student-history">
									<div className="student-history__header">
										<h3>История занятий</h3>
									</div>
									<div className="student-history__body">
										<div className="student-history__track">
											{history?.map((hi, index) => (
												<div
													className="student-history-item"
													key={index}
													onClick={() => {
														setLessonToModal(hi);
														updateHistoryLessonModalStatus(true);
													}}
												>
													{`${hi.day} ${months[hi.month][1]}, ${
														weekdays[(new Date(hi.year, hi.month, hi.day).getDay() + 6) % 7]
													}, ${hi.time.hour < 10 ? "0" + hi.time.hour : hi.time.hour}:${
														hi.time.minute < 10 ? "0" + hi.time.minute : hi.time.minute
													}`}
												</div>
											))}
										</div>
									</div>
								</div>
							</>
						) : (
							<div className="student-notfound">
								<Description>К сожалению пользователь с ником «{params.username}» не найден.</Description>
								<Button
									onClick={() => navigate("/app/students")}
									text="Вернуться к ученикам"
									icon={{ element: <Arrow /> }}
									type={ButtonTypes.primary}
								/>
							</div>
						)}
					</m.div>
				) : (
					<m.div key="loader" {...transitions} className="student__loader loader">
						<span></span>
					</m.div>
				)}
			</AP>
			<HistoryLessonModal lesson={lessonToModal} />
			<EditStudentModal student={student} />
			<NewExtraBookModal student={student} />
		</div>
	);
};

export default Student;

interface StudentBookInterface {
	book: IStudentBook;
	student: IStudent;
	setStudent?: (student: IStudent) => void;
	isExtra?: boolean;
	isEditMode?: boolean;
}

const StudentBook: FC<StudentBookInterface> = ({ setStudent, isEditMode, student, book, isExtra = false }) => {
	const transitions = {
		initial: { opacity: 0, scale: 0.95 },
		animate: { opacity: 1, scale: 1 },
		exit: { opacity: 0, scale: 0.95 },
	};

	const { setStudents, setLessons, setPayments } = useActions();
	const { students } = useAppSelector((state) => state.students);
	const { payments } = useAppSelector((state) => state.payments);
	const { lessons } = useAppSelector((state) => state.lessons);

	const [isActive, setIsActive] = useState<boolean>(false);

	const handleCheckLesson = (num: number) => {
		setStudents(
			students.map((stud) => {
				if (stud.username === student.username) {
					if (isExtra) {
						return {
							...student,
							extra_lp: student.extra_lp.map((studentBook) => {
								if (studentBook.name === book.name) {
									const updatedLessons = studentBook.lessons.map((lesson) => {
										if (lesson.num === num) {
											return {
												...lesson,
												finished: !lesson.finished,
											};
										}

										return lesson;
									});

									const allLessonsFinished = updatedLessons.every((lesson) => lesson.finished);

									return {
										...studentBook,
										lessons: updatedLessons,
										finished: allLessonsFinished,
									};
								}

								return studentBook;
							}),
						};
					} else {
						return {
							...student,
							learning_plan: student.learning_plan.map((studentBook) => {
								if (studentBook.name === book.name) {
									const updatedLessons = studentBook.lessons.map((lesson) => {
										if (lesson.num === num) {
											return {
												...lesson,
												finished: !lesson.finished,
											};
										}

										return lesson;
									});

									const allLessonsFinished = updatedLessons.every((lesson) => lesson.finished);

									return {
										...studentBook,
										lessons: updatedLessons,
										finished: allLessonsFinished,
									};
								}

								return studentBook;
							}),
						};
					}
				}

				return stud;
			})
		);
		setLessons(
			lessons.map((lesson) => {
				if (lesson.student?.username === student.username) {
					if (isExtra) {
						return {
							...lesson,
							student: {
								...lesson.student,
								extra_lp: student.extra_lp.map((studentBook) => {
									if (studentBook.name === book.name) {
										const updatedLessons = studentBook.lessons.map((lesson) => {
											if (lesson.num === num) {
												return {
													...lesson,
													finished: !lesson.finished,
												};
											}

											return lesson;
										});

										const allLessonsFinished = updatedLessons.every((lesson) => lesson.finished);

										return {
											...studentBook,
											lessons: updatedLessons,
											finished: allLessonsFinished,
										};
									}

									return studentBook;
								}),
							},
						};
					} else {
						return {
							...lesson,
							student: {
								...lesson.student,
								learning_plan: student.learning_plan.map((studentBook) => {
									if (studentBook.name === book.name) {
										const updatedLessons = studentBook.lessons.map((lesson) => {
											if (lesson.num === num) {
												return {
													...lesson,
													finished: !lesson.finished,
												};
											}

											return lesson;
										});

										const allLessonsFinished = updatedLessons.every((lesson) => lesson.finished);

										return {
											...studentBook,
											lessons: updatedLessons,
											finished: allLessonsFinished,
										};
									}

									return studentBook;
								}),
							},
						};
					}
				}

				return lesson;
			})
		);
		setPayments(
			payments.map((payment) => {
				if (payment.student?.username === student.username) {
					if (isExtra) {
						return {
							...payment,
							student: {
								...payment.student,
								extra_lp: student.extra_lp.map((studentBook) => {
									if (studentBook.name === book.name) {
										const updatedLessons = studentBook.lessons.map((lesson) => {
											if (lesson.num === num) {
												return {
													...lesson,
													finished: !lesson.finished,
												};
											}

											return lesson;
										});

										const allLessonsFinished = updatedLessons.every((lesson) => lesson.finished);

										return {
											...studentBook,
											lessons: updatedLessons,
											finished: allLessonsFinished,
										};
									}

									return studentBook;
								}),
							},
						};
					} else {
						return {
							...payment,
							student: {
								...payment.student,
								learning_plan: student.learning_plan.map((studentBook) => {
									if (studentBook.name === book.name) {
										const updatedLessons = studentBook.lessons.map((lesson) => {
											if (lesson.num === num) {
												return {
													...lesson,
													finished: !lesson.finished,
												};
											}

											return lesson;
										});

										const allLessonsFinished = updatedLessons.every((lesson) => lesson.finished);

										return {
											...studentBook,
											lessons: updatedLessons,
											finished: allLessonsFinished,
										};
									}

									return studentBook;
								}),
							},
						};
					}
				}

				return payment;
			})
		);
	};

	const removeBook = () => {
		if (setStudent) {
			setStudent({
				...student,
				extra_lp: student.extra_lp.filter((sbook) => sbook.name !== book.name),
			});
		}
	};

	const handleNewLesson = () => {
		if (setStudent) {
			setStudent({
				...student,
				extra_lp: student.extra_lp.map((sbook) => {
					if (sbook.name === book.name) {
						return {
							...sbook,
							lessons: [
								...sbook.lessons,
								{
									num: sbook.lessons.length + 1,
									finished: false,
								},
							],
						};
					}

					return sbook;
				}),
			});
		}
	};

	const handleRemoveLesson = () => {
		if (setStudent) {
			setStudent({
				...student,
				extra_lp: student.extra_lp.map((sbook) => {
					if (sbook.name === book.name) {
						return {
							...sbook,
							lessons: sbook.lessons.filter((_, i) => i !== sbook.lessons.length - 1),
						};
					}

					return sbook;
				}),
			});
		}
	};

	return (
		<div className={`student-book${isEditMode ? " student-book_edit" : ""}`}>
			<div className="student-book__header" onClick={() => setIsActive((prev) => !prev)}>
				<AP mode="wait" initial={false}>
					{isEditMode && (
						<div onClick={removeBook} className="student-book__remove">
							<TrashIcon />
						</div>
					)}
					{book.finished && !isEditMode && (
						<m.div {...transitions} key="1234">
							<Checkmark className="student-book-checkmark" />
						</m.div>
					)}
				</AP>
				<div className="student-book__name">{book.name}</div>
				<ArrowDown className={`student-book__arrow${isActive ? " student-book__arrow_rotate" : ""}`} />
			</div>
			<AP mode="wait" initial={false}>
				{isActive && (
					<m.div {...transitions} className="student-book__body">
						<>
							{book.lessons.map((lesson, index) => (
								<div
									onClick={() => {
										if (!isEditMode) {
											handleCheckLesson(lesson.num);
										} else {
											handleRemoveLesson();
										}
									}}
									className="student-book__lesson"
									key={index}
								>
									<AP mode="wait" initial={false}>
										{isEditMode && <TrashIcon />}
										{lesson.finished && !isEditMode && (
											<m.div {...transitions}>
												<Checkmark />
											</m.div>
										)}
									</AP>
									<span>Урок {lesson.num}</span>
								</div>
							))}
							{isEditMode && <Button text="Добавить урок" icon={{ element: <Plus /> }} onClick={handleNewLesson} />}
						</>
					</m.div>
				)}
			</AP>
		</div>
	);
};
