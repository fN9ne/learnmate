import classNames from "classnames";
import { FC, useState } from "react";

import EyeOffIcon from "@icons/eyeOff.svg?react";
import EyeIcon from "@icons/eye.svg?react";

import CaretsIcon from "@icons/carets.svg?react";
import DateIcon from "@icons/datepicker.svg?react";

export enum InputTypes {
	text = "text",
	password = "password",
	number = "number",
	date = "date",
}

interface InputProps {
	icon?: React.ReactNode;
	type?: InputTypes;
	value: string;
	placeholder?: string;
	disabled?: boolean;
	isError?: boolean;
	isShowPassword?: boolean;
	errorMessage?: string;
	step?: number;
	min?: number;
	max?: number;
	onBlur?: () => void;
	onChange: (value: string) => void;
}

const Input: FC<InputProps> = ({
	icon,
	type = InputTypes.text,
	value,
	placeholder,
	disabled,
	isError,
	step,
	isShowPassword,
	errorMessage,
	max,
	min,
	onBlur,
	onChange,
}) => {
	const [isFocused, setIsFocused] = useState<boolean>(false);
	const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

	const inputClassNames = classNames(
		"input",
		{ "input--error": isError },
		{ "input--filled": value.length > 0 },
		{ "input--disabled": disabled },
		{ "input--icon": icon },
		{ "input--focused": isFocused }
	);

	const getInputType = (): string => {
		if (isShowPassword) {
			if (isPasswordVisible) return "text";

			return "password";
		}

		return type;
	};

	return (
		<div className={inputClassNames}>
			{icon && <div className="input__icon">{icon}</div>}
			<input
				type={getInputType()}
				placeholder={placeholder}
				value={value}
				onBlur={() => {
					setIsFocused(false);
					if (onBlur) onBlur();
				}}
				step={step}
				min={min}
				max={max}
				onFocus={() => setIsFocused(true)}
				disabled={disabled}
				onChange={(event) => onChange(event.target.value)}
			/>
			{type === InputTypes.number && <CaretsIcon className="input__carets" />}
			{type === InputTypes.date && <DateIcon className="input__date" />}
			{isShowPassword && (
				<button className="input__toggle-password" type="button" onClick={() => setIsPasswordVisible((state) => !state)}>
					{isPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
				</button>
			)}
			{isError && <div className="text text--s text--error input__error">{errorMessage}</div>}
		</div>
	);
};

export default Input;
