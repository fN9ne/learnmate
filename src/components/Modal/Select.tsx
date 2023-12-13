import { FC, useEffect, useRef, useState } from "react";

import Icon from "../../icons/arrow_down.svg?react";
import { useAppSelector } from "../../hooks/useAppSelector";

import { AnimatePresence as AP, motion as m } from "framer-motion";
import { Student } from "../../store/reducers/StudentsSlice";

interface SelectProps {
	selected: Student | null;
	isLast: boolean;
	onSelect: (student: Student) => void;
}

const Select: FC<SelectProps> = ({ selected, isLast, onSelect }) => {
	const { students } = useAppSelector((state) => state.students);

	const [active, setActive] = useState<boolean>(false);
	const [visibleStudents, setVisibleStudents] = useState<Student[]>(students);
	const [inputValue, setInputValue] = useState<string>(selected ? `${selected?.name}, ${selected?.username}` : "");

	const onFiltering = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value.toLowerCase();
		setInputValue(event.target.value);

		const filtering = (student: Student) => {
			return (
				student.name.toLowerCase().startsWith(value) ||
				student.username.toLowerCase().startsWith(value) ||
				`${student.name.toLowerCase()}, ${student.username.toLowerCase()}`.startsWith(value)
			);
		};

		setVisibleStudents(() => students.filter(filtering));
	};

	const onSelectStudent = (student: Student) => {
		onSelect(student);
		setInputValue(`${student.name}, ${student.username}`);
		setVisibleStudents(students);
		setActive(false);
	};

	useEffect(() => {
		setInputValue(selected ? `${selected.name}, ${selected.username}` : "");
	}, [selected]);

	useEffect(() => {
		const closeSelectbox = (event: MouseEvent) => {
			const targetElement = event.target as Element;

			if (!targetElement.closest(".student-select")) {
				setActive(false);
			}
		};

		document.addEventListener("click", closeSelectbox);

		return () => {
			document.removeEventListener("click", closeSelectbox);
		};
	}, []);

	const transitions = {
		initial: { opacity: 0, scale: 0.95, y: isLast ? 12 : -12 },
		animate: { opacity: 1, scale: 1, y: isLast ? -6 : 6 },
		exit: { opacity: 0, scale: 0.95, y: isLast ? 12 : -12 },
	};

	return (
		<div className="student-select">
			<div className="student-select__field">
				<div className="student-select__color" style={{ backgroundColor: selected?.color }} />
				<input
					type="text"
					onFocus={() => setActive(true)}
					onChange={onFiltering}
					value={inputValue}
					className={`student-select__input${selected ? " student-select__input_selected" : ""}`}
					placeholder=" Выберите ученика"
				/>
				<Icon className="student-select__arrow" />
			</div>
			<AP mode="wait" initial={false}>
				{active && (
					<m.div {...transitions} className={`student-select__list${isLast ? " student-select__list_last" : ""}`}>
						<div
							className={`student-select__list-wrapper${visibleStudents.length >= 4 ? " student-select__list-wrapper_long" : ""}`}
						>
							{visibleStudents.length > 0 ? (
								visibleStudents.map((student, index) => (
									<div className="student-select-item" onClick={() => onSelectStudent(student)} key={index}>
										<div className="student-select-item__color" style={{ backgroundColor: student.color }} />
										<div className="student-select-item__name">
											{student.name}, {student.username}
										</div>
									</div>
								))
							) : (
								<div className="student-select__not-found">Ученик не найден</div>
							)}
						</div>
					</m.div>
				)}
			</AP>
		</div>
	);
};

export default Select;
