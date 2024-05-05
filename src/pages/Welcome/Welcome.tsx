import "./Welcome.scss";

import Button, { ButtonIconLocation, ButtonTypes } from "../../components/Button";

import { FC, useEffect } from "react";

import ArrowLong from "../../icons/arrow_long.svg?react";
import Description from "../../components/Description";
import { useNavigate } from "react-router-dom";
import Flex, { GapSizes } from "../../components/Flex";
import { useAppSelector } from "../../hooks/useAppSelector";

const Welcome: FC = () => {
	const { isAuthorized } = useAppSelector((state) => state.user);

	const navigate = useNavigate();

	const handleStart = () => navigate("/signin");

	useEffect(() => {
		if (isAuthorized) navigate("/app/schedule");
	}, [isAuthorized]);

	return (
		<Flex className="welcome" column center gap={GapSizes.gap24}>
			<h1>{"LearnMate - Твой помощник в обучении!"}</h1>
			<Description>
				{
					"Создавайте расписание, добавляйте учеников, отмечайте уроки, устанавливайте цену и следите за платежами - все в одном приложении! LearnMate - ваш ключ к эффективному обучению и управлению занятиями."
				}
			</Description>
			<Button
				text="Опробовать"
				onClick={handleStart}
				icon={{ element: <ArrowLong />, location: ButtonIconLocation.right }}
				type={ButtonTypes.primary}
			/>
		</Flex>
	);
};

export default Welcome;
