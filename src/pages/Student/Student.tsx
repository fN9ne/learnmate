import Button, { ButtonTypes } from "@/components/UI/Button";
import { useAppSelector } from "@/hooks/useAppSelector";
import { IStudent, IStudentBook } from "@/redux/slices/students";
import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import TrashIcon from "@icons/trash.svg?react";
import BookIcon from "@icons/book.svg?react";
import PresentationIcon from "@icons/presentation.svg?react";
import CheckIcon from "@icons/checkmark.svg?react";

import { useActions } from "@/hooks/useActions";
import ColorPicker from "@/components/UI/ColorPicker";
import Switch from "@/components/UI/Switch";
import Input, { InputTypes } from "@/components/UI/Input";
import History from "./History";
import Block from "@/components/UI/Block";
import { IBook, IPresentation } from "@/redux/slices/lp";

const Student: FC = () => {
	const { id } = useParams();
	const { students } = useAppSelector((state) => state.students);
	const [student, setStudent] = useState<IStudent | undefined>(undefined);
	const { updateStudent } = useActions();
	const { books, presentations } = useAppSelector((state) => state.lp);

	const handleUpdateStudent = <K extends keyof IStudent>(key: K, value: IStudent[K]) => {
		if (student) {
			updateStudent({ id: student.id, data: { [key]: value } });
		}
	};

	useEffect(() => {
		if (id) {
			setStudent(students.find((student) => student.id === +id));
		}
	}, [id, students]);

	return (
		student && (
			<div className="student-page">
				<div className="student-page__row">
					<div className="student-page-main">
						<div className="student-page-main__header">
							<div className="student-page-main__delimiter" style={{ backgroundColor: student.color }} />
							<div className="student-page-main__title">
								<h2>{student.name}</h2>
								<div className={`student-page-main__activity${student.isActive ? " student-page-main__activity--active" : ""}`} />
								<h3>{student.username.slice(1)}</h3>
							</div>
							<div className="student-page-main__info">
								<div className="student-page-main__created-at">
									Добавлен{" "}
									{`${
										new Date(student.createDate).getDate() < 10
											? `0${new Date(student.createDate).getDate()}`
											: new Date(student.createDate).getDate()
									}.${
										new Date(student.createDate).getMonth() < 10
											? `0${new Date(student.createDate).getMonth()}`
											: new Date(student.createDate).getMonth()
									}.${new Date(student.createDate).getFullYear()}`}
								</div>
								<Button type={ButtonTypes.red} icon={<TrashIcon />}>
									Удалить
								</Button>
							</div>
						</div>
						<div className="student-page-main__body">
							<div className="student-page-main__label">Детали</div>
							<div className="student-page-main__content">
								<div className="student-page-input">
									<div className="student-page-input__label">Имя</div>
									<Input value={student.name} onChange={(value: string) => handleUpdateStudent("name", value)} />
								</div>
								<div className="student-page-input">
									<div className="student-page-input__label">Телеграм</div>
									<Input
										value={student.username}
										onChange={(value: string) => handleUpdateStudent("username", value.startsWith("@") ? value : `@${value}`)}
									/>
								</div>
								<div className="student-page-input">
									<div className="student-page-input__label">Дискорд</div>
									<Input
										value={student.discord || ""}
										onChange={(value: string) => handleUpdateStudent("discord", value.length !== 0 ? value : null)}
									/>
								</div>
								<div className="student-page-input">
									<div className="student-page-input__label">Стоимость занятия</div>
									<Input
										value={student.cost.toString()}
										type={InputTypes.number}
										step={5}
										min={0}
										onChange={(value: string) => handleUpdateStudent("cost", +value)}
									/>
								</div>
							</div>
						</div>
						<div className="student-page-main__footer">
							<div className="student-page-input">
								<div className="student-page-input__label">Цвет</div>
								<ColorPicker
									placeholder="Цвет"
									value={student.color}
									onChange={(value: string) => handleUpdateStudent("color", value)}
								/>
							</div>
							<Switch
								text={{ onText: "Активен", offText: "Неактивен" }}
								isChecked={student.isActive}
								onClick={(value: boolean) => handleUpdateStudent("isActive", value)}
							/>
						</div>
					</div>
					{student && <History student={student} />}
				</div>
				<div className="student-page__row">
					<Block title="Книги" icon={<BookIcon />}>
						{books.map((book, index) => (
							<StudentBook
								{...book}
								key={index}
								studentId={student.id}
								studentProgress={student.learningPlan.find((bookItem) => bookItem.id === book.id)}
							/>
						))}
					</Block>
					<Block title="Презентации" icon={<PresentationIcon />}>
						{presentations.map((presentation, index) => (
							<StudentPresentation {...presentation} key={index} studentId={student.id} studentProgress={student.presentations} />
						))}
					</Block>
				</div>
			</div>
		)
	);
};

