import { FC } from "react";

import TrashIcon from "../../icons/trash.svg?react";

import { AnimatePresence as AP, motion as m } from "framer-motion";

interface LessonProps {
	isEditMode: boolean;
	lesson: number;
	removeLesson: () => void;
}

const Lesson: FC<LessonProps> = ({ isEditMode, removeLesson, lesson }) => {
	const transitions = {
		initial: { opacity: 0, scale: 0.95 },
		animate: { opacity: 1, scale: 1 },
		exit: { opacity: 0, scale: 0.95 },
	};

	const handleRemove = () => {
		if (isEditMode) {
			removeLesson();
		}
	};

	return (
		<div className={`book-lesson${isEditMode ? " book-lesson_editable" : ""}`} onClick={handleRemove}>
			<AP mode="wait" initial={false}>
				{isEditMode && (
					<m.div {...transitions}>
						<TrashIcon />
					</m.div>
				)}
			</AP>
			<span>Урок {lesson}</span>
		</div>
	);
};

export default Lesson;
