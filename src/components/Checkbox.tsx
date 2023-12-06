import { FC } from "react";

import Checkmark from "../icons/checkmark.svg?react";

interface CheckboxProps {
	value: string;
	text?: string;
	state: string[];
	disabled?: boolean;
	onClick: (value: string[]) => void;
}

const Checkbox: FC<CheckboxProps> = ({ value, text, state, disabled, onClick }) => {
	const isChecked = state.includes(value);
	const checkedClass = isChecked ? " checkbox_checked" : "";

	const handleChange = () => {
		if (isChecked) {
			onClick(state.filter((item) => item !== value));
		} else {
			onClick([...state, value]);
		}
	};

	const handleKeyUp = (event: React.KeyboardEvent<HTMLLabelElement>) => {
		if (["Space", "Enter"].includes(event.code)) {
			const input = event.currentTarget.querySelector("input");
			const value = input!.value;

			if (isChecked) {
				onClick(state.filter((item) => item !== value));
			} else {
				onClick([...state, value]);
			}
		}
	};

	return (
		<label
			onKeyUp={handleKeyUp}
			tabIndex={disabled ? undefined : 0}
			aria-disabled={disabled}
			className={`checkbox${checkedClass}`}
		>
			<input onChange={handleChange} type="checkbox" value={value} checked={isChecked} className="checkbox__input" />
			<div className="checkbox__custom">
				<Checkmark />
			</div>
			{text && <div className="checkbox__text plain-text">{text}</div>}
		</label>
	);
};

export default Checkbox;
