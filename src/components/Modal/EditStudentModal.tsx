import { FC, useEffect, useState } from "react";
import { Student } from "../../store/reducers/StudentsSlice";
import ModalLayout from "./ModalLayout";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useActions } from "../../hooks/useActions";
import Description from "../Description";
import Button, { ButtonTypes } from "../Button";
import Input, { InputTypes } from "../Input";

import Icon from "../../icons/carets.svg?react";
import Textarea from "./Textarea";

interface EditStudentModalProps {
	student: Student | null;
}

const EditStudentModal: FC<EditStudentModalProps> = ({ student }) => {
	const { isEditStudentModalActive } = useAppSelector((state) => state.modal);
	const { updateEditStudentModalStatus, setStudents, setLessons, setPayments } = useActions();

	const { students } = useAppSelector((state) => state.students);
	const { lessons } = useAppSelector((state) => state.lessons);
	const { payments } = useAppSelector((state) => state.payments);

	const [studentState, setStudentState] = useState<Student | null>(null);

	useEffect(() => {
		setStudentState(student);
	}, [student]);

	const handleChange = (newValues: {
		name?: string;
		username?: string;
		discord_username?: string;
		payment?: number;
		note?: string;
		color?: string;
	}) => {
		setStudentState((student) => ({
			...student!,
			...newValues,
		}));
	};
	const handleClose = () => {
		updateEditStudentModalStatus(false);
	};
	const handleSave = () => {
		const newStudents = students.map((student) => {
			if (student.username === studentState?.username) {
				return studentState;
			}

			return student;
		});

		const newLessons = lessons.map((lesson) => {
			if (lesson.student?.username === studentState?.username) {
				return {
					...lesson,
					student: studentState,
				};
			}

			return lesson;
		});

		const newPayments = payments.map((payment) => {
			if (payment.student?.username === studentState?.username) {
				return {
					...payment,
					student: studentState,
				};
			}

			return payment;
		});

		setStudents(newStudents);
		setLessons(newLessons);
		setPayments(newPayments);

		handleClose();
	};

	return (
		<ModalLayout className="edit-student" isActive={isEditStudentModalActive} onClose={handleClose}>
			{student && studentState && (
				<>
					<div className="edit-student__header">
						<h1>Редактировать ученика</h1>
						<Description>
							Вы редактируете ученика «{student.name}, {student.username}». Не забудьте нажать на кнопку «Сохранить».
						</Description>
					</div>
					<div className="edit-student__body">
						<Input
							placeholder="Ник в телеграм"
							value={studentState!.username}
							onChange={(value) => handleChange({ username: value })}
						/>
						<Input
							placeholder="Ник в дискорд"
							value={studentState!.discord_username ? studentState!.discord_username : ""}
							onChange={(value) => handleChange({ discord_username: value })}
						/>
						<Input placeholder="Имя" value={studentState!.name} onChange={(value) => handleChange({ name: value })} />
						<div className="lesson-time">
							<input
								type="number"
								min={0}
								step={5}
								value={studentState!.payment}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange({ payment: Number(event.target.value) })}
								className="lesson-time__input"
							/>
							<div className="lesson-time__placeholder">Оплата</div>
							<Icon className="lesson-time__carets" />
						</div>
						<Input
							placeholder="Цвет"
							value={studentState!.color}
							onChange={(value) => handleChange({ color: value })}
							type={InputTypes.color}
						/>
						<Textarea
							placeholder="Заметки об ученике"
							value={studentState!.note}
							onChange={(value) => handleChange({ note: value })}
						/>
					</div>
					<div className="edit-student__footer">
						<Button text="Сохранить" type={ButtonTypes.primary} onClick={handleSave} />
						<Button text="Отменить" onClick={handleClose} />
					</div>
				</>
			)}
		</ModalLayout>
	);
};

export default EditStudentModal;
