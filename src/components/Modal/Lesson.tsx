import { FC, useEffect, useRef, useState } from "react";
import { Learn, LearnChange } from "../../store/reducers/LessonsSlice";

import TrashIcon from "../../icons/trash.svg?react";
import Select from "./Select";
import { Student } from "../../store/reducers/StudentsSlice";
import Time from "./Time";
import Textarea from "./Textarea";
import Switch from "../Switch";

interface LessonProps {
	data: Learn;
	num: number;
	changeLesson: (newValues: LearnChange) => void;
	onRemove: () => void;
}

const Lesson: FC<LessonProps> = ({ num, data, changeLesson, onRemove }) => {
	const handleSwitchTest = () => changeLesson({ isTest: !data.isTest });
	const handleSwitchConstant = () => {
		changeLesson({ isConstant: !data.isConstant });
	};

	const [isTarget, setIsTarget] = useState<boolean>(false);

	const ref = useRef(null);

	useEffect(() => {
		const handleBlurLesson = (event: MouseEvent) => {
			const targetElement = event.target as Element;

			if (ref.current !== targetElement.closest(".lesson")) {
				setIsTarget(false);
			}
		};

		document.addEventListener("click", handleBlurLesson);

		return () => {
			document.removeEventListener("click", handleBlurLesson);
		};
	}, []);

	useEffect(() => {
		if (data.time.minute >= 60) {
			changeLesson({ time: { hour: data.time.hour + 1, minute: 0 } });
		}
		if (data.time.minute <= -1) {
			changeLesson({ time: { hour: data.time.hour - 1, minute: 59 } });
		}
	}, [data.time.minute]);

	useEffect(() => {
		if (data.time.hour >= 24) {
			changeLesson({ time: { hour: 0, minute: data.time.minute } });
		}
		if (data.time.hour <= -1) {
			changeLesson({ time: { hour: 23, minute: data.time.minute } });
		}
	}, [data.time.hour]);

	return (
		<div id={data.hash} className="lesson" ref={ref} style={{ zIndex: isTarget ? 2 : 1 }} onClick={() => setIsTarget(true)}>
			<header className="lesson__header">
				<div className="lesson__name">Занятие {num}</div>
				<div className="lesson__remove" onClick={onRemove}>
					<TrashIcon />
				</div>
			</header>
			<main className="lesson__body">
				<div className="lesson__row">
					<Select selected={data.student} onSelect={(student: Student) => changeLesson({ student: student })} />
					<div className="lesson__time">
						<Time
							value={data.time.hour.toString()}
							limits={{ min: -1, max: 24 }}
							onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
								changeLesson({ time: { hour: Number(event.target.value), minute: data.time.minute } })
							}
							placeholder="часов"
						/>
						<Time
							value={data.time.minute.toString()}
							limits={{ min: -1, max: 60 }}
							onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
								changeLesson({ time: { hour: data.time.hour, minute: Number(event.target.value) } })
							}
							placeholder="минут"
						/>
					</div>
				</div>
				<div className="lesson__content">
					<Textarea
						placeholder="Домашнее задание"
						value={data.homework}
						onChange={(value) => changeLesson({ homework: value })}
					/>
					<Textarea placeholder="Задачи на занятие" value={data.plan} onChange={(value) => changeLesson({ plan: value })} />
					<Textarea placeholder="Заметки" value={data.note} onChange={(value) => changeLesson({ note: value })} />
					<Textarea
						placeholder="Остановились на"
						value={data.stoppedAt}
						onChange={(value) => changeLesson({ stoppedAt: value })}
					/>
				</div>
				<div className="lesson__footer">
					<Switch isChecked={data.isTest} onClick={handleSwitchTest} text="Пробное занятие" />
					<Switch isChecked={data.isConstant} onClick={handleSwitchConstant} text="Сделать постоянным" />
				</div>
			</main>
		</div>
	);
};

export default Lesson;
