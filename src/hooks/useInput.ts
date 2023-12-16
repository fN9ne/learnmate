import { useState } from "react";
import { useValidation } from "./useValidation";
import { useValidationReturns } from "./useValidation";

export interface IValidation {
	minLength?: number;
	isEmail?: boolean;
}

interface useInputReturns {
	value: string;
	isDirty: boolean;
	reset: () => void;
	onChange: (value: string) => void;
	onBlur: () => void;
}

interface useInputArguments {
	(initialValue: string, validations: IValidation): useInputReturns & useValidationReturns;
}

export const useInput: useInputArguments = (initialValue, validations) => {
	const [value, setValue] = useState<string>(initialValue);
	const [isDirty, setIsDirty] = useState<boolean>(false);

	const valid = useValidation(value, validations);

	const onChange = (newValue: string) => setValue(newValue);
	const onBlur = () => setIsDirty(true);
	const reset = () => {
		setValue("");
		setIsDirty(false);
	};

	return {
		value,
		isDirty,
		onChange,
		onBlur,
		reset,
		...valid,
	};
};
