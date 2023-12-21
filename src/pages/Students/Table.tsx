import { FC } from "react";
import { useAppSelector } from "../../hooks/useAppSelector";
import { NavLink } from "react-router-dom";

import TrashIcon from "../../icons/trash.svg?react";
import { useActions } from "../../hooks/useActions";

import { Student } from "../../store/reducers/StudentsSlice";

const Table: FC = () => {
	const { students } = useAppSelector((state) => state.students);
	const { updateDeleteStudentModalActive, updateStudentToDelete } = useActions();

	const handleActiveDeleteModal = (student: Student) => {
		updateDeleteStudentModalActive(true);
		updateStudentToDelete(student);
	};

	return (
		<table className="students-table">
			<tbody>
				<tr className="students-table__row">
					<th className="students-table__compact"></th>
					<th>имя</th>
					<th>телеграм</th>
					<th>дискорд</th>
					<th>стоимость занятия</th>
					<th className="students-table__compact">занятий</th>
					<th className="students-table__compact"></th>
					<th className="students-table__compact"></th>
				</tr>
				{students.map((student) => (
					<tr key={student.username}>
						<td className="students-table__compact">
							<div className="students-table__color" style={{ backgroundColor: student.color }} />
						</td>
						<td>{student.name}</td>
						<td className="_cut">{student.username}</td>
						<td>{student.discord_username}</td>
						<td>{student.payment} ₽</td>
						<td className="students-table__compact">{student.lessons_count}</td>
						<td className="students-table__compact">
							<NavLink to={`/app/student/${student.username}`} className="link">
								Подробнее
							</NavLink>
						</td>
						<td className="students-table__compact">
							<div onClick={() => handleActiveDeleteModal(student)} className="students-table__remove">
								<TrashIcon />
							</div>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default Table;
