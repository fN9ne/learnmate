import Block from "@/components/UI/Block";
import { FC, useEffect, useState } from "react";

import SettingsIcon from "@icons/settings.svg?react";
import WindowIcon from "@icons/window.svg?react";
import SunIcon from "@icons/sun.svg?react";
import MoonIcon from "@icons/moon.svg?react";
import SystemIcon from "@icons/system.svg?react";
import ClockIcon from "@icons/clock.svg?react";
import CaretIcon from "@icons/caret.svg?react";
import RubleIcon from "@icons/rub.svg?react";
import TelegramIcon from "@icons/telegram.svg?react";
import DiscordIcon from "@icons/discord.svg?react";

import { useNavigate } from "react-router-dom";

import { AnimatePresence as AP, motion as m } from "framer-motion";
import { useAppSelector } from "@/hooks/useAppSelector";
import { StudentNicknameSource, Theme } from "@/redux/slices/global";
import { useActions } from "@/hooks/useActions";
import Switch, { TextOrientation } from "@/components/UI/Switch";
import classNames from "classnames";
import Input, { InputTypes } from "@/components/UI/Input";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const Settings: FC = () => {
	useDocumentTitle("Настройки");

	const navigate = useNavigate();

	const { settings } = useAppSelector((state) => state.global);
	const { updateSettings } = useActions();

	const themes: SelectItem<Theme>[] = [
		{ icon: <SystemIcon />, name: "Системная", value: Theme.System },
		{ icon: <SunIcon />, name: "Светлая", value: Theme.Light },
		{ icon: <MoonIcon />, name: "Тёмная", value: Theme.Dark },
	];

	const highlightTimes: SelectItem<number>[] = [
		{ icon: <ClockIcon />, name: "10 минут", value: 10 },
		{ icon: <ClockIcon />, name: "15 минут", value: 15 },
		{ icon: <ClockIcon />, name: "30 минут", value: 30 },
		{ icon: <ClockIcon />, name: "1 час", value: 60 },
		{ icon: <ClockIcon />, name: "2 часа", value: 120 },
	];

	const nicknames: SelectItem<StudentNicknameSource>[] = [
		{ icon: <TelegramIcon />, name: "Телеграм", value: StudentNicknameSource.Telegram },
		{ icon: <DiscordIcon />, name: "Дискорд", value: StudentNicknameSource.Discord },
	];

	const handleUpdateTheme = (value: Theme) => {
		updateSettings({ theme: value });
	};

	const handleUpdateTime = (value: number) => {
		updateSettings({ highlightUpcomingLessonTime: value });
	};

	const handleUpdateNicknames = (value: StudentNicknameSource) => {
		updateSettings({ studentNicknameSource: value });
	};

	return (
		<div className="settings">
			<Block title="Настройки" icon={<SettingsIcon />}>
				<div className="settings__content">
					<SettingsItem
						title="Руководство пользователя и нововведения второй версии"
						description="Если у вас возникают вопросы или трудности с пониманием некоторых функциональных аспектов этой платформы, вы можете перейти в руководство пользователя по ссылке ниже."
					>
						<button className="link" onClick={() => navigate("/users-guide")}>
							<WindowIcon />
							<span>Руководство пользователя</span>
						</button>
					</SettingsItem>
					<SettingsItem
						title="Тема"
						description="Эта настройка позволяет выбрать предпочитаемую тему интерфейса: тёмную или светлую."
					>
						<Select
							values={themes}
							value={themes.find((theme) => theme.value === settings.theme)?.value || Theme.System}
							onChange={(value: Theme) => handleUpdateTheme(value)}
						/>
					</SettingsItem>
					<SettingsItem
						title="Подсветка виджета «Близжайшее занятие»"
						description="Когда близжайшее занятие должно скоро наступить, фон виджета «Близжайшее занятие» будет немного окрашен в преобладающий фиолетовый цвет, а отсчёт до начала занятия окрасится в фиолетовый цвет. Время при котором виджет будет окрашиваться также можно настроить."
					>
						<Switch
							isChecked={settings.highlightUpcomingLesson === false ? false : true}
							onClick={(value: boolean) => updateSettings({ highlightUpcomingLesson: value })}
							textOrientation={TextOrientation.Right}
							text={{ offText: "Отключено", onText: "Включено" }}
						/>
						<Select
							values={highlightTimes}
							value={highlightTimes.find((time) => time.value === settings.highlightUpcomingLessonTime)?.value || 30}
							onChange={handleUpdateTime}
							small
							disabled={!settings.highlightUpcomingLesson}
						/>
					</SettingsItem>
					<SettingsItem
						title="Никнеймы на странице «Ученики» "
						description="Вы можете выбрать какие никнеймы будут отображаться на странице «Ученики»: никнеймы телеграмма или никнеймы дискорда."
					>
						<Select
							values={nicknames}
							value={
								nicknames.find((nicknameSource) => nicknameSource.value === settings.studentNicknameSource)?.value ||
								StudentNicknameSource.Telegram
							}
							onChange={handleUpdateNicknames}
						/>
					</SettingsItem>
					<SettingsItem
						title="Отображение букв на блоках с цветом учеников"
						description="Если эта настройка активна, то на квадратах с цветом учеников будет показываться первая буква их имени."
					>
						<Switch
							isChecked={settings.showInitialOnBackground}
							onClick={(value: boolean) => updateSettings({ showInitialOnBackground: value })}
							textOrientation={TextOrientation.Right}
							text={{ offText: "Отключено", onText: "Включено" }}
						/>
					</SettingsItem>
					<SettingsItem
						title="Значение по умолчанию для стоимости занятия"
						description="В этой настройке можно указать значение по умолчанию для стоимости занятия."
					>
						<Input
							value={settings.defaultCost.toString()}
							onChange={(value: string) => updateSettings({ defaultCost: +value })}
							icon={<RubleIcon />}
							min={0}
							step={5}
							type={InputTypes.number}
						/>
					</SettingsItem>
				</div>
			</Block>
		</div>
	);
};

