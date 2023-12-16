import { FC } from "react";

export enum ButtonTypes {
	primary = "primary",
	default = "default",
	error = "error",
	positive = "positive",
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
	submit?: boolean;
	loading?: boolean;
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button: FC<ButtonProps> = ({ text, type = ButtonTypes.default, loading, icon, disabled = false, submit, onClick }) => {
	const iconLocationClass = icon ? ` button_${icon.location || ButtonIconLocation.left}-icon` : "";
	const typeClass = "button_" + type;
	const iconClass = icon ? " button_icon" : "";

	return (
		<button
			type={submit ? "submit" : "button"}
			onClick={onClick}
			className={`button ${typeClass}${iconClass}${iconLocationClass}`}
			disabled={disabled}
		>
			{loading && <div className="button-loader" />}
			<span>{text}</span>
			{icon?.element}
		</button>
	);
};

export default Button;