export default Student;

interface StudentBookProps extends IBook {
	studentProgress: IStudentBook | undefined;
	studentId: number;
}

const StudentBook: FC<StudentBookProps> = ({ color, id, lessons, name, studentProgress, studentId }) => {
	const { updateStudent } = useActions();
	const { students } = useAppSelector((state) => state.students);

	const student = students.find((student) => student.id === studentId);

	const [isActive, setIsActive] = useState<boolean>(false);

	const handleCheckLesson = (lesson: number) => {
		let updatedProgress: number[] = [];

		if (studentProgress) {
			if (studentProgress.progress.includes(lesson)) {
				updatedProgress = studentProgress.progress.filter((l) => l !== lesson);
			} else {
				updatedProgress = [...studentProgress.progress, lesson];
			}
		} else {
			updatedProgress = [lesson];
		}

		const updatedLearningPlan = student?.learningPlan.map((book) =>
			book.id === id ? { ...book, progress: updatedProgress } : book
		);

		if (!updatedLearningPlan?.find((book) => book.id === id)) {
			updatedLearningPlan?.push({ id, progress: updatedProgress });
		}

		updateStudent({
			id: studentId,
			data: {
				learningPlan: updatedLearningPlan,
			},
		});
	};

	return (
		<div className="student-book">
			<button className="student-book__main" onClick={() => setIsActive((state) => !state)}>
				{color && <div className="student-book__color" style={{ backgroundColor: color }} />}
				<div className="student-book__name">{name}</div>
				<div className="student-book__lessons">
					{studentProgress ? `${studentProgress.progress.length}/${lessons} уроков` : `${lessons} уроков`}
				</div>
			</button>
			{isActive && (
				<div className="student-book__body">
					{Array.from({ length: lessons }, (_, index) => index + 1).map((lesson) => (
						<button
							className={`student-book__lesson${
								studentProgress && studentProgress.progress.includes(lesson) ? " student-book__lesson--active" : ""
							}`}
							key={lesson}
							onClick={() => handleCheckLesson(lesson)}
						>
							{lesson}
						</button>
					))}
				</div>
			)}
		</div>
	);
};

interface StudentPresentationProps extends IPresentation {
	studentProgress: number[] | undefined;
	studentId: number;
}

const StudentPresentation: FC<StudentPresentationProps> = ({ color, id, name, studentId, studentProgress }) => {
	const { updateStudent } = useActions();

	const handleCheckPresentation = () => {
		const isCompleted = studentProgress?.includes(id);

		const updatedPresentations = isCompleted
			? studentProgress?.filter((presentationId) => presentationId !== id)
			: [...(studentProgress || []), id];

		updateStudent({ id: studentId, data: { presentations: updatedPresentations } });
	};

	return (
		<div className={`student-book${studentProgress?.includes(id) ? " student-book--active" : ""}`}>
			<button className="student-book__main" onClick={handleCheckPresentation}>
				{color && <div className="student-book__color" style={{ backgroundColor: color }} />}
				<div className="student-book__name">{name}</div>
				<CheckIcon className="student-book__checkmark" />
			</button>
		</div>
	);
};
