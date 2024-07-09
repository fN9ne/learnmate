import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { FC } from "react";

import UsersGuideIcon from "@icons/usersGuide.svg?react";
import ScheduleIcon from "@icons/schedule.svg?react";
import StudentsIcon from "@icons/students.svg?react";
import LPIcon from "@icons/learningPlan.svg?react";
import StudentIcon from "@icons/person.svg?react";

import Block from "@/components/UI/Block";

interface IArticle {
	pictureUrl: string;
	title: string;
	description: string;
}

interface ISection {
	icon: React.ReactNode;
	title: string;
	articles: IArticle[];
}

const content: ISection[] = [
	{
		icon: <ScheduleIcon />,
		title: "Расписание",
		articles: [
			{
				pictureUrl: "schedule/1.jpg",
				title: "Открытие страницы ученика",
				description:
					"Наверняка было неудобно - открыл занятие, смотришь на ученика и думаешь: «Хм, а прошёл ли я с этим учеников 3 урок по Старченко?». И приходилось закрывать окно, переходить на страницу «Ученики», нажимать на ученика и смотреть. Теперь всё просто, когда вы выбрали ученика в занятии, просто нажмите на соответствующую иконку, и страница ученика откроется в новой вкладке!",
			},
			{
				pictureUrl: "schedule/2.jpg",
				title: "День с назначенными занятиями",
				description:
					"Тут без шуток. Видите такой день - значит, в этот день занятие. Время показывается до близжайшего занятия, в случае, если время не указано, будет надпись «No time». Цветные квадратики - цвета учеников с которыми на этот день есть занятие.",
			},
			{
				pictureUrl: "schedule/3.gif",
				title: "Перемещение занятий",
				description:
					"Помните ту самую фишку с перемещением занятий из первой версии? Мы про неё не забыли и добавили во вторую! Хватайте квадратик с цветом ученика и перемещайте его на нужный день!",
			},
			{
				pictureUrl: "schedule/4.jpg",
				title: "Текущий день",
				description: "Видите в календаре день который обрамлён чёрной рамкой? Значит этот день - сегодня.",
			},
		],
	},
	{
		icon: <StudentsIcon />,
		title: "Ученики",
		articles: [
			{
				pictureUrl: "/students/1.jpg",
				title: "Не активные ученики",
				description:
					"Если на странице ученика вы отметили его как «Не активен», то в списке учеников он будет достаточно бледным... так же про не активных учеников в следующем блоке ->",
			},
			{
				pictureUrl: "/students/2.jpg",
				title: "Скрыть не активных учеников",
				description:
					"Во второй версии мы добавили (по мимо самой возможности делать учеников не активными), возможность скрыть их на странице учеников, если вам так захочется их больше не видеть...",
			},
			{
				pictureUrl: "/students/3.jpg",
				title: "Валидность никнейма в телеграм",
				description:
					"Мы учли проблематику с указанием никнейма в телеграм учеников, и сделали так, что вы теперь можете вводить никнейм хоть с символом «@», хоть без него, а наша платформа уже сама разбирётся, что с этим делать!",
			},
		],
	},
	{
		icon: <LPIcon />,
		title: "Учебный план",
		articles: [
			{
				pictureUrl: "/lp/1.jpg",
				title: "Цвета для книг",
				description:
					"Рано или поздно книг может стать достаточно много, и поэтому мы решили, добавить возможность назначения цвета для каждой книги, для более лучшей навигации по ним (но если вам так угодно, цвет вы можете и не добавлять)",
			},
			{
				pictureUrl: "/lp/2.gif",
				title: "Редактирование книг и презентаций",
				description:
					"Мы изменили подход к редактированию кнги и презентаций, и убрали кнопку «Редактировать». Взаместо этого теперь вам достаточно просто кликнуть на книгу или презентацию, чтобы начать её редактировать.",
			},
		],
	},
	{
		icon: <StudentIcon />,
		title: "Ученик",
		articles: [
			{
				pictureUrl: "/student/1.gif",
				title: "Фильтр истории занятий",
				description: "В новой версии мы добавили возможность фильтрации истории занятий!",
			},
			{
				pictureUrl: "/student/2.gif",
				title: "Просмотр занятия",
				description:
					"Мы оставили старый вариант просмотра занятия через историю занятий, но добавили пару фишек: теперь наглядно показывается оплачено занятие или нет, так же можно по необходимости отметить занятие как «оплачено», а так же открыть занятие на странице «Расписание».",
			},
		],
	},
];

const UsersGuide: FC = () => {
	useDocumentTitle("Руководство пользователя");

	return (
		<div className="users-guide">
			<Block title="Руководство пользователя и нововведения второй версии" icon={<UsersGuideIcon />}>
				{content.map((section, index) => (
					<Section {...section} key={index} />
				))}
			</Block>
		</div>
	);
};

export default UsersGuide;

const Section: FC<ISection> = ({ articles, icon, title }) => {
	return (
		<div className="users-guide__section">
			<div className="users-guide__header">
				{icon}
				<span>Страница «{title}»</span>
			</div>
			<div className="users-guide__content">
				{articles.map((article, index) => (
					<Article {...article} key={index} />
				))}
			</div>
		</div>
	);
};

const Article: FC<IArticle> = ({ description, pictureUrl, title }) => {
	return (
		<div className="users-guide__article">
			<img src={`/usersGuide/${pictureUrl}`} alt="article picture" className="users-guide__picture" />
			<div className="users-guide__title">{title}</div>
			<div className="users-guide__description text text--n">{description}</div>
		</div>
	);
};
