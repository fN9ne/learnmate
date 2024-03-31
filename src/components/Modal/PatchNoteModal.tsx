import { FC } from "react";
import ModalLayout from "./ModalLayout";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useActions } from "../../hooks/useActions";

import { changes } from "../../patch.json";

const PatchNoteModal: FC = () => {
	const { isPatchNoteModalActive } = useAppSelector((state) => state.modal);

	const { updatePatchNoteModalStatus } = useActions();

	return (
		<ModalLayout isActive={isPatchNoteModalActive} onClose={() => updatePatchNoteModalStatus(false)} className="patch-note">
			<div className="patch-note__header">
				<h1>Обновление {import.meta.env.VITE_VERSION}</h1>
				<div className="description">Изменения от {import.meta.env.VITE_PATCH_DATE}</div>
			</div>
			<div className="patch-note__body">
				<ul className="patch-note__list">
					{changes.map((row, index) => (
						<li className="patch-note__item" key={index}>
							{row}
						</li>
					))}
				</ul>
			</div>
		</ModalLayout>
	);
};

export default PatchNoteModal;
