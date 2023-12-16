import { FC, useState } from "react";
import ModalLayout from "./ModalLayout";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useActions } from "../../hooks/useActions";
import Input from "../Input";

import Icon from "../../icons/carets.svg?react";
import BookIcon from "../../icons/book.svg?react";
import Button, { ButtonTypes } from "../Button";
import Description from "../Description";

const NewBookModal: FC = () => {
	const { books } = useAppSelector((state) => state.learningPlan);

	const { isNewBookModalActive } = useAppSelector((state) => state.modal);
	const { students } = useAppSelector((state) => state.students);
	const { payments } = useAppSelector((state) => state.payments);
	const { lessons } = useAppSelector((state) => state.lessons);
	const { updateNewBookModalStatus, setBooks, setLessons, setStudents, setPayments } = useActions();

	const [name, setName] = useState<string>("");
	const [lessonNum, setLessonNum] = useState<string>("0");

	return (
		<ModalLayout className="new-book-modal" isActive={isNewBookModalActive} onClose={() => updateNewBookModalStatus(false)}>
			<h1>Новая книга</h1>
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
			<div className="new-book-modal__footer">
				<Button
					text="Добавить книгу"
					onClick={() => {
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
					}}
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
