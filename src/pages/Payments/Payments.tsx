import "./Payments.scss";

import { FC, useEffect } from "react";
import { months, weekdays } from "../../dates/dates";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import Switch, { SwitchType } from "../../components/Switch";
import { useActions } from "../../hooks/useActions";
import { useAppSelector } from "../../hooks/useAppSelector";
import supabase from "../../services/createClient";

import { AnimatePresence as AP, motion as m } from "framer-motion";

const Payments: FC = () => {
	useDocumentTitle("Платежи");

	const { payments, isLoaded } = useAppSelector((state) => state.payments);
	const { setPayments, updateFetchingPayments } = useActions();

	const { email } = useAppSelector((state) => state.user);

	const handleSwitch = (hash: string, value: boolean) => {
		const newPayments = payments.map((payment) => {
			if (payment.hash === hash) {
				return {
					...payment,
					status: value,
				};
			}

			return payment;
		});

		setPayments(newPayments);
	};

	useEffect(() => {
		if (email && isLoaded) {
			const updatePayments = async () => {
				updateFetchingPayments(true);

				await supabase.from("payments").update({ payments: payments }).eq("author_email", email);

				updateFetchingPayments(false);
			};

			updatePayments();
		}
	}, [email, payments, isLoaded]);

	const transitions = {
		initial: { opacity: 0, scale: 0.95 },
		animate: { opacity: 1, scale: 1 },
		exit: { opacity: 0, scale: 0.95 },
	};

	return (
		<div className="payments">
			<AP mode="wait" initial={false}>
				{!isLoaded && (
					<m.div {...transitions} key="loader" className="payments__loader loader">
						<span></span>
					</m.div>
				)}
				{isLoaded && (
					<m.table {...transitions} key="table" className="students-table">
						<tbody>
							<tr>
								<th className="students-table__compact"></th>
								<th>ученик</th>
								<th>дата занятия</th>
								<th>к оплате</th>
								<th>статус</th>
							</tr>
							{payments.map(
								(payment, index) =>
									new Date() >
										new Date(payment.date.year, payment.date.month, payment.date.day, payment.date.hour, payment.date.minute) && (
										<tr key={index}>
											<td className="students-table__compact">
												<div className="students-table__color" style={{ backgroundColor: payment.student?.color }}></div>
											</td>
											<td>
												<span>{`${payment.student?.name}, ${payment.student?.username}`}</span>
											</td>
											<td>{`${payment.date.day} ${months[payment.date.month][1]}, ${
												weekdays[(new Date(payment.date.year, payment.date.month, payment.date.day).getDay() + 6) % 7][0]
											}`}</td>
											<td>{`${payment.status !== null ? payment.student?.payment.toString() + " ₽" : ""}`}</td>
											<td>
												{payment.status !== null && (
													<Switch
														isChecked={payment.status}
														onClick={(value: boolean) => handleSwitch(payment.hash, value)}
														text={{ offText: "Не оплачен", onText: "Оплачен" }}
														type={SwitchType.redngreen}
													/>
												)}
											</td>
										</tr>
									)
							)}
						</tbody>
					</m.table>
				)}
			</AP>
		</div>
	);
};

export default Payments;
