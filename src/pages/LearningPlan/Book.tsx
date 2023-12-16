import { ChangeEvent, FC, useState } from "react";

import { AnimatePresence as AP, motion as m } from "framer-motion";

import TrashIcon from "../../icons/trash.svg?react";
import Arrow from "../../icons/arrow_down.svg?react";
import Plus from "../../icons/plus.svg?react";

import { IBook } from "../../store/reducers/LearningPlanSlice";
import Lesson from "./Lesson";
import Button from "../../components/Button";

interface BookProps {
	isEditMode: boolean;
	book: IBook;
	changeBook: (newValues: { name?: string; lessons?: number[] }) => void;
	removeBook: () => void;
}

const Book: FC<BookProps> = ({ isEditMode, book, changeBook, removeBook }) => {
	const [isActive, setIsActive] = useState<boolean>(false);

	const transitions = {
		initial: { opacity: 0, scale: 0.95 },
		animate: { opacity: 1, scale: 1 },
		exit: { opacity: 0, scale: 0.95 },
	};

	const handleChangeName = (event: ChangeEvent<HTMLInputElement>) => {
		changeBook({ name: event.target.value });
	};

	const handleNewLesson = () => {
		changeBook({ lessons: [...book.lessons, book.lessons.length + 1] });
	};

	const removeLesson = () => {
		changeBook({ lessons: Array.from({ length: book.lessons.length - 1 }, (_, i) => i + 1) });
	};

	return (
		<div className="book">
			<div className="book__header" onClick={() => setIsActive((prev) => !prev)}>
				<AP mode="wait" initial={false}>
					{isEditMode && (
						<m.button {...transitions} onClick={removeBook} className="book__remove">
							<TrashIcon />
						</m.button>
					)}
				</AP>
				<input
					onClick={(event: React.MouseEvent<HTMLInputElement>) => {
						event.stopPropagation();
					}}
					placeholder=" Введите название книги"
					type="text"
					className="book__name"
					value={book.name}
					onChange={handleChangeName}
				/>
				<Arrow className={`book__arrow${isActive ? " book__arrow_rotate" : ""}`} />
			</div>
			<AP mode="wait" initial={false}>
				{isActive && (
					<m.div {...transitions} className="book-content">
						{book.lessons.map((lesson, index) => (
							<Lesson removeLesson={removeLesson} isEditMode={isEditMode} lesson={lesson} key={index} />
						))}
						{isEditMode && <Button text="Добавить урок" icon={{ element: <Plus /> }} onClick={handleNewLesson} />}
					</m.div>
				)}
			</AP>
		</div>
	);
};

export default Book;
