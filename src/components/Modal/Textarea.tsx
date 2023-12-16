import classNames from "classnames";

import { FC, useState } from "react";

interface TextareaProps {
	placeholder: string;
	value: string;
	onChange: (value: string) => void;
}

const Textarea: FC<TextareaProps> = ({ placeholder, value, onChange }) => {
	const [isFocus, setIsFocus] = useState<boolean>(false);
	const [isEmpty, setIsEmpty] = useState<boolean>(value.length === 0);

	const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		const value = event.target.value;

		onChange(value);
		setIsEmpty(value.length === 0);
	};

	const textareaClasses = classNames("textarea", { textarea_focused: isFocus }, { textarea_filled: !isEmpty });

	const handleFocus = () => setIsFocus(true);

	const handleBlur = () => setIsFocus(false);

	return (
		<div className={textareaClasses}>
			<div className="textarea__placeholder">{placeholder}</div>
			<textarea value={value} onFocus={handleFocus} onBlur={handleBlur} onChange={handleChange} spellCheck={false} />
		</div>
	);
};

export default Textarea;
