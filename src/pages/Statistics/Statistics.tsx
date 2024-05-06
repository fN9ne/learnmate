import "./Statistics.scss";

import { FC, useEffect } from "react";

const Statistics: FC = () => {
	useEffect(() => {
		localStorage.setItem("newpage", "statistics");
	}, []);

	return (
		<div className="statistics">
			<div className="statistics__temp">Страница статистики находится в разработке.</div>
		</div>
	);
};

export default Statistics;
