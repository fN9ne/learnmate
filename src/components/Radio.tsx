import { FC } from "react";

interface RadioProps {
	name: string;
	value: string;
	text?: string;
	currentValue: string;
	disabled?: boolean;
	onClick: (value: string) => void;
}

const Radio: FC<RadioProps> = ({ text, name, value, onClick, currentValue, disabled }) => {
	const isChecked = value === currentValue;
	const checkedClass = isChecked ? " radio_checked" : "";

	const handleChange = () => onClick(value);

	const handleKeyUp = (event: React.KeyboardEvent<HTMLLabelElement>) => {
		if (["Space", "Enter"].includes(event.code)) {
			onClick(event.currentTarget.querySelector("input")!.value);
		}
	};

	return (
		<label tabIndex={disabled ? undefined : 0} onKeyUp={handleKeyUp} aria-disabled={disabled} className={`radio${checkedClass}`}>
			<input className="radio__input" type="radio" onChange={handleChange} name={name} value={value} checked={isChecked} />
			<div className="radio__custom"></div>
			{text && <div className="radio__text plain-text">{text}</div>}
		</label>
	);
};

export default Radio;
