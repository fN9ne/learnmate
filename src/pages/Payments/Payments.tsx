import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { FC, useState } from "react";

import PaymentsIcon from "@icons/payments.svg?react";
import WindowIcon from "@icons/window.svg?react";

import Block from "@/components/UI/Block";
import Switch, { SwitchType } from "@/components/UI/Switch";

import { useAppSelector } from "@/hooks/useAppSelector";
import { IPayment } from "@/redux/slices/payments";
import { ILesson } from "@/redux/slices/lessons";
import { months } from "@/datetime";
import { useActions } from "@/hooks/useActions";
import Loader from "@/components/Loader";

interface PaymentsByMonth {
	[month: string]: IPayment[];
}

const groupPaymentsByMonth = (payments: IPayment[], lessons: ILesson[]): PaymentsByMonth => {
	const paymentsByMonth: PaymentsByMonth = {};

	payments.forEach((payment) => {
		const lesson = lessons.find((lesson) => lesson.id === payment.lessonId);

		if (lesson) {
			let month = new Date(lesson.date).toLocaleString("default", { month: "long", year: "numeric" });

			month = month.slice(0, 1).toUpperCase() + month.slice(1, month.length - 3);

			if (!paymentsByMonth[month]) {
				paymentsByMonth[month] = [];
			}

			paymentsByMonth[month].push(payment);
		}
	});

	return paymentsByMonth;
};

const Payments: FC = () => {
	useDocumentTitle("Платежи");

	const [isHidePaid, setIsHidePaid] = useState<boolean>(false);
	const [isSeparate, setIsSeparate] = useState<boolean>(false);

	const { payments, isFetching: isPaymentsFetching } = useAppSelector((state) => state.payments);
	const { lessons, isFetching: isLessonsFetching } = useAppSelector((state) => state.lessons);

	const sortedPayments = (payments: IPayment[], lessons: ILesson[]): IPayment[] => {
		const lessonDateMap = new Map<number, string>();

		lessons.forEach((lesson) => {
			lessonDateMap.set(lesson.id, lesson.date);
		});

		const sorted = [...payments].sort((a, b) => {
			const dateA = lessonDateMap.get(a.lessonId);
			const dateB = lessonDateMap.get(b.lessonId);

			if (dateA && dateB) {
				return new Date(dateB).getTime() - new Date(dateA).getTime();
			}

			return 0;
		});

		return sorted;
	};

	return (
		<div className="payments">
			{isLessonsFetching || isPaymentsFetching ? (
				<Loader isFetching={isLessonsFetching || isPaymentsFetching} className="payments__loader" />
			) : (
				<Block
					icon={<PaymentsIcon />}
					title="Платежи"
					headerContent={
						<div className="payments__head">
							<Switch text="Разделять по месяцам" isChecked={isSeparate} onClick={(value: boolean) => setIsSeparate(value)} />
							<Switch text="Скрывать оплаченные" isChecked={isHidePaid} onClick={(value: boolean) => setIsHidePaid(value)} />
						</div>
					}
				>
					<div
						className={`payments__list${isSeparate ? " payments__list--separated" : ""}${
							Object.keys(groupPaymentsByMonth(payments, lessons)).length >= 3 ? " payments__list--limited" : ""
						}`}
					>
						{payments.length > 0 ? (
							!isSeparate ? (
								sortedPayments(payments, lessons)
									.filter((payment) => (isHidePaid ? !payment.isPaid : true))
									.map((payment, index) => <Payment {...payment} key={index} />)
							) : (
								Object.entries(groupPaymentsByMonth(payments, lessons)).map((block, index) => (
									<PaymentsBlock isHidePaid={isHidePaid} title={block[0]} content={block[1]} key={index} />
								))
							)
						) : (
							<div className="payments__empty">
								<div className="text text--n">Пока что ваши платежи пусты.</div>
							</div>
						)}
					</div>
				</Block>
			)}
		</div>
	);
};

export default Payments;

const Payment: FC<IPayment> = ({ id, isPaid, lessonId }) => {
	const { lessons } = useAppSelector((state) => state.lessons);
	const { students } = useAppSelector((state) => state.students);

	const lesson = lessons.find((lesson) => lessonId === lesson.id);
	const student = students.find((student) => student.id === lesson?.studentId);
	const date = lesson ? new Date(lesson.date) : new Date();

	const { updatePayment } = useActions();

	return (
		lesson &&
		student && (
			<div className="payment">
				<div className="payment__student">
					<div className="payment__color" style={{ backgroundColor: student.color || "#000" }} />
					<div className="payment__name">
						{student.name}, {student.username.slice(1)}
					</div>
					<a
						href={`/student/${student.id}`}
						title='Открыть страницу ученика "Марк, @fN9ne"'
						target="_blank"
						className="payment__open-student"
						onClick={(event: React.MouseEvent<HTMLAnchorElement>) => event.stopPropagation()}
					>
						<WindowIcon />
					</a>
				</div>
				<div className="payment__content">
					<div className="payment__date">
						{date.getDate()} {months[date.getMonth()][0]}
					</div>
					<Switch
						type={SwitchType.Correct}
						isChecked={isPaid}
						text={{ onText: "Оплачено", offText: "Не оплачено" }}
						onClick={(value: boolean) => updatePayment({ id, data: { isPaid: value } })}
					/>
				</div>
			</div>
		)
	);
};

interface PaymentsBlockProps {
	title: string;
	content: IPayment[];
	isHidePaid: boolean;
}

const PaymentsBlock: FC<PaymentsBlockProps> = ({ title, content, isHidePaid }) => {
	return (
		<div className="payments-block">
			<div className="payments-block__header">{title}</div>
			<div className="payments-block__content">
				{content.filter((payment) => (isHidePaid ? !payment.isPaid : true)).length > 0 ? (
					content
						.filter((payment) => (isHidePaid ? !payment.isPaid : true))
						.map((payment, index) => <Payment {...payment} key={index} />)
				) : (
					<div className="payments-block__empty text text--n">
						За этот месяц не было занятий (или у вас включено "Скрывать оплаченные").
					</div>
				)}
			</div>
		</div>
	);
};
