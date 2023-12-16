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
}

const Time: FC<TimeInterface> = ({ limits, value, onChange, placeholder }) => {
	return (
		<div className="lesson-time">
			<input
				type="number"
				min={limits.min}
				max={limits.max}
				step={limits.step}
				value={Number(value) >= 0 ? (Number(value) < 10 ? "0" + value : value) : -1}
				onChange={onChange}
				className="lesson-time__input"
			/>
			<div className="lesson-time__placeholder">{placeholder}</div>
			<Icon className="lesson-time__carets" />
		</div>
	);
};

export default Time;
