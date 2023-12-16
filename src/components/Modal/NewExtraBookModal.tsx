import { FC, useState } from "react";
import ModalLayout from "./ModalLayout";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useActions } from "../../hooks/useActions";
import Input from "../Input";

import Icon from "../../icons/carets.svg?react";
import BookIcon from "../../icons/book.svg?react";
import Button, { ButtonTypes } from "../Button";
import Description from "../Description";
import { Student } from "../../store/reducers/StudentsSlice";

interface NewExtraBookModalProps {
	student: Student | null;
}

const NewExtraBookModal: FC<NewExtraBookModalProps> = ({ student }) => {
	const { isNewExtraBookModalActive } = useAppSelector((state) => state.modal);
	const { students } = useAppSelector((state) => state.students);
	const { payments } = useAppSelector((state) => state.payments);
	const { lessons } = useAppSelector((state) => state.lessons);
	const { updateNewExtraBookModalStatus, setLessons, setStudents, setPayments } = useActions();

	const [name, setName] = useState<string>("");
	const [lessonNum, setLessonNum] = useState<string>("0");

	return (
		<ModalLayout
			className="new-book-modal"
			isActive={isNewExtraBookModalActive}
			onClose={() => updateNewExtraBookModalStatus(false)}
		>
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
						updateNewExtraBookModalStatus(false);
						const newBooks = [
							...student!.extra_lp,
							{
								name: name,
								lessons: Array.from({ length: Number(lessonNum) }, (_, i) => i + 1),
							},
						];

						const newStudents = students.map((stud) => {
							if (student?.username === stud.username) {
								return {
									...stud!,
									extra_lp: [
										...stud.extra_lp!,
										...newBooks
											.filter((_, index) => index === newBooks.length - 1)
											.map((book) => {
												return {
													name: book.name,
													lessons: book.lessons.map((lesson) => {
														return {
															num: typeof lesson === "number" ? lesson : lesson.num,
															finished: false,
														};
													}),
													finished: false,
												};
											}),
									],
								};
							}

							return stud;
						});
						const newLessons = lessons.map((lesson) => {
							if (lesson.student?.username === student?.username) {
								return {
									...lesson,
									student: {
										...lesson.student!,
										extra_lp: [
											...lesson.student!.extra_lp,
											...newBooks
												.filter((_, index) => index === newBooks.length - 1)
												.map((book) => {
													return {
														...book,
														lessons: book.lessons.map((lesson) => {
															return {
																num: typeof lesson === "number" ? lesson : lesson.num,
																finished: false,
															};
														}),
														finished: false,
													};
												}),
										],
									},
								};
							}

							return lesson;
						});
						const newPayments = payments.map((payment) => {
							if (payment.student?.username === student?.username) {
								return {
									...payment,
									student: {
										...payment.student!,
										extra_lp: [
											...payment.student!.extra_lp,
											...newBooks
												.filter((_, index) => index === newBooks.length - 1)
												.map((book) => {
													return {
														...book,
														lessons: book.lessons.map((lesson) => {
															return {
																num: typeof lesson === "number" ? lesson : lesson.num,
																finished: false,
															};
														}),
														finished: false,
													};
												}),
										],
									},
								};
							}

							return payment;
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
						updateNewExtraBookModalStatus(false);
						setLessonNum("0");
						setName("");
					}}
				/>
			</div>
		</ModalLayout>
	);
};

export default NewExtraBookModal;
