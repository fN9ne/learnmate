import Button, { ButtonTypes } from "../../components/Button";
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
import Description from "../../components/Description";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const Students: FC = () => {
	useDocumentTitle("Ученики");

	const { students, showType, isLoaded } = useAppSelector((state) => state.students);
	const { email } = useAppSelector((state) => state.user);
	const { updateShowType, updateNewStudentModalStatus, updateStudentsFetching } = useActions();

	useEffect(() => {
		if (email && isLoaded) {
			const updateStudents = async () => {
				await supabase.from("students").update({ students: students }).eq("author_email", email).select("students");

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
				{showType === StudentsShowType.table && students.length > 0 && (
					<m.div {...transitions} key="table" className="students__body">
						<Table />
					</m.div>
				)}
				{showType === StudentsShowType.compact && students.length > 0 && (
					<m.div {...transitions} key="compact" className="students__body">
						<Compact />
					</m.div>
				)}
				{students.length === 0 && (
					<m.div {...transitions} key="compact" className="students__body students__body_empty">
						<Description>Пока что вы не добавили ещё ни одного ученика, давайте добавим первого!</Description>
						<Button
							text="Добавить ученика"
							type={ButtonTypes.primary}
							icon={{ element: <UserIcon /> }}
							onClick={() => updateNewStudentModalStatus(true)}
						/>
					</m.div>
				)}
			</AP>
			<DeleteStudentModal />
		</div>
	);
};

export default Students;
