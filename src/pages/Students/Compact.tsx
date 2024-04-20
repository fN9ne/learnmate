import { FC } from "react";
import { useAppSelector } from "../../hooks/useAppSelector";

import Arrow from "../../icons/arrow_long.svg?react";
import { NavLink } from "react-router-dom";

const Compact: FC = () => {
	const { students } = useAppSelector((state) => state.students);

	return (
		<div className="students-compact">
			{students.map((student, index) => (
				<NavLink to={`/app/student/${student.id}`} className="students-compact-item" key={index}>
					<div className="students-compact-item__display" style={{ backgroundColor: student.color }}>
						{student.name.slice(0, 1)}
					</div>
					<div className="students-compact-item__body">
						<div className="students-compact-item__username">@{student.username}</div>
						<div className="students-compact-item__name">{student.name}</div>
						<div className="students-compact-item__arrow">
							<Arrow />
						</div>
					</div>
				</NavLink>
			))}
		</div>
	);
};

export default Compact;
