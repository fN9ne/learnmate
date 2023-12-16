import "./Modal.scss";

import { FC } from "react";

import { AnimatePresence as AP, motion as m } from "framer-motion";
import classNames from "classnames";

interface ModalLayoutProps {
	className?: string;
	isActive: boolean;
	onClose: () => void;
	children: React.ReactNode;
}

const ModalLayout: FC<ModalLayoutProps> = ({ className, isActive, onClose, children }) => {
	const handleClose = (event: React.MouseEvent<HTMLDivElement>) => {
		const targetElement = event.target as Element;

		if (!targetElement.closest(".modal__content")) onClose();
	};

	const contentClasses = classNames("modal__content", { [`${className}`]: className !== undefined });

	const transitions = {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
	};

	return (
		<AP>
			{isActive && (
				<m.div {...transitions} className="modal" onClick={handleClose}>
					<div className="modal__body">
						<div className={contentClasses}>
							<div className="modal__close" onClick={onClose}></div>
							{children}
						</div>
					</div>
				</m.div>
			)}
		</AP>
	);
};

export default ModalLayout;
