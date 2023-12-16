import classNames from "classnames";
import { FC } from "react";

interface DescriptionProps {
	children: React.ReactNode;
	className?: string;
}

const Description: FC<DescriptionProps> = ({ children }) => {
	const descriptionClassName = classNames("description");

	return <div className={descriptionClassName}>{children}</div>;
};

export default Description;
