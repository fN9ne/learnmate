import Button, { ButtonTypes } from "@/components/UI/Button";
import Input, { InputTypes } from "@/components/UI/Input";
import { useInput } from "@/hooks/useInput";
import classNames from "classnames";
import { FC, FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import EmailIcon from "@icons/email.svg?react";
import PasswordIcon from "@icons/password.svg?react";
import GoogleIcon from "@icons/google.svg?react";
import ArrowBackIcon from "@icons/arrowBack.svg?react";

import supabase from "@/utils/supabase";

import sha256 from "crypto-js/sha256";
import Loader from "@/components/Loader";
import { useActions } from "@/hooks/useActions";

import { AnimatePresence as AP, motion as m } from "framer-motion";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const errorMessages = {
	"Invalid login credentials": "Неверный логин и/или пароль.",
	"Email already registered": "Электронная почта уже зарегистрирована.",
	"Password too weak": "Пароль слишком слабый. Убедитесь, что ваш пароль соответствует требованиям безопасности.",
	"User already registered": "Пользователь уже зарегистрирован.",
	"Invalid email format": "Некорректный формат электронной почты.",
	"Internal server error": "Внутренняя ошибка сервера. Пожалуйста, попробуйте позже.",
	"Network error": "Ошибка сети. Проверьте ваше интернет-соединение и попробуйте снова.",
	"Unauthorized request": "Несанкционированный запрос.",
	"Email rate limit exceeded": "Превышен лимит отправки писем. Пожалуйста, попробуйте позже.",
};

const logInWithGoogle = async () => {
	await supabase.auth.signInWithOAuth({
		provider: "google",
		options: {
			redirectTo: "https://learnmate.vercel.app/schedule",
			scopes: "",
		},
	});
};

export enum AuthorizationTypes {
	login = "login",
	signup = "signup",
	email = "email",
}

interface AuthorizationProps {
	type: AuthorizationTypes;
}

const Authorization: FC<AuthorizationProps> = ({ type }) => {
	const { authorizedUser } = useAppSelector((state) => state.global);

	const content = {
		login: <LogInForm />,
		signup: <SignUpForm />,
		email: <EmailConfirm />,
	};

	const transitions = {
		initial: { opacity: 0, x: 50 },
		animate: { opacity: 1, x: 0 },
		exit: { opacity: 0, x: 50 },
	};

	const navigate = useNavigate();

	useEffect(() => {
		if (authorizedUser) {
			navigate("/schedule");
		}
	}, [authorizedUser]);

	return (
		<div className="authorization">
			<div className="authorization__content">
				<m.div {...transitions} transition={{ duration: 0.3, ease: "easeOut" }}>
					{content[type as AuthorizationTypes]}
				</m.div>
			</div>
		</div>
	);
};

export default Authorization;

interface FormProps {
	title?: string;
	desc?: string;
	className?: string;
	buttonText?: string;
	footer?: React.ReactNode;
	error?: string;
	isFormValid?: boolean;
	isFetching?: boolean;
	onSubmit: () => void;
	children: React.ReactNode;
}

const Form: FC<FormProps> = ({
	title,
	desc,
	className,
	buttonText = "Отправить",
	error,
	isFormValid,
	isFetching,
	footer,
	onSubmit,
	children,
}) => {
	const formClassNames = classNames("form", className, { "form--fetching": isFetching });
	const formErrorClassNames = classNames("text", "text--error", "form__error", { "form__error--active": error });

	const handleSendForm = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		onSubmit();
	};

	return (
		<form action="#" onSubmit={handleSendForm} className={formClassNames}>
			{isFetching !== undefined && <Loader className="form__loader" isFetching={isFetching} />}
			{title && <h1>{title}</h1>}
			{desc && <div className="text text--n text--center form__description">{desc}</div>}
			<div className="form__body">{children}</div>
			<div className={formErrorClassNames}>{error}</div>
			<Button submit disabled={isFormValid !== undefined ? !isFormValid : false}>
				{buttonText}
			</Button>
			{footer && <div className="form__footer">{footer}</div>}
		</form>
	);
};

