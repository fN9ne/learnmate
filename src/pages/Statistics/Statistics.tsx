import "./Statistics.scss";

import { FC, useEffect } from "react";

const Statistics: FC = () => {
	useEffect(() => {
		localStorage.setItem("newpage", "statistics");
	}, []);

	return <div className="statistics"></div>;
};

export default Statistics;
