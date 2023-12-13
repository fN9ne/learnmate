import { useParams } from "react-router-dom";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import "./Student.scss";

import { FC } from "react";

const Student: FC = () => {
	const params = useParams();

	useDocumentTitle(`${params.username}`);

	return <div>Student</div>;
};

export default Student;
