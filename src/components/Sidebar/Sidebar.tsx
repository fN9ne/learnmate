import "./Sidebar.scss";

import { FC, useState } from "react";
import { AnimatePresence as AP, motion as m } from "framer-motion";
import Navbar from "./Navbar";

export interface SidebarItem {
	icon: React.ReactNode;
	path: string;
	name: string;
}

export interface SidebarProps {
	pages: SidebarItem[];
}

const Sidebar: FC<SidebarProps> = ({ pages }) => {
	const [isBurgerMenuActive, setIsBurgerMenuActive] = useState<boolean>(false);

	const transitions = {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
	};

	return (
		<>
			<aside className="sidebar">
				<div className="sidebar__container">
					<Navbar pages={pages} />
					<div onClick={() => setIsBurgerMenuActive((state) => !state)} className="sidebar-burger-menu">
						<span></span>
						<span></span>
						<span></span>
					</div>
				</div>
			</aside>
			<AP mode="wait" initial={false}>
				{isBurgerMenuActive && (
					<m.div {...transitions} className="burger-menu-content">
						<div className="burger-menu-content__area" onClick={() => setIsBurgerMenuActive(false)} />
						<div className="burger-menu-content__body">
							<div className="burger-menu-content__close" onClick={() => setIsBurgerMenuActive(false)} />
							<Navbar pages={pages} />
						</div>
					</m.div>
				)}
			</AP>
		</>
	);
};

export default Sidebar;
