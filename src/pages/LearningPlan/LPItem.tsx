import { useActions } from "@/hooks/useActions";
import classNames from "classnames";
import { FC, useEffect, useState } from "react";
import { AnimatePresence as AP, motion as m } from "framer-motion";
import { HexColorPicker } from "react-colorful";

import BookIcon from "@icons/book.svg?react";
import PresentationIcon from "@icons/presentation.svg?react";
import PaletteIcon from "@icons/palette.svg?react";

interface ICommonProps {
	id: number;
	name: string;
	color: string | null;
}

interface IBookProps extends ICommonProps {
	lessons: number;
}

interface IPresentationProps extends ICommonProps {}

type Props = IBookProps | IPresentationProps;

const LPItem: FC<Props> = (props) => {
	const [isActive, setIsActive] = useState<boolean>(false);
	const [colorIsFocus, setColorIsFocus] = useState<boolean>(false);

	const lpItemClassNames = classNames("lp-item", `lp-item-${props.id}`, { "lp-item--edit": isActive });

	const { updateBook, removeBook, updatePresentation, removePresentation } = useActions();

	const transitions = {
		initial: { opacity: 0, y: -10 },
		animate: { opacity: 1, y: 0 },
		exit: { opacity: 0, y: -10 },
	};

	const [colorPickerPos, setColorPickerPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

	const isBook = (item: Props): item is IBookProps => "lessons" in item;

	const handleRemoveColor = () => {
		if (isBook(props)) {
			updateBook({ id: props.id, data: { color: null } });
		} else {
			updatePresentation({ id: props.id, data: { color: null } });
		}
	};
	const handleRemoveBook = () => {
		if (isBook(props)) {
			removeBook(props.id);
		} else {
			removePresentation(props.id);
		}
	};

	useEffect(() => {
		const closeBookEditing = (event: MouseEvent) => {
			const element = event.target as Element;

			if (!element.closest(`.lp-item-${props.id}`)) setIsActive(false);
		};

		document.addEventListener("click", closeBookEditing);

		return () => document.removeEventListener("click", closeBookEditing);
	}, []);

	const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (isBook(props)) {
			updateBook({ id: props.id, data: { name: event.target.value } });
		} else {
			updatePresentation({ id: props.id, data: { name: event.target.value } });
		}
	};

	const handleColorChange = (newColor: string) => {
		if (isBook(props)) {
			updateBook({ id: props.id, data: { color: newColor } });
		} else {
			updatePresentation({ id: props.id, data: { color: newColor } });
		}
	};

	const handleLessonsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (isBook(props)) {
			updateBook({ id: props.id, data: { lessons: +event.target.value } });
		}
	};

	return (
		<div
			className={lpItemClassNames}
			onClick={(event: React.MouseEvent<HTMLDivElement>) => {
				event.stopPropagation();
				setIsActive(true);
			}}
		>
			<div className="lp-item__main">
				{!isActive ? (
					props.color && (
						<div className="lp-item__color">
							<span style={{ backgroundColor: props.color }} />
						</div>
					)
				) : (
					<div
						className="lp-item__color lp-item__color--edit"
						tabIndex={1}
						onFocus={(event: React.FocusEvent<HTMLDivElement>) => {
							setColorIsFocus(true);

							const element = event.currentTarget as Element;
							const rect = element.getBoundingClientRect();

							setColorPickerPos({ y: rect.top + rect.height + 4, x: rect.left - 10 });
						}}
						onBlur={() => setColorIsFocus(false)}
						onClick={(event: React.MouseEvent<HTMLDivElement>) => event.stopPropagation()}
					>
						<div className="lp-item__color-preview" style={{ backgroundColor: props.color || "transparent" }} />
						<AP mode="wait" initial={false}>
							{colorIsFocus && (
								<m.div
									{...transitions}
									className="lp-item__color-picker"
									style={{ top: colorPickerPos.y, left: colorPickerPos.x }}
								>
									<HexColorPicker color={props.color || "#000"} onChange={handleColorChange} />
								</m.div>
							)}
						</AP>
					</div>
				)}
				{!isActive ? (
					<div className="lp-item__name">{props.name}</div>
				) : (
					<input type="text" value={props.name} onChange={handleNameChange} className="lp-item__name lp-item__name--edit" />
				)}
				{isBook(props) && (
					<div className="lp-item__lessons">
						{!isActive ? (
							props.lessons
						) : (
							<input
								type="number"
								min={0}
								value={props.lessons}
								onChange={handleLessonsChange}
								className="lp-item__lessons-edit"
							/>
						)}{" "}
						уроков
					</div>
				)}
			</div>
			<AP mode="wait" initial={false}>
				{isActive && (
					<m.div className="lp-item__edit" {...transitions}>
						<button onClick={handleRemoveColor} className="lp-item__button" disabled={props.color === null}>
							<PaletteIcon />
							<span>Удалить цвет</span>
						</button>
						<button onClick={handleRemoveBook} className="lp-item__button">
							{isBook(props) ? <BookIcon /> : <PresentationIcon />}
							<span>Удалить {isBook(props) ? "книгу" : "презентацию"}</span>
						</button>
					</m.div>
				)}
			</AP>
		</div>
	);
};

export default LPItem;
