import { useNavigate } from "react-router-dom";
import "./NotFound.scss";

import { FC } from "react";

import Button, { ButtonIconLocation, ButtonTypes } from "../../components/Button";
import BackIcon from "../../icons/arrow_long.svg?react";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const NotFound: FC = () => {
	useDocumentTitle("404");

	const navigate = useNavigate();

	const handleBack = () => navigate("/app/schedule");

	return (
		<div className="notfound">
			<div className="notfound__code">404</div>
			<div className="notfound__textblock">
				<p>
					Кажется, что-то пошло не так. Мы отправили нашего самого ловкого программиста в поисках этой страницы, но пока он играет
					в прятки с кодом. Возможно, он забыл, что сегодня у нас нетренировочный день.
				</p>
			</div>
			<Button text="На главную" icon={{ element: <BackIcon /> }} type={ButtonTypes.primary} onClick={handleBack} />
		</div>
	);
};

export default NotFound;
