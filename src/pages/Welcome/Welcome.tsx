import Button, { ButtonIconLocation, ButtonTypes } from "../../components/Button";
import "./Welcome.scss";

import { FC } from "react";

import Icon1 from "../../icons/book.svg?react";
import Icon2 from "../../icons/calendar.svg?react";
import Icon3 from "../../icons/edit.svg?react";
import Icon4 from "../../icons/group.svg?react";
import Icon5 from "../../icons/lock.svg?react";
import Icon6 from "../../icons/user.svg?react";

const Welcome: FC = () => {
	// return <div>Welcome</div>;
	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
			<div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
				<h2>Кнопка "Основная"</h2>
				<div className="description">Взаимодействуйте с кнопками (наводитесь, удерживайте, нажимайте).</div>
				<div style={{ display: "flex", gap: 50 }}>
					<Button text="Основная кнопка" type={ButtonTypes.primary} />
					<Button text="Неактивное состояние" type={ButtonTypes.primary} disabled={true} />
					<Button text="Иконка слева" type={ButtonTypes.primary} icon={{ element: <Icon1 /> }} />
					<Button
						text="Иконка справа"
						type={ButtonTypes.primary}
						icon={{ element: <Icon2 />, location: ButtonIconLocation.right }}
					/>
				</div>
			</div>
			<div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
				<h2>Кнопка "По умолчания"</h2>
				<div className="description">Взаимодействуйте с кнопками (наводитесь, удерживайте, нажимайте).</div>
				<div style={{ display: "flex", gap: 50 }}>
					<Button text="Обычная кнопка" type={ButtonTypes.default} />
					<Button text="Неактивное состояние" type={ButtonTypes.default} disabled={true} />
					<Button text="Иконка слева" type={ButtonTypes.default} icon={{ element: <Icon3 /> }} />
					<Button
						text="Иконка справа"
						type={ButtonTypes.default}
						icon={{ element: <Icon4 />, location: ButtonIconLocation.right }}
					/>
				</div>
			</div>
			<div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
				<h2>Кнопка ошибки/отмены</h2>
				<div className="description">Взаимодействуйте с кнопками (наводитесь, удерживайте, нажимайте).</div>
				<div style={{ display: "flex", gap: 50 }}>
					<Button text="Красная кнопка" type={ButtonTypes.destructive} />
					<Button text="Неактивное состояние" type={ButtonTypes.destructive} disabled={true} />
					<Button text="Иконка слева" type={ButtonTypes.destructive} icon={{ element: <Icon5 /> }} />
					<Button
						text="Иконка справа"
						type={ButtonTypes.destructive}
						icon={{ element: <Icon6 />, location: ButtonIconLocation.right }}
					/>
				</div>
			</div>
		</div>
	);
};

export default Welcome;
