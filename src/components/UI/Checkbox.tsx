import { FC } from "react";

import classNames from "classnames";

import CheckmarkIcon from "@icons/checkmark.svg?react";

interface CheckboxProps {
	value: string;
	state: string[];
	disabled?: boolean;
	children?: React.ReactNode;
	onClick: (value: string[]) => void;
}

const Checkbox: FC<CheckboxProps> = ({ value, state, disabled, children, onClick }) => {
	const isChecked = state.includes(value);

	const checkboxClassNames = classNames("checkbox", { "checkbox--checked": isChecked }, { "checkbox--disabled": disabled });

	const handleChange = (): void => {
		if (isChecked) onClick(state.filter((item) => item !== value));
		else onClick([...state, value]);
	};

	return (
		<label className={checkboxClassNames}>
			<input type="checkbox" onChange={handleChange} value={value} checked={isChecked} className="checkbox__input" />
			<div className="checkbox__custom">
				<CheckmarkIcon />
			</div>
			{children && <div className="checkbox__text">{children}</div>}
		</label>
	);
};

export default Checkbox;
