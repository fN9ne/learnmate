import { FC } from "react";

import { months } from "../../dates/dates";

const CurrentDate: FC = () => {
	const date = new Date();

	return (
		<div className="schedule-block">
			<div className="schedule-current-date">
				<div className="schedule-label">Сейчас</div>
				<div className="schedule-current-date__display">{`${date.getDate()} ${
					months[date.getMonth()][1]
				} ${date.getFullYear()}`}</div>
			</div>
		</div>
	);
};

export default CurrentDate;
