import classNames from "classnames";
import { FC } from "react";

interface RadioProps {
	name: string;
	value: string;
	currentValue: string;
	disabled?: boolean;
	children?: React.ReactNode;
	onClick: (value: string) => void;
}

const Radio: FC<RadioProps> = ({ name, value, currentValue, disabled, children, onClick }) => {
	const isChecked = value === currentValue;

	const radioClassNames = classNames("radio", { "radio--checked": isChecked }, { "radio--disabled": disabled });

	const handleChange = () => onClick(value);

	return (
		<label className={radioClassNames}>
			<input type="radio" className="radio__input" onChange={handleChange} name={name} value={value} checked={isChecked} />
			<div className="radio__custom"></div>
			{children && <div className="radio__text">{children}</div>}
		</label>
	);
};

export default Radio;
