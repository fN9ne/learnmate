import Block from "@/components/UI/Block";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { FC, useState } from "react";

import GroupIcon from "@icons/students.svg?react";
import PlusIcon from "@icons/plusAlt.svg?react";
import TelegramIcon from "@icons/telegram.svg?react";
import ArrowIcon from "@icons/arrowBack.svg?react";
import PersonIcon from "@icons/person.svg?react";
import DiscordIcon from "@icons/discord.svg?react";
import RubIcon from "@icons/rub.svg?react";

import { useAppSelector } from "@/hooks/useAppSelector";
import { useActions } from "@/hooks/useActions";
import Switch from "@/components/UI/Switch";
import Button, { ButtonTypes } from "@/components/UI/Button";
import { IStudent } from "@/redux/slices/students";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";

import { AnimatePresence as AP, motion as m } from "framer-motion";
import { useInput } from "@/hooks/useInput";
import Input from "@/components/UI/Input";
import ColorPicker from "@/components/UI/ColorPicker";
import { generateId } from "@/functions";
import { StudentNicknameSource } from "@/redux/slices/global";
import Loader from "@/components/Loader";

const Students: FC = () => {
	const { newStudent } = useAppSelector((state) => state.modal);
	const { openModal } = useActions();

	const { students, isFetching } = useAppSelector((state) => state.students);

	const [isHideNonActiveStudents, setIsHideNonActiveStudents] = useState<boolean>(false);

	useDocumentTitle("Ученики");

	const transitions = {
		initial: { opacity: 0, y: -20 },
		animate: { opacity: 1, y: 0 },
		exit: { opacity: 0, y: -20 },
	};

	return (
		<div className="students">
			<AP mode="wait" initial={false}>
				{isFetching ? (
					<Loader isFetching={isFetching} className="students__loader" />
				) : (
					<>
						{!newStudent ? (
							<m.div key="content" className="students__content" {...transitions}>
								<Block
									title="Ученики"
									icon={<GroupIcon />}
									headerContent={
										<div className="block__actions">
											<Switch
												isChecked={isHideNonActiveStudents}
												onClick={(value: boolean) => setIsHideNonActiveStudents(value)}
												text="Скрывать не активных учеников"
											/>
											<Button icon={<PlusIcon />} onClick={() => openModal("newStudent")}>
												Добавить ученика
											</Button>
										</div>
									}
								>
									<div className="students__list">
										{students.length > 0 ? (
											[...students]
												.sort((a, b) => (a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1))
												.map(
													(student, index) =>
														!(isHideNonActiveStudents && !student.isActive) && <Student {...student} key={index} />
												)
										) : (
											<div className="students__empty">
												<div className="text text--n">Пока что у вас нет добавленных учеников.</div>
											</div>
										)}
									</div>
								</Block>
							</m.div>
						) : (
							<m.div key="newStudent" {...transitions} className="students__new">
								<NewStudent />
							</m.div>
						)}
					</>
				)}
			</AP>
		</div>
	);
};

export default Students;

const Student: FC<IStudent> = ({ color, id, name, username, discord, isActive }) => {
	const navigate = useNavigate();

	const { settings } = useAppSelector((state) => state.global);

	const studentClassNames = classNames("student", { "student--inactive": !isActive });

	return (
		<div className={studentClassNames} onClick={() => navigate("/student/" + id)}>
			<div className="student__name">
				<div className="student__color" style={{ backgroundColor: color }} />
				{name}
			</div>
			<div className="student__delimiter" style={{ backgroundColor: color }} />
			<div className="student__footer">
				<div className="student__username">
					{settings.studentNicknameSource === StudentNicknameSource.Telegram ? (
						<>
							<TelegramIcon />
							<span>{username.slice(1)}</span>
						</>
					) : (
						<>
							<DiscordIcon />
							<span>{discord}</span>
						</>
					)}
				</div>
				<ArrowIcon />
			</div>
		</div>
	);
};

const NewStudent: FC = ({}) => {
	const { closeModal, addStudent } = useActions();
	const { settings } = useAppSelector((state) => state.global);
	const { students } = useAppSelector((state) => state.students);

	const name = useInput("", {});
	const telegram = useInput("", {});
	const discord = useInput("", {});
	const cost = useInput(settings.defaultCost.toString(), {});
	const color = useInput("#000", {});

	const handleAddStudent = (): void => {
		addStudent({
			id: generateId(students),
			color: color.value,
			cost: +cost.value,
			discord: discord.value,
			isActive: true,
			learningPlan: [],
			name: name.value,
			note: "",
			presentations: [],
			username: telegram.value.startsWith("@") ? telegram.value : `@${telegram.value}`,
			createDate: new Date().toString(),
			additionalLearningPlan: [],
		});
		closeModal("newStudent");
	};

	return (
		<Block onBack={() => closeModal("newStudent")} title="Новый ученик" icon={<PersonIcon />}>
			<div className="new-student">
				<div className="new-student__body">
					<Input value={name.value} onChange={name.onChange} icon={<PersonIcon />} placeholder="Имя ученика" />
					<Input value={telegram.value} onChange={telegram.onChange} icon={<TelegramIcon />} placeholder="Ник в телеграм" />
					<Input value={discord.value} onChange={discord.onChange} icon={<DiscordIcon />} placeholder="Ник в дискорд" />
					<Input value={cost.value} onChange={cost.onChange} icon={<RubIcon />} placeholder="Стоимость занятия" />
					<ColorPicker value={color.value} onChange={color.onChange} placeholder="Цвет ученика" />
				</div>
				<div className="new-student__footer">
					<Button onClick={handleAddStudent} icon={<PlusIcon />}>
						Добавить ученика
					</Button>
					<Button onClick={() => closeModal("newStudent")} type={ButtonTypes.secondary} icon={<PlusIcon />}>
						Отменить
					</Button>
				</div>
			</div>
		</Block>
	);
};
