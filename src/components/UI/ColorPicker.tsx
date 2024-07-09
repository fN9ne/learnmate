import { FC, useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";

import Icon from "@icons/palette.svg?react";
import classNames from "classnames";

import { AnimatePresence as AP, motion as m } from "framer-motion";

interface ColorPickerProps {
	value: string;
	placeholder: string;
	onChange: (value: string) => void;
}

const ColorPicker: FC<ColorPickerProps> = ({ placeholder, onChange, value }) => {
	const [isFocus, setIsFocus] = useState<boolean>(false);

	const colorPickerClassNames = classNames(
		"color-picker",
		{ "color-picker--focused": isFocus },
		{ "color-picker--filled": !["#000", "#000000"].includes(value) }
	);

	useEffect(() => {}, []);

	const transitions = {
		initial: { opacity: 0, scale: 0.95, y: 20 },
		animate: { opacity: 1, scale: 1, y: 0 },
		exit: { opacity: 0, scale: 0.95, y: 20 },
	};

	return (
		<div className={colorPickerClassNames} tabIndex={0} onBlur={() => setIsFocus(false)} onFocus={() => setIsFocus(true)}>
			<Icon />
			{["#000", "#000000"].includes(value) ? (
				<div className="color-picker__placeholder">{placeholder}</div>
			) : (
				<div className="color-picker__value">{value}</div>
			)}
			<div className="color-picker__preview" style={{ backgroundColor: value }} />
			<AP mode="wait" initial={false}>
				{isFocus && (
					<m.div {...transitions} className="color-picker__main">
						<HexColorPicker color={value} onChange={onChange} />
					</m.div>
				)}
			</AP>
		</div>
	);
};

export default ColorPicker;
