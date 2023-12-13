import "./Payments.scss";

import { FC } from "react";
import { Payment } from "./types";
import { months, weekdays } from "../../dates/dates";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const payments: Payment[] = [];

const Payments: FC = () => {
	useDocumentTitle("Платежи");

	return (
		<div className="payments">
			<table className="students-table">
				<tbody>
					<tr>
						<th>ученик</th>
						<th>дата занятия</th>
						<th>к оплате</th>
						<th>статус</th>
					</tr>
					{payments.map((payment, index) => (
						<tr key={index}>
							<td>
								<div className="students-table__color" style={{ backgroundColor: payment.student.color }}></div>
								<span>{`${payment.student.name}, ${payment.student.username}`}</span>
							</td>
							<td>{`${payment.date.day} ${months[payment.date.month][1]}, ${weekdays[payment.date.weekday]}`}</td>
							<td>{payment.student.payment}</td>
							<td>{payment.status}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default Payments;
