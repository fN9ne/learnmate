import classNames from "classnames";
import { FC } from "react";

import { motion as m } from "framer-motion";

import BackIcon from "@icons/arrowBack.svg?react";

interface BlockProps {
	icon?: React.ReactNode;
	title: string;
	fit?: boolean;
	small?: boolean;
	headerContent?: React.ReactNode;
	className?: string;
	onBack?: () => void;
	children: React.ReactNode;
}

const Block: FC<BlockProps> = ({ className, icon, title, fit, small, headerContent, onBack, children }) => {
	const blockClassNames = classNames(
		"block",
		{ "block--fit": fit },
		{ "block--small": small },
		{ [`${className}`]: className !== undefined }
	);

	return (
		<m.div className={blockClassNames}>
			<div className="block__header">
				<div className="block__header-content">
					{onBack && (
						<button className="block__back" onClick={onBack}>
							<BackIcon /> <span>Вернуться назад</span>
						</button>
					)}
					<h2 className="block__title">
						{icon} <span>{title}</span>
					</h2>
				</div>
				{headerContent}
			</div>
			<div className="block__body">{children}</div>
		</m.div>
	);
};

export default Block;
