import { FC, useEffect, useState } from "react";
import ModalLayout from "./ModalLayout";
import { useActions } from "../../hooks/useActions";
import { useAppSelector } from "../../hooks/useAppSelector";
import Button, { ButtonTypes } from "../Button";
import Input, { InputTypes } from "../Input";
import { useInput } from "../../hooks/useInput";

const NewStudentModal: FC = () => {
	const { isNewStudentModalActive } = useAppSelector((state) => state.modal);
	const { updateNewStudentModalStatus, addStudent, updateStudentsFetching } = useActions();

	const { fetching } = useAppSelector((state) => state.students);

	const firstname = useInput("", { minLength: 2 });
	const username = useInput("", { minLength: 5 });
	const color = useInput("", {});
	const discord = useInput("", {});

	const [isValid, setValid] = useState<boolean>(false);

	const formSend = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		addStudent({
			name: firstname.value,
			username: username.value,
			discord_username: discord.value.length > 0 ? discord.value : null,
			payment: 350,
			lessons_count: 0,
			color: color.value,
			lessons_history: [],
		});

		updateStudentsFetching(true);

		updateNewStudentModalStatus(false);

		setTimeout(() => {
			firstname.reset();
			username.reset();
			color.reset();
			discord.reset();
		}, 100);
	};

	useEffect(() => {
		setValid(firstname.isInputValid && username.isInputValid && color.value.length !== 0);
	}, [firstname.isInputValid, username.isInputValid, color.value]);

	return (
		<ModalLayout className="new-student" isActive={isNewStudentModalActive} onClose={() => updateNewStudentModalStatus(false)}>
			<h1>Новый ученик</h1>
			<form action="#" onSubmit={formSend} className="new-student__body">
				<Input
					onChange={firstname.onChange}
					placeholder="Имя"
					value={firstname.value}
					errorMessage="Длина имени должна быть не менее 2 символов"
					isError={firstname.isDirty && !firstname.isInputValid}
					onBlur={firstname.onBlur}
					required
					disabled={fetching}
				/>
				<Input
					onChange={username.onChange}
					placeholder="Ник в телеграм"
					value={username.value}
					errorMessage="Длина ника должна быть не менее 5 символов"
					isError={username.isDirty && !username.isInputValid}
					onBlur={username.onBlur}
					required
					disabled={fetching}
				/>
				<Input
					onChange={color.onChange}
					placeholder="Цвет ученика"
					value={color.value}
					errorMessage="Вы должны выбрать цвет ученика"
					isError={color.isDirty && color.value === ""}
					onBlur={color.onBlur}
					required
					disabled={fetching}
					type={InputTypes.color}
				/>
				<Input onChange={discord.onChange} placeholder="Ник в дискорде" value={discord.value} onBlur={discord.onBlur} />
				<Button loading={fetching} submit text="Добавить" type={ButtonTypes.primary} disabled={!isValid} />
			</form>
		</ModalLayout>
	);
};

export default NewStudentModal;
