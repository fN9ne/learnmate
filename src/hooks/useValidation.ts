import { useEffect, useState } from "react";
import { IValidation } from "./useInput";

export interface useValidationReturns {
	isInputValid: boolean;
	minLengthError: boolean | null;
	isEmailCorrect: boolean | null;
}

interface useValidationArguments {
	(value: string, validations: IValidation): useValidationReturns;
}

export const useValidation: useValidationArguments = (value, validations) => {
	const [isInputValid, setIsInputValid] = useState<boolean>(false);
	const [minLengthError, setMinLengthError] = useState<boolean>(false);
	const [isEmailCorrect, setIsEmailCorrect] = useState<boolean>(true);

	useEffect(() => {
		if (validations.minLength) {
			setMinLengthError(value.length < validations.minLength);
		}
		if (validations.isEmail) {
			setIsEmailCorrect(
				/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(
					value
				)
			);
		}
	}, [value]);

	useEffect(() => {
		setIsInputValid(!minLengthError && isEmailCorrect);
	}, [minLengthError, isEmailCorrect]);

	return {
		isInputValid,
		minLengthError: validations.minLength ? minLengthError : null,
		isEmailCorrect: validations.isEmail ? isEmailCorrect : null,
	};
};