const LogInForm: FC = () => {
	useDocumentTitle("Вход");

	const login = useInput("", {});
	const password = useInput("", {});

	const [formError, setFormError] = useState<string>("");
	const [isFetching, setIsFetching] = useState<boolean>(false);

	const { setAuthorizedUser, setGoogleAuthProgress } = useActions();

	const navigate = useNavigate();

	const handleLogIn = () => {
		setFormError("");

		const logIn = async () => {
			setIsFetching(true);

			const { data, error } = await supabase.auth.signInWithPassword({
				email: login.value,
				password: sha256(password.value) + "",
			});

			if (error) {
				setFormError(
					errorMessages[error.message as keyof typeof errorMessages] || "Произошла непредвиденная ошибка. Попробуйте снова."
				);
			} else {
				setAuthorizedUser(data.user!.email!);

				setTimeout(() => {
					navigate("/schedule");
				}, 100);
			}

			setIsFetching(false);
		};

		logIn();
	};

	const handleGoogleAuth = () => {
		logInWithGoogle();
		setAuthorizedUser("proccessing");
		setGoogleAuthProgress(true);
	};

	return (
		<Form
			title="Авторизация"
			desc="Для входа в Learnmate войдите с помощью Google или же введите ваши действительные почту и пароль."
			className="authorization-form"
			onSubmit={handleLogIn}
			buttonText="Войти"
			error={formError}
			isFetching={isFetching}
			footer={
				<div className="text text--na">
					Ещё не зарегистрированы?{" "}
					<Link to="/signup" className="link">
						Создать аккаунт
					</Link>
				</div>
			}
		>
			<Button icon={<GoogleIcon />} type={ButtonTypes.google} onClick={handleGoogleAuth}>
				Войти с помощью Google
			</Button>
			<div className="authorization-form__delimiter">ИЛИ</div>
			<div className="authorization-form__inputs">
				<Input icon={<EmailIcon />} value={login.value} onChange={login.onChange} placeholder=" Почта" />
				<Input
					icon={<PasswordIcon />}
					value={password.value}
					onChange={password.onChange}
					placeholder=" Пароль"
					type={InputTypes.password}
					isShowPassword
				/>
			</div>
		</Form>
	);
};

const SignUpForm: FC = () => {
	useDocumentTitle("Регистрация");

	const email = useInput("", { isEmail: true });
	const password = useInput("", { minLength: 8 });
	const passwordConfirm = useInput("", { minLength: 8 });

	const [formError, setFormError] = useState<string>("");
	const [isFormValid, setIsFormValid] = useState<boolean>(false);
	const [isFetching, setIsFetching] = useState<boolean>(false);

	const { setStoredEmail: setEmail, setAuthorizedUser, setGoogleAuthProgress } = useActions();

	useEffect(() => {
		setIsFormValid(email.isInputValid && password.isInputValid && password.value === passwordConfirm.value);
	}, [email.isInputValid, password.value, passwordConfirm.value]);

	const navigate = useNavigate();

	const handleSignUp = () => {
		setFormError("");

		const signUp = async () => {
			setIsFetching(true);

			const { error } = await supabase.auth.signUp({
				email: email.value,
				password: sha256(password.value) + "",
				options: {
					emailRedirectTo: "https://learnmate.vercel.app/schedule",
				},
			});

			if (error) {
				setFormError(
					errorMessages[error.message as keyof typeof errorMessages] || "Произошла непредвиденная ошибка. Попробуйте снова."
				);
			} else {
				setEmail(email.value);

				setTimeout(() => {
					navigate("/email-confirm");
				}, 100);
			}

			setIsFetching(false);
		};

		if (isFormValid) signUp();
	};

	const handleGoogleAuth = () => {
		logInWithGoogle();
		setAuthorizedUser("proccessing");
		setGoogleAuthProgress(true);
	};

	return (
		<Form
			onSubmit={handleSignUp}
			buttonText="Зарегистрироваться"
			className="signup-form"
			desc="Для регистрации в Learnmate войдите с помощью Google или зарегистрируйте аккаунт используя почту."
			title="Регистрация"
			isFormValid={isFormValid}
			error={formError}
			isFetching={isFetching}
			footer={
				<div className="text text--na">
					Уже есть аккаунт?{" "}
					<Link to="/login" className="link">
						Войти
					</Link>
				</div>
			}
		>
			<Button icon={<GoogleIcon />} type={ButtonTypes.google} onClick={handleGoogleAuth}>
				Войти с помощью Google
			</Button>
			<div className="authorization-form__delimiter">ИЛИ</div>
			<div className="authorization-form__inputs">
				<Input
					value={email.value}
					onChange={email.onChange}
					onBlur={email.onBlur}
					icon={<EmailIcon />}
					isError={email.isDirty && !email.isInputValid}
					errorMessage="Неверный формат почты"
					placeholder=" Почта"
				/>
				<Input
					value={password.value}
					onChange={password.onChange}
					onBlur={password.onBlur}
					icon={<PasswordIcon />}
					isError={password.isDirty && !password.isInputValid}
					errorMessage="Пароль должен быть не менее 8 символов"
					placeholder=" Пароль"
					type={InputTypes.password}
					isShowPassword
				/>
				<Input
					value={passwordConfirm.value}
					onChange={passwordConfirm.onChange}
					onBlur={passwordConfirm.onBlur}
					icon={<PasswordIcon />}
					isError={passwordConfirm.isDirty && (!passwordConfirm.isInputValid || passwordConfirm.value !== password.value)}
					errorMessage="Пароли должны совпадать"
					placeholder=" Повторите пароль"
					type={InputTypes.password}
					isShowPassword
				/>
			</div>
		</Form>
	);
};

