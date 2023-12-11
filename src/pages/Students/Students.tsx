import Button from "../../components/Button";
import "./Students.scss";

import { FC, useEffect } from "react";

import UserIcon from "../../icons/user.svg?react";
import { useActions } from "../../hooks/useActions";
import { useAppSelector } from "../../hooks/useAppSelector";
import supabase from "../../services/createClient";
import StudentsShowTypeSwitcher from "./StudentsShowTypeSwitcher";

import { AnimatePresence as AP, motion as m } from "framer-motion";
import { StudentsShowType } from "../../store/reducers/StudentsSlice";
import Table from "./Table";
import Compact from "./Compact";
import DeleteStudentModal from "../../components/Modal/DeleteStudentModal";

const Students: FC = () => {
	const { students, showType } = useAppSelector((state) => state.students);
	const { email } = useAppSelector((state) => state.user);
	const { updateShowType, updateNewStudentModalStatus, updateStudentsFetching } = useActions();

	useEffect(() => {
		if (email) {
			const updateStudents = async () => {
				const { error } = await supabase
					.from("students")
					.update({ students: students })
					.eq("author_email", email)
					.select("students");

				console.log(error);

				updateStudentsFetching(false);
			};

			updateStudents();
		}
	}, [students]);

	const transitions = {
		initial: { opacity: 0, y: -70, scale: 0.95 },
		animate: { opacity: 1, y: 0, scale: 1 },
		exit: { opacity: 0, y: 70, scale: 0.95 },
		transition: { duration: 0.35 },
	};

	return (
		<div className="students">
			<header className="students__header">
				<Button text="Добавить ученика" icon={{ element: <UserIcon /> }} onClick={() => updateNewStudentModalStatus(true)} />
				<StudentsShowTypeSwitcher activeType={showType} onClick={updateShowType} />
			</header>
			<AP mode="wait" initial={false}>
				{showType === StudentsShowType.table && (
					<m.div {...transitions} key="table" className="students__body">
						<Table />
					</m.div>
				)}
				{showType === StudentsShowType.compact && (
					<m.div {...transitions} key="compact" className="students__body">
						<Compact />
					</m.div>
				)}
			</AP>
			<DeleteStudentModal />
		</div>
	);
};

export default Students;
