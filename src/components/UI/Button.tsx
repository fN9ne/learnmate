import classNames from "classnames";
import { FC } from "react";

export enum ButtonTypes {
	primary = "primary",
	secondary = "secondary",
	google = "google",
	red = "red",
}

interface ButtonProps {
	type?: ButtonTypes;
	icon?: React.ReactNode;
	disabled?: boolean;
	small?: boolean;
	submit?: boolean;
	loading?: boolean;
	children: React.ReactNode;
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button: FC<ButtonProps> = ({ type = ButtonTypes.primary, icon, disabled, small, submit, loading, children, onClick }) => {
	const buttonClassNames = classNames("button", `button--${type}`, { "button--small": small });

	return (
		<button className={buttonClassNames} type={submit ? "submit" : "button"} disabled={disabled} onClick={onClick}>
			{loading && <span className="button__loader"></span>}
			{icon && !loading && icon}
			<span className="button__content">{children}</span>
		</button>
	);
};

export default Button;
