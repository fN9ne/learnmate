import classNames from "classnames";
import { FC } from "react";

export enum TextOrientation {
	Left = "left",
	Right = "right",
}

export enum SwitchType {
	Default = "default",
	Correct = "correct",
}

interface SwitchStatedText {
	offText: string;
	onText: string;
}

interface SwitchProps {
	isChecked: boolean;
	disabled?: boolean;
	textOrientation?: TextOrientation;
	text?: string | SwitchStatedText;
	type?: SwitchType;
	onClick: (value: boolean) => void;
}

const Switch: FC<SwitchProps> = ({
	isChecked,
	disabled,
	text,
	textOrientation = TextOrientation.Left,
	type = SwitchType.Default,
	onClick,
}) => {
	const switchClassNames = classNames(
		"switch",
		`switch--${type}`,
		{ "switch--checked": isChecked },
		{ "switch--disabled": disabled },
		{ "switch--text-right": textOrientation === TextOrientation.Right }
	);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => onClick(event.target.checked);

	const renderText = (): string => {
		if (typeof text === "string") {
			return text;
		} else if (typeof text === "object") {
			return isChecked ? text.onText : text.offText;
		}
		return "";
	};

	return (
		<button className="switch-wrapper">
			<label className={switchClassNames}>
				<input type="checkbox" onChange={handleChange} checked={isChecked} className="switch__input" />
				<div className="switch__origin">
					<div className="switch__bundle"></div>
				</div>
				{renderText() !== "" && <div className="switch__text">{renderText()}</div>}
			</label>
		</button>
	);
};

export default Switch;
