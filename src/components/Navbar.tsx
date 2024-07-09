import { FC } from "react";
import { NavLink } from "react-router-dom";

export interface INavbarItem {
	name: string;
	path: string;
	icon: React.ReactNode;
}

interface NavbarProps {
	links: INavbarItem[];
	onLinkClick?: () => void;
}

const Navbar: FC<NavbarProps> = ({ links, onLinkClick }) => {
	return (
		<nav className="navbar">
			<ul className="navbar__list">
				{links.map((link, index) => (
					<li className="navbar__item" key={index}>
						<NavLink to={link.path} onClick={onLinkClick} className="navbar__link">
							{link.icon}
							<span>{link.name}</span>
						</NavLink>
					</li>
				))}
			</ul>
		</nav>
	);
};

export default Navbar;
