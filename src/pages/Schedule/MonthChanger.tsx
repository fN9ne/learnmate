import { FC } from "react";

import ArrowIcon from "../../icons/arrow_left.svg?react";

interface MonthChangerProps {
	handlePrevMonth: () => void;
	handleNextMonth: () => void;
	handleReset: () => void;
	date: string;
}

const MonthChanger: FC<MonthChangerProps> = ({ handleNextMonth, handlePrevMonth, handleReset, date }) => {
	return (
		<div className="schedule-block">
			<div className="schedule-month-changer">
				<div onClick={handlePrevMonth} className="schedule-month-changer__arrow schedule-month-changer__arrow_prev">
					<ArrowIcon />
				</div>
				<div title="Вернуть текущий месяц" onClick={handleReset} className="schedule-month-changer__display">
					{date}
				</div>
				<div onClick={handleNextMonth} className="schedule-month-changer__arrow schedule-month-changer__arrow_next">
					<ArrowIcon />
				</div>
			</div>
		</div>
	);
};

export default MonthChanger;
