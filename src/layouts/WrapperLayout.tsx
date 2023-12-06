import { FC } from "react";
import { Outlet } from "react-router-dom";

const WrapperLayout: FC = () => {
	return (
		<div className="container">
			<Outlet />
		</div>
	);
};

export default WrapperLayout;
