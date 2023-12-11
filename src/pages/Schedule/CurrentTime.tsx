import { FC, useEffect, useState } from "react";

const CurrentTime: FC = () => {
	interface CurrentTime {
		hours: string;
		minutes: string;
		seconds: string;
	}

	const [currentTime, setCurrentTime] = useState<CurrentTime>({ hours: "01", minutes: "38", seconds: "00" });

	let intervalId: number;

	useEffect(() => {
		clearInterval(intervalId);

		const newTime = (): CurrentTime => {
			const date = new Date();

			const hours = date.getHours();
			const minutes = date.getMinutes();
			const seconds = date.getSeconds();

			return {
				hours: hours < 10 ? "0" + hours : hours + "",
				minutes: minutes < 10 ? "0" + minutes : minutes + "",
				seconds: seconds < 10 ? "0" + seconds : seconds + "",
			};
		};

		setCurrentTime(newTime());

		intervalId = window.setInterval(() => setCurrentTime(newTime()), 1000);

		return () => clearInterval(intervalId);
	}, []);

	return (
		<div className="schedule-block">
			<div className="schedule-current-time">
				<div className="schedule-label">Время</div>
				<div className="schedule-current-time__display">{`${currentTime.hours}:${currentTime.minutes}:${currentTime.seconds}`}</div>
			</div>
		</div>
	);
};

export default CurrentTime;
