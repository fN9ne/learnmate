import classNames from "classnames";
import { FC } from "react";

export enum BannerTypes {
	success = "success",
	error = "error",
	default = "default",
}

interface BannerProps {
	type?: BannerTypes;
	visible: boolean;
	text: string;
}

const Banner: FC<BannerProps> = ({ type = BannerTypes.default, visible, text }) => {
	const bannerClasses = classNames("banner", `banner_${type}`, { banner_active: visible });

	return <div className={bannerClasses}>{text}</div>;
};

export default Banner;
