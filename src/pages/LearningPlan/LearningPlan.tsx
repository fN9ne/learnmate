import useDocumentTitle from "../../hooks/useDocumentTitle";
import "./LearningPlan.scss";

import { FC } from "react";

const LearningPlan: FC = () => {
	useDocumentTitle("Учебный план");

	return <div>LearningPlan</div>;
};

export default LearningPlan;
