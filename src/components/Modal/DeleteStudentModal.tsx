import { FC } from "react";
import ModalLayout from "./ModalLayout";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useActions } from "../../hooks/useActions";
import Description from "../Description";
import Button, { ButtonTypes } from "../Button";

import TrashIcon from "../../icons/trash.svg?react";

const DeleteStudentModal: FC = () => {
	const { studentToDelete } = useAppSelector((state) => state.students);
	const { isDeleteStudentModalActive } = useAppSelector((state) => state.modal);
	const { updateDeleteStudentModalActive, removeStudent } = useActions();

	return (
		<ModalLayout
			className="student-delete"
			isActive={isDeleteStudentModalActive}
			onClose={() => updateDeleteStudentModalActive(false)}
		>
			<h1>Удалить ученика?</h1>
			<Description>
				Вы собираетесь удалить ученика
				<br />«{studentToDelete?.name}, {studentToDelete?.username}», это действие необратимо.
			</Description>
			<div className="student-delete__footer">
				<Button
					text="Удалить"
					icon={{ element: <TrashIcon /> }}
					type={ButtonTypes.error}
					onClick={() => {
						removeStudent(studentToDelete!.username);
						updateDeleteStudentModalActive(false);
					}}
				/>
				<Button text="Отмена" type={ButtonTypes.default} onClick={() => updateDeleteStudentModalActive(false)} />
			</div>
		</ModalLayout>
	);
};

export default DeleteStudentModal;
