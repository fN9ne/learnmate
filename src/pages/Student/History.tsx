import Block from "@/components/UI/Block";
import { FC, useEffect, useState } from "react";

import HistoryIcon from "@icons/history.svg?react";
import FilterIcon from "@icons/filter.svg?react";
import WindowIcon from "@icons/window.svg?react";

import { ILesson } from "@/redux/slices/lessons";
import { IStudent } from "@/redux/slices/students";
import { useAppSelector } from "@/hooks/useAppSelector";
import { IPayment } from "@/redux/slices/payments";

import { AnimatePresence as AP, motion as m } from "framer-motion";
import { months, weekdays } from "@/datetime";
import Switch, { SwitchType, TextOrientation } from "@/components/UI/Switch";
import { useActions } from "@/hooks/useActions";
import Input, { InputTypes } from "@/components/UI/Input";
import { useNavigate } from "react-router-dom";

interface LessonsByMonth {
	[month: string]: ILesson[];
}

const groupLessonsByMonth = (lessons: ILesson[]): LessonsByMonth => {
	const lessonsByMonth: LessonsByMonth = {};

	lessons.forEach((lesson) => {
		let month = new Date(lesson.date).toLocaleString("default", { month: "long", year: "numeric" });

		month = month.slice(0, 1).toUpperCase() + month.slice(1, month.length - 3);

		if (!lessonsByMonth[month]) {
			lessonsByMonth[month] = [];
		}

		lessonsByMonth[month].push(lesson);
	});

	return lessonsByMonth;
};

interface HistoryProps {
	student: IStudent;
}

enum PaymentStatus {
	All = "all",
	OnlyPaid = "onlyPaid",
	OnlyNotPaid = "onlyNotPaid",
}

interface IFilters {
	paymentStatus: PaymentStatus;
	timeStatus:
		| "all"
		| {
				startDate: string;
				endDate: string;
		  };
}

const History: FC<HistoryProps> = ({ student }) => {
	const { lessons } = useAppSelector((state) => state.lessons);
	const { payments } = useAppSelector((state) => state.payments);

	const [isFilterActive, setIsFilterActive] = useState<boolean>(false);
	const [thisStudentLessons, setThisStudentLessons] = useState<ILesson[] | null>(null);
	const [filters, setFilters] = useState<IFilters>({ paymentStatus: PaymentStatus.All, timeStatus: "all" });

	const handleChangeFilter = <K extends keyof IFilters>(key: K, value: IFilters[K]) => {
		setFilters({ ...filters, [key]: value });
	};

	useEffect(() => {
		if (student) {
			setThisStudentLessons(lessons.filter((lesson) => lesson.studentId === student.id));
		}
	}, [lessons, student]);

	const transitions = {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
	};

	return (
		<div className="history">
			<Block
				icon={<HistoryIcon />}
				title="История занятий"
				headerContent={
					<button onClick={() => setIsFilterActive((state) => !state)} className="history-filter__button">
						<FilterIcon />
					</button>
				}
			>
				<div className="history__content">
					{thisStudentLessons && thisStudentLessons.length > 0 ? (
						Object.entries(groupLessonsByMonth(thisStudentLessons)).map((value, index) => (
							<HistoryBlock
								name={value[0]}
								lessons={value[1].filter((lesson) => {
									const payment: IPayment | undefined = payments.find((payment) => payment.lessonId === lesson.id);

									let isPaymentStatusMatch = true;
									if (filters.paymentStatus === PaymentStatus.OnlyPaid) {
										isPaymentStatusMatch = payment ? payment.isPaid : false;
									} else if (filters.paymentStatus === PaymentStatus.OnlyNotPaid) {
										isPaymentStatusMatch = payment ? !payment.isPaid : false;
									}

									let isTimeStatusMatch = true;
									if (filters.timeStatus !== "all") {
										if (filters.timeStatus.startDate !== "" && filters.timeStatus.endDate !== "") {
											isTimeStatusMatch =
												new Date(filters.timeStatus.startDate) <= new Date(lesson.date) &&
												new Date(lesson.date) <= new Date(filters.timeStatus.endDate);
										}
									}

									return isPaymentStatusMatch && isTimeStatusMatch;
								})}
								key={index}
							/>
						))
					) : (
						<div className="history__empty text text--n">История занятий пока что пуста.</div>
					)}
				</div>
				<AP mode="wait" initial={false}>
					{isFilterActive && (
						<m.div
							{...transitions}
							className="history-filter__wrapper"
							onClick={(event: React.MouseEvent<HTMLDivElement>) => {
								const element = event.target as Element;
								if (!element.closest(".history-filter")) setIsFilterActive(false);
							}}
						>
							<Filter {...filters} handleChangeFilter={handleChangeFilter} />
						</m.div>
					)}
				</AP>
			</Block>
		</div>
	);
};

