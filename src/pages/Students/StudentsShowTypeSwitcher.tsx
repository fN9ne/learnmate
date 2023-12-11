import { FC } from "react";
import { StudentsShowType } from "../../store/reducers/StudentsSlice";

import TableIcon from "../../icons/table.svg?react";
import CompactIcon from "../../icons/blocks.svg?react";
import classNames from "classnames";

interface StudentsShowTypSwitcherProps {
	activeType: StudentsShowType;
	onClick: (type: StudentsShowType) => void;
}

const StudentsShowTypeSwitcher: FC<StudentsShowTypSwitcherProps> = ({ activeType, onClick }) => {
	const tableItemClasses = classNames("students-type-switcher__item", "students-type-switcher__item_table", {
		"students-type-switcher__item_active": activeType === StudentsShowType.table,
	});
	const compactItemClasses = classNames("students-type-switcher__item", "students-type-switcher__item_compact", {
		"students-type-switcher__item_active": activeType === StudentsShowType.compact,
	});

	return (
		<div className="students-type-switcher">
			<div onClick={() => onClick(StudentsShowType.table)} className={tableItemClasses}>
				<TableIcon />
				<span>Таблица</span>
			</div>
			<div onClick={() => onClick(StudentsShowType.compact)} className={compactItemClasses}>
				<CompactIcon />
				<span>Компактно</span>
			</div>
		</div>
	);
};

export default StudentsShowTypeSwitcher;
