import "./LearningPlan.scss";

import useDocumentTitle from "../../hooks/useDocumentTitle";

import { FC, useEffect, useState } from "react";

import EditIcon from "../../icons/edit.svg?react";
import BookIcon from "../../icons/book.svg?react";

import { AnimatePresence as AP, motion as m } from "framer-motion";
import { useAppSelector } from "../../hooks/useAppSelector";
import Description from "../../components/Description";
import Button from "../../components/Button";
import supabase from "../../services/createClient";
import { IBook, IPresentation } from "../../store/reducers/LearningPlanSlice";
import Book from "./Book";
import NewBookModal from "../../components/Modal/NewBookModal";
import { useActions } from "../../hooks/useActions";
import { Student } from "../../store/reducers/StudentsSlice";
import TrashIcon from "../../icons/trash.svg?react";

const LearningPlan: FC = () => {
	useDocumentTitle("Учебный план");

	const [isEditMode, setIsEditMode] = useState<boolean>(false);

	const { books, isLoaded, presentations } = useAppSelector((state) => state.learningPlan);
	const { email } = useAppSelector((state) => state.user);
	const { students } = useAppSelector((state) => state.students);
	const { lessons } = useAppSelector((state) => state.lessons);
	const { payments } = useAppSelector((state) => state.payments);

	const [newBooks, setNewBooks] = useState<IBook[]>([]);
	const [newPresentations, setNewPresentations] = useState<IPresentation[]>([]);

	const { updateNewBookModalStatus, setBooks, setLessons, setPayments, setStudents, setPresentations } = useActions();

	useEffect(() => {
		if (books.length > 0) {
			setNewBooks(books);
		}
	}, [books]);

	useEffect(() => {
		if (presentations.length > 0) {
			setNewPresentations(presentations);
		}
	}, [presentations]);

	const handleSave = () => {
		setIsEditMode(false);
		setBooks(newBooks);
		setPresentations(newPresentations);

		const newStudents = students.map((student) => {
			return {
				...student,
				learning_plan: student.learning_plan
					.map((book) => {
						const newBook = newBooks.find((newBook) => newBook.name === book.name);

						if (newBook) {
							const removedLessons = book.lessons.filter((lessonNum) => !newBook.lessons.includes(lessonNum.num));

							const updatedBookLessons = book.lessons.filter(
								(lessonNum) => !removedLessons.some((removedLesson) => removedLesson === lessonNum)
							);

							const addedBookLessons = newBook.lessons.filter(
								(lessonNum) => !updatedBookLessons.some((lesson) => lesson.num === lessonNum)
							);

							return {
								...book,
								lessons: [
									...updatedBookLessons,
									...addedBookLessons.map((lessonNum) => ({
										num: lessonNum,
										finished: false,
									})),
								],
							};
						}

						return null;
					})
					.filter((book) => book !== null) as Student["learning_plan"],
				presentations: student.presentations
					.map((presentation) => {
						const newPresentation = newPresentations.find((newp) => newp.name === presentation.name);

						if (newPresentation) {
							return presentation;
						}

						return null;
					})
					.filter((presentation) => presentation !== null) as Student["presentations"],
			};
		});

		const newLessons = lessons.map((lesson) => {
			return {
				...lesson,
				student: {
					...lesson.student!,
					learning_plan: lesson
						.student!.learning_plan.map((book) => {
							const newBook = newBooks.find((newBook) => newBook.name === book.name);

							if (newBook) {
								const removedLessons = book.lessons.filter((lessonNum) => !newBook.lessons.includes(lessonNum.num));

								const updatedBookLessons = book.lessons.filter(
									(lessonNum) => !removedLessons.some((removedLesson) => removedLesson === lessonNum)
								);

								const addedBookLessons = newBook.lessons.filter(
									(lessonNum) => !updatedBookLessons.some((lesson) => lesson.num === lessonNum)
								);

								return {
									...book,
									lessons: [
										...updatedBookLessons,
										...addedBookLessons.map((lessonNum) => ({
											num: lessonNum,
											finished: false,
										})),
									],
								};
							}

							return null;
						})
						.filter((book) => book !== null) as Student["learning_plan"],
					presentations: lesson
						.student!.presentations.map((presentation) => {
							const newPresentation = newPresentations.find((newp) => newp.name === presentation.name);

							if (newPresentation) {
								return presentation;
							}

							return null;
						})
						.filter((presentation) => presentation !== null) as Student["presentations"],
				},
			};
		});
		const newPayments = payments.map((payment) => {
			return {
				...payment,
				student: {
					...payment.student!,
					learning_plan: payment
						.student!.learning_plan.map((book) => {
							const newBook = newBooks.find((newBook) => newBook.name === book.name);

							if (newBook) {
								const removedLessons = book.lessons.filter((lessonNum) => !newBook.lessons.includes(lessonNum.num));

								const updatedBookLessons = book.lessons.filter(
									(lessonNum) => !removedLessons.some((removedLesson) => removedLesson === lessonNum)
								);

								const addedBookLessons = newBook.lessons.filter(
									(lessonNum) => !updatedBookLessons.some((lesson) => lesson.num === lessonNum)
								);

								return {
									...book,
									lessons: [
										...updatedBookLessons,
										...addedBookLessons.map((lessonNum) => ({
											num: lessonNum,
											finished: false,
										})),
									],
								};
							}

							return null;
						})
						.filter((book) => book !== null) as Student["learning_plan"],
					presentations: payment
						.student!.presentations.map((presentation) => {
							const newPresentation = newPresentations.find((newp) => newp.name === presentation.name);

							if (newPresentation) {
								return presentation;
							}

							return null;
						})
						.filter((presentation) => presentation !== null) as Student["presentations"],
				},
			};
		});

		setStudents(newStudents);
		setLessons(newLessons);
		setPayments(newPayments);
	};
	const handleCancel = () => {
		setNewBooks(books);
		setNewPresentations(presentations);
		setIsEditMode(false);
	};
	const changeBook = (bookIndex: number, newValues: { name?: string; lessons?: number[] }) => {
		setNewBooks((prev) => {
			const newBooksMap = prev.map((book, index) => {
				if (bookIndex === index) {
					return {
						...book,
						...newValues,
					};
				}

				return book;
			});

			return newBooksMap;
		});
	};
	const removeBook = (bookIndex: number) => {
		setNewBooks((books) => books.filter((_, index) => index !== bookIndex));
	};
	const handleRemovePresentation = (presentationIndex: number): void => {
		if (isEditMode) {
			setNewPresentations((pres) => pres.filter((_, index) => index !== presentationIndex));
		}
	};

	const transitions = {
		initial: { opacity: 0, scale: 0.95 },
		animate: { opacity: 1, scale: 1 },
		exit: { opacity: 0, scale: 0.95 },
	};

	useEffect(() => {
		if (email && isLoaded) {
			const updateBooks = async () => {
				await supabase.from("learning_plan").update({ books: books }).eq("author_email", email);
				await supabase.from("students").update({ students: students }).eq("author_email", email);
				await supabase.from("schedules").update({ schedule: lessons }).eq("author_email", email);
				await supabase.from("payments").update({ payments: payments }).eq("author_email", email);
				await supabase.from("presentations").update({ presentations: presentations }).eq("author_email", email);
			};

			updateBooks();
		}
	}, [email, books, isLoaded, students, lessons, payments, presentations]);

	return (
		<>
			<div className="learning-plan">
				<header className="learning-plan__header">
					<div className="learning-plan__header-main">
						<h2>Учебный план</h2>
						{newBooks.length > 0 && (
							<Button text="Добавить материал" icon={{ element: <BookIcon /> }} onClick={() => updateNewBookModalStatus(true)} />
						)}
					</div>
					<div className="learning-plan-edit">
						<AP mode="wait" initial={false}>
							{isEditMode ? (
								<m.div key="edit-mode-active" {...transitions} className="learning-plan-edit__active">
									<div onClick={handleSave} className="learning-plan-edit__save">
										Сохранить
									</div>
									<div onClick={handleCancel} className="learning-plan-edit__cancel">
										Отмена
									</div>
								</m.div>
							) : (
								<m.div
									onClick={() => setIsEditMode(true)}
									key="edit-mode-inactive"
									className="learning-plan-edit__button"
									{...transitions}
								>
									<EditIcon />
									<span>Редактировать</span>
								</m.div>
							)}
						</AP>
					</div>
				</header>
				<main className="learning-plan__body">
					<AP mode="wait" initial={false}>
						{newBooks.length > 0 || presentations.length > 0 ? (
							<>
								{newBooks.length > 0 && (
									<>
										<h2 style={{ marginBottom: 12 }}>Книги</h2>
										<m.div className="learning-plan__content" {...transitions} key={1}>
											{newBooks.map((book, index) => (
												<Book
													isEditMode={isEditMode}
													removeBook={() => removeBook(index)}
													changeBook={(newValues: { name?: string; lessons?: number[] }) => changeBook(index, newValues)}
													key={index}
													book={book}
												/>
											))}
										</m.div>
									</>
								)}
								{newPresentations.length > 0 && (
									<>
										<h2 style={{ marginBottom: 12, marginTop: 24 }}>Презентации</h2>
										<m.div className="book-content book-content_presentations" {...transitions} key={5}>
											{newPresentations.map((presentation, index) => (
												<div
													key={index}
													className={`book-lesson${isEditMode ? " book-lesson_editable" : ""}`}
													onClick={() => handleRemovePresentation(index)}
												>
													<AP mode="wait" initial={false}>
														{isEditMode && (
															<m.div {...transitions}>
																<TrashIcon />
															</m.div>
														)}
													</AP>
													<span>{presentation.name}</span>
												</div>
											))}
										</m.div>
									</>
								)}
							</>
						) : (
							<m.div {...transitions} key={2} className="learning-plan__empty">
								<>
									<Description>Ваш учебный план пока-что пуст, давайте его скорее заполним!</Description>
									<Button
										text="Добавить материал"
										icon={{ element: <BookIcon /> }}
										onClick={() => updateNewBookModalStatus(true)}
									/>
								</>
							</m.div>
						)}
					</AP>
				</main>
				<NewBookModal />
			</div>
		</>
	);
};

export default LearningPlan;