export default Settings;

interface SettingsItemProps {
	title: string;
	description: string;
	children: React.ReactNode;
}

const SettingsItem: FC<SettingsItemProps> = ({ description, title, children }) => {
	return (
		<div className="settings-item">
			<div className="settings-item__title">{title}</div>
			<div className="settings-item__description text text--n">{description}</div>
			<div className="settings-item__content">{children}</div>
		</div>
	);
};

interface SelectItem<T> {
	name: string;
	icon: React.ReactNode;
	value: T;
}

interface SelectProps<T> {
	value: T;
	onChange: (value: T) => void;
	values: SelectItem<T>[];
	small?: boolean;
	disabled?: boolean;
}

const Select = <T,>({ onChange, value, values, disabled, small }: SelectProps<T>) => {
	const [isDropDownActive, setIsDropDownActive] = useState<boolean>(false);

	const selectedItem = values.find((item) => item.value === value);

	useEffect(() => {
		const closeDropdown = (event: MouseEvent) => {
			const element = event.target as Element;

			if (!(element.closest(".selectbox__item") || element.closest(".selectbox__main"))) setIsDropDownActive(false);
		};

		document.addEventListener("click", closeDropdown);

		return () => document.removeEventListener("click", closeDropdown);
	}, []);

	const transitions = {
		initial: { opacity: 0, scale: 0.95, y: 10 },
		animate: { opacity: 1, scale: 1, y: 0 },
		exit: { opacity: 0, scale: 0.95, y: 10 },
	};

	const selectClassNames = classNames(
		"selectbox",
		{ "selectbox--small": small },
		{ "selectbox--active": isDropDownActive },
		{ "selectbox--disabled": disabled }
	);

	return (
		<div className={selectClassNames}>
			<div className="selectbox__main" onClick={() => setIsDropDownActive((state) => !state)}>
				{selectedItem ? (
					<>
						<div className="selectbox__icon">{selectedItem.icon}</div>
						<div className="selectbox__name">{selectedItem.name}</div>
					</>
				) : (
					<div className="selectbox__placeholder">Выберите</div>
				)}
				<CaretIcon className="selectbox__caret" />
			</div>
			<AP mode="wait" initial={false}>
				{isDropDownActive && (
					<m.div {...transitions} className="selectbox__body">
						<div className="selectbox__list">
							{values.map((item, index) => (
								<div
									className="selectbox__item"
									key={index}
									onClick={() => {
										onChange(item.value);
										setIsDropDownActive(false);
									}}
								>
									<div className="selectbox__icon">{item.icon}</div>
									<div className="selectbox__name">{item.name}</div>
								</div>
							))}
						</div>
					</m.div>
				)}
			</AP>
		</div>
	);
};
