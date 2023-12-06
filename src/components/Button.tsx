import { FC } from "react";

export enum ButtonTypes {
	primary = "primary",
	default = "default",
	destructive = "destructive",
}

export enum ButtonIconLocation {
	left = "left",
	right = "right",
}

interface ButtonIcon {
	element: React.ReactNode | null;
	location?: ButtonIconLocation;
}

interface ButtonProps {
	text: string;
	type?: ButtonTypes;
	icon?: ButtonIcon | null;
	disabled?: boolean;
}

const Button: FC<ButtonProps> = ({ text, type = ButtonTypes.default, icon, disabled = false }) => {
	const iconLocationClass = icon ? ` button_${icon.location || ButtonIconLocation.left}-icon` : "";
	const typeClass = "button_" + type;
	const iconClass = icon ? " button_icon" : "";

	return (
		<button className={`button ${typeClass}${iconClass}${iconLocationClass}`} disabled={disabled}>
			<span>{text}</span>
			{icon?.element}
		</button>
	);
};

export default Button;
