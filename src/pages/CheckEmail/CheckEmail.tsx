import { useNavigate, useParams } from "react-router-dom";
import Description from "../../components/Description";
import Flex, { GapSizes } from "../../components/Flex";
import "./CheckEmail.scss";

import { FC } from "react";
import Button, { ButtonIconLocation, ButtonTypes } from "../../components/Button";

import ArrowIcon from "../../icons/arrow_long.svg?react";
import { useActions } from "../../hooks/useActions";

const CheckEmail: FC = () => {
	const { updateAuthorizedStatus, updateEmail } = useActions();

	const params = useParams();

	const navigate = useNavigate();

	if (Object.entries(params).length > 0) {
		const handleStart = () => {
			navigate("/app/schedule");

			const userData = localStorage.getItem(`sb-${import.meta.env.VITE_SUPABASE_NAME}-auth-token`);

			if (userData) {
				const user = JSON.parse(userData);

				updateAuthorizedStatus(true);
				updateEmail(user.user.email);
			}
		};

		return (
			<Flex className="check-email" column center gap={GapSizes.gap24}>
				<h1>Почта подтверждена!</h1>
				<Description>
					Рады сообщить, что ваша электронная почта успешно подтверждена! Текперь вы можете в полной мере ползоваться всеми
					возможностями нашего сервиса. Благодарим вас за регистрацию и желаем приятного использования нашего сервиса!
				</Description>
				<Button
					text="Начать"
					icon={{ element: <ArrowIcon />, location: ButtonIconLocation.right }}
					type={ButtonTypes.primary}
					onClick={handleStart}
				/>
			</Flex>
		);
	} else {
		return (
			<Flex className="check-email" column center gap={GapSizes.gap24}>
				<h1>Спасибо за регистрацию!</h1>
				<Description>
					Кристофер, ответственный за отправку уведомлений, только что сообщил, что уже направил вам электронное письмо для
					завершения регистрации. Просим вас проверить вашу почту.
				</Description>
			</Flex>
		);
	}
};

export default CheckEmail;
