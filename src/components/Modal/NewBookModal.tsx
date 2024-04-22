import { FC, useState } from "react";
import ModalLayout from "./ModalLayout";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useActions } from "../../hooks/useActions";
import Input from "../Input";

import Icon from "../../icons/carets.svg?react";
import BookIcon from "../../icons/book.svg?react";
import Button, { ButtonTypes } from "../Button";
import Description from "../Description";

enum NewBookTabs {
	book = "book",
	presentation = "presentation",
}

const NewBookModal: FC = () => {
	const [activeTab, setActiveTab] = useState<NewBookTabs>(NewBookTabs.book);

	const { books, presentations } = useAppSelector((state) => state.learningPlan);

	const { isNewBookModalActive } = useAppSelector((state) => state.modal);
	const { students } = useAppSelector((state) => state.students);
	const { payments } = useAppSelector((state) => state.payments);
	const { lessons } = useAppSelector((state) => state.lessons);
	const { updateNewBookModalStatus, setBooks, setLessons, setStudents, setPayments, setPresentations } = useActions();

	const [name, setName] = useState<string>("");
	const [lessonNum, setLessonNum] = useState<string>("0");

	const handleAddBook = () => {
		updateNewBookModalStatus(false);
		const newBooks = [
			...books,
			{
				name: name,
				lessons: Array.from({ length: Number(lessonNum) }, (_, i) => i + 1),
			},
		];

		setBooks(newBooks);
		const newStudents = students.map((student) => {
			return {
				...student,
				learning_plan: [
					...student.learning_plan,
					...newBooks
						.filter((_, index) => index === newBooks.length - 1)
						.map((book) => {
							return {
								...book,
								lessons: book.lessons.map((lesson) => {
									return {
										num: lesson,
										finished: false,
									};
								}),
								finished: false,
							};
						}),
				],
			};
		});
		const newLessons = lessons.map((lesson) => {
			return {
				...lesson,
				student: {
					...lesson.student!,
					learning_plan: [
						...lesson.student!.learning_plan,
						...newBooks
							.filter((_, index) => index === newBooks.length - 1)
							.map((book) => {
								return {
									...book,
									lessons: book.lessons.map((lesson) => {
										return {
											num: lesson,
											finished: false,
										};
									}),
									finished: false,
								};
							}),
					],
				},
			};
		});
		const newPayments = payments.map((payment) => {
			return {
				...payment,
				student: {
					...payment.student!,
					learning_plan: [
						...payment.student!.learning_plan,
						...newBooks
							.filter((_, index) => index === newBooks.length - 1)
							.map((book) => {
								return {
									...book,
									lessons: book.lessons.map((lesson) => {
										return {
											num: lesson,
											finished: false,
										};
									}),
									finished: false,
								};
							}),
					],
				},
			};
		});

		setLessons(newLessons);
		setStudents(newStudents);
		setPayments(newPayments);
		setLessonNum("0");
		setName("");
	};

	const handleAddPresentation = () => {
		updateNewBookModalStatus(false);

		const newPresentations = [
			...presentations,
			{
				name: name,
			},
		];

		const newStudents = students.map((student) => {
			return {
				...student,
				presentations: [
					...student.presentations,
					...newPresentations
						.filter((_, index) => index === newPresentations.length - 1)
						.map((presentation) => {
							return {
								...presentation,
								finished: false,
							};
						}),
				],
			};
		});

		const newLessons = lessons.map((lesson) => {
			return {
				...lesson,
				student: {
					...lesson.student!,
					presentations: [
						...lesson.student!.presentations,
						...newPresentations
							.filter((_, index) => index === newPresentations.length - 1)
							.map((presentation) => {
								return {
									...presentation,
									finished: false,
								};
							}),
					],
				},
			};
		});

		const newPayments = payments.map((payment) => {
			return {
				...payment,
				student: {
					...payment.student!,
					presentations: [
						...payment.student!.presentations,
						...newPresentations
							.filter((_, index) => index === newPresentations.length - 1)
							.map((presentation) => {
								return {
									...presentation,
									finished: false,
								};
							}),
					],
				},
			};
		});

		setPresentations(newPresentations);
		setStudents(newStudents);
		setLessons(newLessons);
		setPayments(newPayments);

		setName("");
	};

	return (
		<ModalLayout className="new-book-modal" isActive={isNewBookModalActive} onClose={() => updateNewBookModalStatus(false)}>
			<h1>Новый материал</h1>
			<div className="new-book-modal-tabs">
				<div
					className={`new-book-modal-tabs__item${activeTab === NewBookTabs.book ? " active" : ""}`}
					onClick={() => setActiveTab(NewBookTabs.book)}
				>
					Книга
				</div>
				<div
					className={`new-book-modal-tabs__item${activeTab === NewBookTabs.presentation ? " active" : ""}`}
					onClick={() => setActiveTab(NewBookTabs.presentation)}
				>
					Презентация
				</div>
			</div>
			{activeTab === NewBookTabs.book ? (
				<>
					<Input placeholder="Введите название книги" value={name} onChange={setName} />
					<div className="new-book-modal__content">
						<Description>Укажите количество уроков в добавляемой книге</Description>
						<div className="lesson-time">
							<input
								type="number"
								min={0}
								value={lessonNum}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) => setLessonNum(event.target.value)}
								className="lesson-time__input"
							/>
							<div className="lesson-time__placeholder">Уроков</div>
							<Icon className="lesson-time__carets" />
						</div>
					</div>
				</>
			) : (
				<>
					<Input placeholder="Введите название презентации" value={name} onChange={setName} />
				</>
			)}
			<div className="new-book-modal__footer">
				<Button
					text={`Добавить ${activeTab === NewBookTabs.book ? "книгу" : "презентацию"}`}
					onClick={activeTab === NewBookTabs.book ? handleAddBook : handleAddPresentation}
					icon={{ element: <BookIcon /> }}
					type={ButtonTypes.primary}
				/>
				<Button
					text="Отмена"
					onClick={() => {
						updateNewBookModalStatus(false);
						setLessonNum("0");
						setName("");
					}}
				/>
			</div>
		</ModalLayout>
	);
};

export default NewBookModal;
