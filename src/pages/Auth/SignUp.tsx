import { NavLink, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../hooks/useAppSelector";
import "./Auth.scss";

import { FC, useEffect, useState } from "react";
import Flex, { GapSizes } from "../../components/Flex";
import Banner, { BannerTypes } from "../../components/Banner";
import Input, { InputTypes } from "../../components/Input";
import Button, { ButtonTypes } from "../../components/Button";
import { useInput } from "../../hooks/useInput";
import supabase from "../../services/createClient";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const SignUp: FC = () => {
	useDocumentTitle("Регистрация");

	const { isAuthorized } = useAppSelector((state) => state.user);

	const [isFetching, setIsFetching] = useState<boolean>(false);
	const [isFormValid, setIsFormValid] = useState<boolean>(false);
	const [registrationError, setRegistrationError] = useState<string>("");

	const username = useInput("", { minLength: 5 });
	const email = useInput("", { isEmail: true });
	const password = useInput("", { minLength: 8 });
	const passwordConfirm = useInput("", {});

	const navigate = useNavigate();

	const handleFormSend = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		setIsFetching(true);

		const signUp = async () => {
			const { data, error } = await supabase.auth.signUp({
				email: email.value,
				password: password.value,
				options: {
					data: {
						username: username.value,
					},
					emailRedirectTo: "http://localhost:5173/check-email/confirmed",
				},
			});

			const createUserTables = async () => {
				const schedules = await supabase.from("schedules").insert({ author_email: email.value.toLowerCase(), schedule: [] });
				const students = await supabase.from("students").insert({ author_email: email.value.toLowerCase(), students: [] });
				const payments = await supabase.from("payments").insert({ author_email: email.value.toLowerCase(), payments: [] });
				const learningPlan = await supabase.from("learning_plan").insert({ author_email: email.value.toLowerCase(), books: [] });

				console.log(schedules.error, students.error, payments.error, learningPlan.error);
			};

			setIsFetching(false);

			setRegistrationError("");

			if (data.user !== null) {
				if (data.user.identities?.length === 0) {
					setRegistrationError("Пользователь с такой почтой уже зарегистрирован");
				} else {
					createUserTables();
					setTimeout(() => navigate("/check-email"), 500);
				}
			}

			if (error) {
				const errors: Record<string, string> = {
					"Email rate limit exceeded": "Превышен лимит скорости отправки писем",
				};

				setRegistrationError(errors[error.message] || "Неизвестная ошибка, попробуйте позднее");
			}
		};

		signUp();
	};

	useEffect(() => {
		setIsFormValid(
			username.isInputValid && email.isInputValid && password.isInputValid && password.value === passwordConfirm.value
		);
	}, [username.isInputValid && email.isInputValid, password.isInputValid, password.value, passwordConfirm.value]);

	useEffect(() => {
		if (isAuthorized) navigate("/app/schedule");
	}, [isAuthorized]);

	return (
		<Flex column center gap={GapSizes.gap32} className="auth">
			<h1>авторизация</h1>
			<form action="#" onSubmit={handleFormSend} className={"auth-form"}>
				<Flex column gap={GapSizes.gap24}>
					<Banner visible={registrationError.length !== 0} text={registrationError} type={BannerTypes.error} />
					<Flex column gap={GapSizes.gap16}>
						<Input
							disabled={isFetching}
							onChange={username.onChange}
							placeholder="Имя пользователя"
							value={username.value}
							errorMessage="Длина логина должна быть не менее 5 символов"
							isError={username.isDirty && !username.isInputValid}
							onBlur={username.onBlur}
							required
							type={InputTypes.text}
						/>
						<Input
							disabled={isFetching}
							onChange={email.onChange}
							placeholder="E-mail"
							value={email.value}
							errorMessage="Неверный формат почты"
							isError={email.isDirty && !email.isInputValid}
							onBlur={email.onBlur}
							required
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
							required
							type={InputTypes.password}
						/>
						<Input
							disabled={isFetching}
							onChange={passwordConfirm.onChange}
							placeholder="Повторите Пароль"
							value={passwordConfirm.value}
							errorMessage="Пароли не совпадают"
							isError={passwordConfirm.isDirty && password.value !== passwordConfirm.value}
							onBlur={passwordConfirm.onBlur}
							required
							type={InputTypes.password}
						/>
					</Flex>
					<Flex column vCenter gap={GapSizes.gap12}>
						<Button
							submit
							loading={isFetching}
							disabled={!isFormValid || isFetching}
							text="Зарегистрироваться"
							type={ButtonTypes.primary}
						/>
						<NavLink className="link" to="/signin">
							Уже зарегистрирован
						</NavLink>
					</Flex>
				</Flex>
			</form>
		</Flex>
	);
};

export default SignUp;
