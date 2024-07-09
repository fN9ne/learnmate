import classNames from "classnames";
import { FC } from "react";

import { motion as m } from "framer-motion";

interface LoaderProps {
	className?: string;
	isFetching: boolean;
}

const Loader: FC<LoaderProps> = ({ isFetching, className }) => {
	const loaderClassName = classNames("loader", className);

	const transitions = {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
	};

	return (
		isFetching && (
			<m.div {...transitions} className={loaderClassName}>
				<div className="loader__content"></div>
			</m.div>
		)
	);
};

export default Loader;
