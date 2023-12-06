import "./Sidebar.scss";

import { FC } from "react";
import { NavLink } from "react-router-dom";

export interface SidebarItem {
	icon: React.ReactNode;
	path: string;
	name: string;
}

export interface SidebarProps {
	pages: SidebarItem[];
}

const Sidebar: FC<SidebarProps> = ({ pages }) => {
	return (
		<aside className="sidebar">
			<div className="sidebar__container">
				<nav className="sidebar-nav">
					<ul className="sidebar-nav__list">
						{pages.map((page, index) => (
							<li className="sidebar-nav__item" key={index}>
								<NavLink to={page.path} className="sidebar-nav__link">
									{page.icon}
									<span>{page.name}</span>
								</NavLink>
							</li>
						))}
					</ul>
				</nav>
			</div>
		</aside>
	);
};

export default Sidebar;