export default History;

const HistoryBlock: FC<{ name: string; lessons: ILesson[] }> = ({ lessons, name }) => {
	return (
		<div className="history-block">
			<div className="history-block__title">{name}</div>
			<div className="history-block__content">
				{lessons.length > 0 ? (
					lessons.map((lesson, index) => <HistoryItem {...lesson} key={index} />)
				) : (
					<div className="history-block__empty text text--n">
						По всей видимости у вас выставлены фильтры, которые не показываются занятия в этом месяце.
					</div>
				)}
			</div>
		</div>
	);
};

const HistoryItem: FC<ILesson> = ({ date, hasTime, id, info, isTest }) => {
	const { payments } = useAppSelector((state) => state.payments);

	const { updatePayment, setIsDayPicked, setPickedDay } = useActions();

	const navigate = useNavigate();

	const payment: IPayment | undefined = payments.find((payment) => payment.lessonId === id);
	const lessonDate: Date = new Date(date);

	const [isActive, setIsActive] = useState<boolean>(false);

	const transitions = {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
	};

	const handleOpenLesson = (): void => {
		setIsDayPicked(false);

		let timeout = 200;

		if (location.pathname !== "/schedule") {
			timeout = 310;
			navigate("/schedule");
		}

		setTimeout(() => {
			setIsDayPicked(true);
			setPickedDay(`${lessonDate.getFullYear()}-${lessonDate.getMonth() + 1}-${lessonDate.getDate()}`);
		}, timeout);
	};

	return (
		<div className="history-item">
			<div className="history-item__main" onClick={() => setIsActive((state) => !state)}>
				{payment && <div className={`history-item__activity${payment.isPaid ? " history-item__activity--active" : ""}`} />}
				<div className="history-item__date">
					{lessonDate.getDate()} {months[lessonDate.getMonth()][0]}
				</div>
				{hasTime && (
					<div className="history-item__time">
						{lessonDate.getHours() < 10 ? `0${lessonDate.getHours()}` : lessonDate.getHours()}:
						{lessonDate.getMinutes() < 10 ? `0${lessonDate.getMinutes()}` : lessonDate.getMinutes()}
					</div>
				)}
			</div>
			<AP mode="wait" initial={false}>
				{isActive && (
					<m.div
						{...transitions}
						className="history-item__wrapper"
						onClick={(event: React.MouseEvent<HTMLDivElement>) => {
							const element = event.target as Element;
							if (!element.closest(".history-item__container")) setIsActive(false);
						}}
					>
						<div className="history-item__container">
							<div className="history-item__header">
								{lessonDate.getDate()} {months[lessonDate.getMonth()][0]} {lessonDate.getFullYear()},{" "}
								{weekdays[(lessonDate.getDay() + 6) % 7]}
							</div>
							<div className="history-item__body">
								<div className="history-item__row">
									<HistoryItemProp
										label="время занятия"
										value={
											hasTime
												? `${lessonDate.getHours() < 10 ? `0${lessonDate.getHours()}` : lessonDate.getHours()}:${
														lessonDate.getMinutes() < 10 ? `0${lessonDate.getMinutes()}` : lessonDate.getMinutes()
												  }`
												: "No time"
										}
									/>
									<HistoryItemProp label="тип занятия" value={isTest ? "Пробное" : "Оплачиваемое"} />
									{payment && !isTest && (
										<HistoryItemProp
											label="статус оплаты"
											value={
												<Switch
													text={{ onText: "Оплачено", offText: "Не оплачено" }}
													textOrientation={TextOrientation.Right}
													type={SwitchType.Correct}
													isChecked={payment.isPaid}
													onClick={(value: boolean) => updatePayment({ id: payment.id, data: { isPaid: value } })}
												/>
											}
										/>
									)}
								</div>
								<div className="history-item__content">
									<HistoryItemProp label="домашнее задание" value={info.homework ? info.homework : "Нет"} />
									<HistoryItemProp label="задачи на занятие" value={info.tasks ? info.tasks : "Нет"} />
									<HistoryItemProp label="заметки к занятию" value={info.note ? info.note : "Нет"} />
									<HistoryItemProp label="остановились на" value={info.stoppedAt ? info.stoppedAt : "Нет"} />
								</div>
								<div className="history-item__footer">
									<button className="link" onClick={handleOpenLesson}>
										<WindowIcon />
										<span>Открыть занятие</span>
									</button>
								</div>
							</div>
						</div>
					</m.div>
				)}
			</AP>
		</div>
	);
};

