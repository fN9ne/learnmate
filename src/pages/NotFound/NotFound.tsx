import { useNavigate } from "react-router-dom";
import "./NotFound.scss";

import { FC } from "react";

import Button, { ButtonIconLocation, ButtonTypes } from "../../components/Button";
import BackIcon from "../../icons/arrow_long.svg?react";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const NotFound: FC = () => {
	useDocumentTitle("404");

	const navigate = useNavigate();

	const handleBack = () => navigate("/welcome");

	return (
		<div>
			<h1>404: NotFound</h1>
			<Button
				text="Вернуться на главную"
				type={ButtonTypes.primary}
				icon={{ element: <BackIcon />, location: ButtonIconLocation.right }}
				onClick={handleBack}
			/>
		</div>
	);
};

export default NotFound;
