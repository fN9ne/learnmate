import { FC } from "react";
import { Outlet } from "react-router-dom";

import { motion as m } from "framer-motion";

const WrapperLayout: FC = () => {
	return (
		<>
			<div className="container">
				<Outlet />
			</div>
			<m.div
				initial={{ scaleY: 1, transformOrigin: "bottom center" }}
				animate={{ scaleY: 0, transformOrigin: "bottom center" }}
				exit={{ scaleY: 1, transformOrigin: "top center" }}
				transition={{ duration: 0.5, delay: 0.15 }}
				className="cover"
			/>
		</>
	);
};

export default WrapperLayout;
