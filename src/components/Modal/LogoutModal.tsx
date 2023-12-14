import { FC, useState } from "react";
import ModalLayout from "./ModalLayout";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useActions } from "../../hooks/useActions";
import Description from "../Description";
import Button, { ButtonTypes } from "../Button";

import LogoutIcon from "../../icons/logout.svg?react";
import supabase from "../../services/createClient";
import { useNavigate } from "react-router-dom";

const LogoutModal: FC = () => {
	const { isLogoutModalActive } = useAppSelector((state) => state.modal);
	const { updateLogoutModalStatus, resetLessons, resetModal, resetStudents, resetUser } = useActions();

	const [fetching, setFetching] = useState<boolean>(false);

	const navigate = useNavigate();

	return (
		<ModalLayout isActive={isLogoutModalActive} onClose={() => updateLogoutModalStatus(false)} className="logout-modal">
			<h1>Выйти из аккаунта?</h1>
			<Description>Вы уверены, что вы хотите выйти из аккаунта?</Description>
			<div className="logout-modal__footer">
				<Button
					text="Выйти"
					icon={{ element: <LogoutIcon /> }}
					type={ButtonTypes.error}
					disabled={fetching}
					loading={fetching}
					onClick={async () => {
						setFetching(true);
						await supabase.auth.signOut();
						setFetching(false);
						updateLogoutModalStatus(false);
						navigate("/signin");
						resetLessons();
						resetModal();
						resetStudents();
						resetUser();
					}}
				/>
				<Button text="Отмена" type={ButtonTypes.default} onClick={() => updateLogoutModalStatus(false)} />
			</div>
		</ModalLayout>
	);
};

export default LogoutModal;
