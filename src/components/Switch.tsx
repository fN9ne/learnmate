import { FC } from "react";

export enum SwitchType {
	redngreen = "redngreen",
	primary = "primary",
}

interface SwitchStatedText {
	offText: string;
	onText: string;
}

interface SwitchProps {
	text?: string | SwitchStatedText;
	type?: SwitchType;
	isChecked: boolean;
	onClick: (value: boolean) => void;
	disabled?: boolean;
}

const Switch: FC<SwitchProps> = ({ text, type = SwitchType.primary, onClick, isChecked = false, disabled }) => {
	const typeClass = " switch_" + type;
	const checkedClass = isChecked ? " switch_checked" : "";

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		onClick(event.target.checked);
	};

	const handleKeyUp = (event: React.KeyboardEvent<HTMLLabelElement>) => {
		if (["Space", "Enter"].includes(event.code)) {
			const input = event.currentTarget.querySelector("input");

			input!.checked = !input!.checked;

			onClick(input!.checked);
		}
	};

	const renderText = () => {
		if (typeof text === "string") {
			return text;
		} else if (typeof text === "object") {
			return isChecked ? text.onText : text.offText;
		}
		return "";
	};

	return (
		<label
			aria-disabled={disabled}
			onKeyUp={handleKeyUp}
			tabIndex={disabled ? undefined : 0}
			className={`switch${typeClass}${checkedClass}`}
		>
			<input type="checkbox" onChange={handleChange} checked={isChecked} className="switch__input" />
			<div className="switch__origin">
				<div className="switch__bundle"></div>
			</div>
			{renderText() !== "" && <div className="switch__text plain-text">{renderText()}</div>}
		</label>
	);
};

export default Switch;
