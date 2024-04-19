import { FC } from "react";

import Icon from "../../icons/carets.svg?react";

interface TimeInterface {
	value: string;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	placeholder: string;
	limits: {
		min: number;
		max: number;
		step?: number;
	};
	disabled?: boolean;
}

const Time: FC<TimeInterface> = ({ limits, value, onChange, placeholder, disabled }) => {
	return (
		<div className={`lesson-time${disabled ? " lesson-time_disabled" : ""}`}>
			<input
				type="number"
				min={limits.min}
				max={limits.max}
				step={limits.step}
				value={Number(value) >= 0 ? (Number(value) < 10 ? "0" + value : value) : -1}
				onChange={onChange}
				className="lesson-time__input"
				disabled={disabled}
			/>
			<div className="lesson-time__placeholder">{placeholder}</div>
			<Icon className="lesson-time__carets" />
		</div>
	);
};

export default Time;
