import { NavLink } from "react-router-dom";
import Button, { ButtonTypes } from "../Button";
import { useActions } from "../../hooks/useActions";

import LogoutIcon from "../../icons/logout.svg?react";

import { FC } from "react";

interface NavbarProps {
	pages: {
		path: string;
		icon: React.ReactNode;
		name: string;
		isNew?: string;
	}[];
}

const Navbar: FC<NavbarProps> = ({ pages }) => {
	const { updateLogoutModalStatus } = useActions();

	const isPageNew = (pageName: string): boolean => {
		const storedData = localStorage.getItem("newpage");

		if (!storedData) {
			return true;
		} else {
			if (storedData === pageName) {
				return false;
			} else {
				return true;
			}
		}
	};

	return (
		<nav className="sidebar-nav">
			<ul className="sidebar-nav__list">
				{pages.map((page, index) => (
					<li className="sidebar-nav__item" key={index}>
						<NavLink
							to={page.path}
							className={`sidebar-nav__link${page.isNew && isPageNew(page.isNew) ? " sidebar-nav__link--new" : ""}`}
						>
							{page.icon}
							<span>{page.name}</span>
						</NavLink>
					</li>
				))}
				<Button
					onClick={() => updateLogoutModalStatus(true)}
					text="Выход"
					icon={{ element: <LogoutIcon /> }}
					type={ButtonTypes.error}
				/>
			</ul>
		</nav>
	);
};

export default Navbar;
