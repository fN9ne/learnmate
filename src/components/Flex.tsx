import classNames from "classnames";
import { FC } from "react";

export enum GapSizes {
	gap4 = "gap4",
	gap8 = "gap8",
	gap12 = "gap12",
	gap16 = "gap16",
	gap20 = "gap20",
	gap24 = "gap24",
	gap32 = "gap32",
	gap40 = "gap40",
	gap48 = "gap48",
	gap72 = "gap72",
	gap96 = "gap96",
}

interface FlexProps {
	className?: string;
	vCenter?: boolean;
	hCenter?: boolean;
	center?: boolean;
	column?: boolean;
	gap?: GapSizes;
	children?: React.ReactNode;
}

const Flex: FC<FlexProps> = ({ className, vCenter, hCenter, center, column, gap, children }) => {
	const elementClasses = classNames(
		"flexbox",
		className,
		{ "flexbox_vertical-center": vCenter },
		{ "flexbox_horizontal-center": hCenter },
		{ flexbox_center: center },
		{ flexbox_column: column },
		`flexbox_${gap}`
	);

	return <div className={elementClasses}>{children}</div>;
};

export default Flex;
