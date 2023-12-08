import classNames from "classnames";
import Button, { ButtonTypes } from "../../components/Button";
import Flex, { GapSizes } from "../../components/Flex";
import Input, { InputTypes } from "../../components/Input";
import { useInput } from "../../hooks/useInput";
import "./Auth.scss";

import { FC, useEffect, useState } from "react";
import Banner, { BannerTypes } from "../../components/Banner";
import { NavLink, useNavigate } from "react-router-dom";
import supabase from "../../services/createClient";
import { useActions } from "../../hooks/useActions";
import { useAppSelector } from "../../hooks/useAppSelector";

const SignIn: FC = () => {
	const { isAuthorized } = useAppSelector((state) => state.user);
	const { updateAuthorizedStatus } = useActions();

	const [isFetching, setIsFetching] = useState<boolean>(false);
	const [isFormValid, setIsFormValid] = useState<boolean>(false);
	const [authError, setAuthError] = useState<string>("");

	const email = useInput("", { isEmail: true });
	const password = useInput("", { minLength: 8 });

	const navigate = useNavigate();

	const handleFormSend = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		setIsFetching(true);

		const signIn = async () => {
			const { data, error } = await supabase.auth.signInWithPassword({
				email: email.value,
				password: password.value,
			});

			setIsFetching(false);

			setAuthError("");

			if (data.user !== null) {
				updateAuthorizedStatus(true);

				setTimeout(() => {
					navigate("/app/schedule");
				}, 250);
			}

			if (error) {
				const errorMessages: Record<string, string> = {
					"Invalid login credentials": "Неверная почта и/или пароль",
					"Email not confirmed": "Почта не подтверждена",
				};

				setAuthError(errorMessages[error.message] || "Неизвестная ошибка, попробуйте позднее");
			}
		};

		signIn();
	};

	useEffect(() => {
		setIsFormValid(email.isInputValid && password.isInputValid);
	}, [email.isInputValid, password.isInputValid]);

	useEffect(() => {
		if (isAuthorized === true) {
			navigate("/app/schedule");
		}
	}, [isAuthorized]);

	return (
		<Flex column center gap={GapSizes.gap32} className="auth">
			<h1>авторизация</h1>
			<form action="#" onSubmit={handleFormSend} className="auth-form">
				<Flex column gap={GapSizes.gap24}>
					<Banner visible={authError.length !== 0} text={authError} type={BannerTypes.error} />
					<Flex column gap={GapSizes.gap12}>
						<Input
							disabled={isFetching}
							onChange={email.onChange}
							placeholder="E-mail"
							value={email.value}
							errorMessage="Неверный формат почты"
							isError={email.isDirty && !email.isInputValid}
							onBlur={email.onBlur}
							type={InputTypes.text}
						/>
						<Input
							disabled={isFetching}
							onChange={password.onChange}
							placeholder="Пароль"
							value={password.value}
							errorMessage="Длина пароля должна быть не менее 8 символов"
							isError={password.isDirty && !password.isInputValid}
							onBlur={password.onBlur}
							type={InputTypes.password}
						/>
					</Flex>
					<Flex column vCenter gap={GapSizes.gap12}>
						<Button submit loading={isFetching} disabled={!isFormValid || isFetching} text="Войти" type={ButtonTypes.primary} />
						<NavLink className="link" to="/signup">
							Нет аккаунта
						</NavLink>
					</Flex>
				</Flex>
			</form>
		</Flex>
	);
};

export default SignIn;