const HistoryItemProp: FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => {
	return (
		<div className="history-item__prop">
			<div className="history-item__label">{label}</div>
			<div className="history-item__value">{value}</div>
		</div>
	);
};

const Filter: FC<IFilters & { handleChangeFilter: <K extends keyof IFilters>(key: K, value: IFilters[K]) => void }> = ({
	paymentStatus,
	timeStatus,
	handleChangeFilter,
}) => {
	const paymentStatusRus = {
		all: "Все",
		onlyPaid: "Только оплаченные",
		onlyNotPaid: "Только не оплаченные",
	};

	return (
		<div className="history-filter">
			<div className="history-filter__header">
				<FilterIcon />
				<span>Фильтр</span>
			</div>
			<div className="history-filter__body">
				<div className="history-filter__item">
					<div className="history-filter__label">статус оплаты</div>
					<div className="history-filter__options">
						{Object.values(PaymentStatus).map((status, index) => (
							<div
								className={`history-filter__option${status === paymentStatus ? " history-filter__option--active" : ""}`}
								key={index}
								onClick={() => handleChangeFilter("paymentStatus", status)}
							>
								{paymentStatusRus[status as keyof typeof paymentStatusRus]}
							</div>
						))}
					</div>
				</div>
				<div className="history-filter__item">
					<div className="history-filter__label">по времени</div>
					<div className="history-filter__options">
						<div
							onClick={() => handleChangeFilter("timeStatus", "all")}
							className={`history-filter__option${timeStatus === "all" ? " history-filter__option--active" : ""}`}
						>
							За всё время
						</div>
						<div
							onClick={() => handleChangeFilter("timeStatus", { endDate: "", startDate: "" })}
							className={`history-filter__option${timeStatus !== "all" ? " history-filter__option--active" : ""}`}
						>
							Промежуток
						</div>
					</div>
					{timeStatus !== "all" && (
						<div className="history-filter__extra">
							<div className="history-filter__input">
								<div className="history-filter__label">Начальная дата</div>
								<Input
									value={timeStatus.startDate}
									onChange={(value: string) => handleChangeFilter("timeStatus", { ...timeStatus, startDate: value })}
									placeholder="Начальная дата"
									type={InputTypes.date}
								/>
							</div>
							<div className="history-filter__input">
								<div className="history-filter__label">Конечная дата</div>
								<Input
									value={timeStatus.endDate}
									onChange={(value: string) => handleChangeFilter("timeStatus", { ...timeStatus, endDate: value })}
									placeholder="Конечная дата"
									type={InputTypes.date}
								/>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
