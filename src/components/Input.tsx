import classNames from "classnames";
import { FC, useState } from "react";

import Visibility from "../icons/visibility.svg?react";
import VisibilityOff from "../icons/visibility-off.svg?react";

export enum InputTypes {
	text = "text",
	password = "password",
}

interface InputProps {
	placeholder: string;
	value: string;
	onBlur?: () => void;
	onChange: (value: string) => void;
	type?: InputTypes;
	required?: boolean;
	disabled?: boolean;
	isError?: boolean;
	errorMessage?: string;
}

const Input: FC<InputProps> = ({
	placeholder,
	value,
	onChange,
	onBlur,
	type = InputTypes.text,
	required,
	disabled,
	isError,
	errorMessage,
}) => {
	const [isFocus, setIsFocus] = useState<boolean>(false);
	const [isEmpty, setIsEmpty] = useState<boolean>(value.length === 0);

	const [isPasswordHidden, setIsPasswordHidden] = useState<boolean>(true);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;

		onChange(value);
		setIsEmpty(value.length === 0);
	};

	const placeholderClasses = classNames("input__placeholder", { input__placeholder_required: required });
	const inputClasses = classNames("input", { input_disabled: disabled }, { input_focused: isFocus }, { input_filled: !isEmpty });
	const errorClasses = classNames("input__error", { input__error_active: isError });
	const showPasswordClasses = classNames("input__show-password", { "input__show-password_active": !isPasswordHidden });

	const handleFocus = () => setIsFocus(true);

	const handleBlur = () => {
		setIsFocus(false);

		if (onBlur) onBlur();
	};

	return (
		<div className={inputClasses}>
			<div className={placeholderClasses}>{placeholder}</div>
			<input
				type={type === InputTypes.password ? (isPasswordHidden ? "password" : "text") : type}
				value={value}
				onFocus={handleFocus}
				onBlur={handleBlur}
				onChange={handleChange}
				disabled={disabled}
			/>
			{type === InputTypes.password && (
				<div onClick={() => setIsPasswordHidden((prev) => !prev)} className={showPasswordClasses}>
					{isPasswordHidden ? <Visibility /> : <VisibilityOff />}
				</div>
			)}
			<div className={errorClasses}>{errorMessage}</div>
		</div>
	);
};

export default Input;
