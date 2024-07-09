import { FC } from "react";
import { AnimatePresence as AP, motion as m } from "framer-motion";
import classNames from "classnames";
import { ModalState } from "@/redux/slices/modal";
import { useActions } from "@/hooks/useActions";

interface ModalWrapperProps {
	className?: string;
	isActive: boolean;
	name: keyof ModalState;
	children: React.ReactNode;
}

const ModalWrapper: FC<ModalWrapperProps> = ({ className, isActive, name, children }) => {
	const { closeModal } = useActions();

	const handleClose = (event: React.MouseEvent<HTMLDivElement>) => {
		const element = event.target as HTMLDivElement;

		if (!element.closest(".modal__content")) closeModal(name);
	};

	const contentClassNames = classNames("modal__content", { [`${className}`]: className });

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
						<div className={contentClassNames}>{children}</div>
					</div>
				</m.div>
			)}
		</AP>
	);
};

export default ModalWrapper;
