import { FC } from "react";
import ModalLayout from "./ModalLayout";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useActions } from "../../hooks/useActions";
import { Learn } from "../../store/reducers/LessonsSlice";
import { months, weekdays } from "../../dates/dates";

interface HistoryLessonModalProps {
	lesson: Learn | null;
}

const HistoryLessonModal: FC<HistoryLessonModalProps> = ({ lesson }) => {
	const { isHistoryLessonModalActive } = useAppSelector((state) => state.modal);
	const { updateHistoryLessonModalStatus } = useActions();

	const { payments } = useAppSelector((state) => state.payments);

	const isLessonPayed = payments.filter((payment) => payment.hash === lesson?.hash)[0]?.status;

	return (
		<ModalLayout
			className="history-lesson"
			isActive={isHistoryLessonModalActive}
			onClose={() => updateHistoryLessonModalStatus(false)}
		>
			{lesson && (
				<>
					<div className="history-lesson__header">
						<h1>{`${lesson.day} ${months[lesson.month][1]} ${lesson.year}, ${
							weekdays[(new Date(lesson!.year, lesson.month, lesson.day).getDay() + 6) % 7][0]
						}`}</h1>
					</div>
					<div className="history-lesson__body">
						<div className="history-lesson__row">
							<div className="history-lesson__item">
								<div className="history-lesson__label">время занятия</div>
								<div className="history-lesson__time">{`${lesson.time.hour < 10 ? "0" + lesson.time.hour : lesson.time.hour}:${
									lesson.time.minute < 10 ? "0" + lesson.time.minute : lesson.time.minute
								}`}</div>
							</div>
							<div className="history-lesson__item">
								<div className="history-lesson__label">тип занятия</div>
								<div className="history-lesson__time">{lesson.isTest ? "Пробное" : "Оплачиваемое"}</div>
							</div>
							{isLessonPayed !== null && (
								<div className="history-lesson__item">
									<div className="history-lesson__label">Статус</div>
									<div className={`history-lesson__${isLessonPayed ? "payed" : "test"}`}>
										{isLessonPayed ? "Оплачено" : "Не оплачено"}
									</div>
								</div>
							)}
						</div>
						<div className="history-lesson__content">
							<div className="history-lesson__textblock">
								<div className="history-lesson__label">домашнее задание</div>
								<div className="history-lesson__text">{lesson.homework.length > 0 ? lesson.homework : "Нет"}</div>
							</div>
							<div className="history-lesson__textblock">
								<div className="history-lesson__label">задачи на занятие</div>
								<div className="history-lesson__text">{lesson.plan.length > 0 ? lesson.plan : "Нет"}</div>
							</div>
							<div className="history-lesson__textblock">
								<div className="history-lesson__label">заметки к занятию</div>
								<div className="history-lesson__text">{lesson.note.length > 0 ? lesson.note : "Нет"}</div>
							</div>
							<div className="history-lesson__textblock">
								<div className="history-lesson__label">остановились на</div>
								<div className="history-lesson__text">{lesson.stoppedAt.length > 0 ? lesson.stoppedAt : "Нет"}</div>
							</div>
						</div>
					</div>
				</>
			)}
		</ModalLayout>
	);
};

export default HistoryLessonModal;
