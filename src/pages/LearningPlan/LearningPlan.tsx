import Block from "@/components/UI/Block";
import Button, { ButtonTypes } from "@/components/UI/Button";

import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { FC, useState } from "react";

import LPIcon from "@icons/learningPlan.svg?react";
import BookIcon from "@icons/book.svg?react";
import PresentationIcon from "@icons/presentation.svg?react";
import AmountIcon from "@icons/amount.svg?react";
import CheckIcon from "@icons/checkmark.svg?react";
import PlusIcon from "@icons/plusAlt.svg?react";

import { AnimatePresence as AP, motion as m } from "framer-motion";
import { useInput } from "@/hooks/useInput";
import Input, { InputTypes } from "@/components/UI/Input";
import ColorPicker from "@/components/UI/ColorPicker";
import { useActions } from "@/hooks/useActions";
import { useAppSelector } from "@/hooks/useAppSelector";
import { generateId } from "@/functions";
import LPItem from "./LPItem";
import Loader from "@/components/Loader";

const LearningPlan: FC = () => {
	useDocumentTitle("Учебный план");

	const bookName = useInput("", {});
	const lessonsAmount = useInput("", {});
	const bookColor = useInput("#000", {});

	const presentationName = useInput("", {});
	const presentaitonColor = useInput("#000", {});

	const { addBook, addPresentation } = useActions();
	const { books, presentations, isFetching } = useAppSelector((state) => state.lp);

	const handleAddBook = () => {
		addBook({
			id: generateId(books),
			color: ["#000", "#000000"].includes(bookColor.value) ? null : bookColor.value,
			lessons: +lessonsAmount.value,
			name: bookName.value,
		});

		bookName.reset();
		lessonsAmount.reset();
		bookColor.onChange("#000");
	};

	const handleAddPresentation = () => {
		addPresentation({
			id: generateId(presentations),
			color: ["#000", "#000000"].includes(presentaitonColor.value) ? null : presentaitonColor.value,
			name: presentationName.value,
		});

		presentationName.reset();
		presentaitonColor.onChange("#000");
	};

	return (
		<div className="lp">
			{isFetching ? (
				<Loader isFetching={isFetching} className="lp__loader" />
			) : (
				<Block title="Учебный план" icon={<LPIcon />}>
					<div className="lp__block">
						<div className="lp__header">
							<div className="lp__title">
								<BookIcon />
								<span>Книги</span>
							</div>
							<Popup buttonIcon={<BookIcon />} buttonText="Добавить книгу" onSubmit={handleAddBook}>
								<Input onChange={bookName.onChange} value={bookName.value} icon={<BookIcon />} placeholder="Название книги" />
								<Input
									onChange={lessonsAmount.onChange}
									value={lessonsAmount.value}
									icon={<AmountIcon />}
									placeholder="Количество уроков"
									type={InputTypes.number}
									min={0}
								/>
								<ColorPicker onChange={bookColor.onChange} value={bookColor.value} placeholder="Цвет книги" />
							</Popup>
						</div>
						<div className="lp__body">
							{books.length > 0 ? (
								books.map((book, index) => <LPItem {...book} key={index} />)
							) : (
								<div className="lp__empty">
									<div className="text text--n">Пока что у вас не добавлена ни одна книга.</div>
								</div>
							)}
						</div>
					</div>
					<div className="lp__block">
						<div className="lp__header">
							<div className="lp__title">
								<PresentationIcon />
								<span>Презентации</span>
							</div>
							<Popup buttonIcon={<PresentationIcon />} buttonText="Добавить презентацию" onSubmit={handleAddPresentation}>
								<Input
									onChange={presentationName.onChange}
									value={presentationName.value}
									icon={<PresentationIcon />}
									placeholder="Название презентации"
								/>
								<ColorPicker
									onChange={presentaitonColor.onChange}
									value={presentaitonColor.value}
									placeholder="Цвет презентации"
								/>
							</Popup>
						</div>
						<div className="lp__body">
							{presentations.length > 0 ? (
								presentations.map((presentation, index) => <LPItem {...presentation} key={index} />)
							) : (
								<div className="lp__empty">
									<div className="text text--n">Пока что у вас не добавлена ни одна презентация.</div>
								</div>
							)}
						</div>
					</div>
				</Block>
			)}
		</div>
	);
};

export default LearningPlan;

interface PopupProps {
	buttonIcon: React.ReactNode;
	buttonText: string;
	children: React.ReactNode;
	onSubmit: () => void;
}

const Popup: FC<PopupProps> = ({ buttonIcon, buttonText, children, onSubmit }) => {
	const [isActive, setIsActive] = useState<boolean>(false);

	const transitions = {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
	};

	const transitions2 = {
		initial: { opacity: 0, scale: 0.95, y: 20 },
		animate: { opacity: 1, scale: 1, y: 0 },
		exit: { opacity: 0, scale: 0.95, y: 20 },
	};

	const handleOpenPopup = () => {
		setIsActive((state) => !state);
	};

	return (
		<div className="popup-wrapper">
			<Button onClick={handleOpenPopup} icon={buttonIcon} small>
				{buttonText}
			</Button>
			<AP mode="wait" initial={false}>
				{isActive && (
					<>
						<m.div
							{...transitions}
							className="popup"
							onClick={(event: React.MouseEvent<HTMLDivElement>) => {
								const element = event.target as Element;

								if (!element.closest(".popup__content")) setIsActive(false);
							}}
						>
							<m.div {...transitions2} className="popup__content">
								<div className="popup__title">
									{buttonIcon}
									<span>{buttonText}</span>
								</div>
								<div className="popup__body">{children}</div>
								<div className="popup__footer">
									<Button
										onClick={() => {
											onSubmit();
											setIsActive(false);
										}}
										small
										icon={<CheckIcon />}
									>
										{buttonText.split(" ")[0]}
									</Button>
									<Button onClick={() => setIsActive(false)} small type={ButtonTypes.secondary} icon={<PlusIcon />}>
										Отменить
									</Button>
								</div>
							</m.div>
						</m.div>
					</>
				)}
			</AP>
		</div>
	);
};
