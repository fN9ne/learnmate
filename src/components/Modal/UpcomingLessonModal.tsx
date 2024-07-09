import { FC } from "react";
import { useAppSelector } from "@/hooks/useAppSelector";

import ModalWrapper from "./ModalWrapper";
import UpcomingLesson from "@/pages/Schedule/UpcomingLesson";

const UpcomingLessonModal: FC = () => {
	const { upcomingLesson } = useAppSelector((state) => state.modal);

	return (
		<ModalWrapper isActive={upcomingLesson} name="upcomingLesson">
			<UpcomingLesson />
		</ModalWrapper>
	);
};

export default UpcomingLessonModal;
