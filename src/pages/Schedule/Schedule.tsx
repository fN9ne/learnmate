import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { FC, useEffect, useState } from "react";

import ScheduleIcon from "@icons/schedule.svg?react";
import Block from "@/components/UI/Block";
import Calendar, { MonthChanger } from "./Calendar";

import { AnimatePresence as AP, motion as m } from "framer-motion";
import { useAppSelector } from "@/hooks/useAppSelector";
import Redactor from "./Redactor";
import Loader from "@/components/Loader";

const Schedule: FC = () => {
	/* picked day */

	const { isDayPicked } = useAppSelector((state) => state.global);
	const [isCalendarActive, setIsCalendarActive] = useState<boolean>(!isDayPicked);
	const { isFetching } = useAppSelector((state) => state.lessons);

	/* general */

	useDocumentTitle("Расписание");

	/* datetime */

	const [date, setDate] = useState<Date>(new Date());

	const handlePrevMonth = (): void => {
		if (date.getMonth() - 1 < 0) {
			setDate(new Date(date.getFullYear() - 1, 11));
		} else {
			setDate(new Date(date.getFullYear(), date.getMonth() - 1));
		}
	};
	const handleNextMonth = (): void => {
		if (date.getMonth() + 1 > 11) {
			setDate(new Date(date.getFullYear() + 1, 0));
		} else {
			setDate(new Date(date.getFullYear(), date.getMonth() + 1));
		}
	};
	const handleReset = (): void => {
		setDate(new Date());
	};

	const transitions = {
		initial: { opacity: 0, y: -20 },
		animate: { opacity: 1, y: 0 },
		exit: { opacity: 0, y: -20 },
	};

	useEffect(() => {
		setIsCalendarActive(!isDayPicked);
	}, [isDayPicked]);

	return (
		<div className="schedule">
			<div className="schedule__container">
				<AP mode="wait" initial={false}>
					{isFetching ? (
						<Loader isFetching={isFetching} className="schedule__loader" />
					) : (
						<>
							{isCalendarActive && (
								<m.div key="calendar" className="schedule__calendar" {...transitions}>
									<Block
										icon={<ScheduleIcon />}
										title="Расписание"
										headerContent={
											<MonthChanger
												year={date.getFullYear()}
												month={date.getMonth()}
												prevMonth={handlePrevMonth}
												reset={handleReset}
												nextMonth={handleNextMonth}
											/>
										}
									>
										<Calendar date={date} />
									</Block>
								</m.div>
							)}
							{isDayPicked && (
								<m.div key="dayRedactor" className={`schedule__redactor`} {...transitions}>
									<Redactor />
								</m.div>
							)}
						</>
					)}
				</AP>
			</div>
		</div>
	);
};

export default Schedule;