const EmailConfirm: FC = () => {
	useDocumentTitle("Подтверждение почты");

	const [timer, setTimer] = useState<number | null>(30);
	const [formError, setFormError] = useState<string>("");
	const [isFetching, setIsFetching] = useState<boolean>(false);

	const { storedEmail: email } = useAppSelector((state) => state.global);

	useEffect(() => {
		let countdown: NodeJS.Timeout | null = null;

		if (timer !== null && timer > 0) {
			countdown = setInterval(() => {
				setTimer((prevTimer) => (prevTimer !== null ? prevTimer - 1 : null));
			}, 1000);
		} else if (timer === 0) {
			setTimer(null);
		}

		return () => {
			if (countdown) {
				clearInterval(countdown);
			}
		};
	}, [timer]);

	const handleResend = () => {
		const resendEmail = async () => {
			if (email !== null) {
				setIsFetching(true);

				const { error } = await supabase.auth.resend({
					email,
					type: "signup",
					options: {
						emailRedirectTo: "https://learnmate.vercel.app/schedule",
					},
				});

				if (error) {
					setFormError(
						errorMessages[error.message as keyof typeof errorMessages] || "Произошла непредвиденная ошибка. Попробуйте снова."
					);
				} else {
					setFormError("");
					setTimer(30);
				}

				setIsFetching(false);
			}
		};

		resendEmail();
	};

	const getTime = (time: number | null): string => {
		if (time === null) return "00:00";

		const minutes = Math.floor(time / 60);
		const seconds = time % 60;

		return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
	};

	const transitions = {
		initial: { opacity: 0, scale: 0.95 },
		animate: { opacity: 1, scale: 1 },
		exit: { opacity: 0, scale: 0.95 },
	};

	return (
		<div className="email-confirm">
			{isFetching && <Loader isFetching={isFetching} className="form__loader" />}
			<h1>Подтвердите почту</h1>
			<div className="text text--n text--center email-confirm__description">
				Пожалуйста, подтвердите свой адрес электронной почты, чтобы завершить регистрацию на сайте Learnmate.
			</div>
			<Button onClick={handleResend} disabled={timer !== null}>
				Отправить повторно
			</Button>
			<AP mode="wait" initial={false}>
				{timer !== null && (
					<m.div className="text text--na" {...transitions}>
						Отправить снова через <span className="text text--primary">{getTime(timer)}</span>
					</m.div>
				)}
			</AP>
			<AP mode="wait" initial={false}>
				{formError !== "" && (
					<>
						<m.div className="email-confirm__footer" {...transitions}>
							<div className="email-confirm__error text text--center text--error">{formError}</div>
							<Link to="/login" className="link">
								<ArrowBackIcon />
								<span>Вернуться назад</span>
							</Link>
						</m.div>
					</>
				)}
			</AP>
		</div>
	);
};
