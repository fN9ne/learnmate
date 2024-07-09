import Block from "@/components/UI/Block";
import { FC } from "react";

import NotesIcon from "@icons/note.svg?react";
import PlusIcon from "@icons/plus.svg?react";
import { useActions } from "@/hooks/useActions";
import { useAppSelector } from "@/hooks/useAppSelector";

import { AnimatePresence as AP, motion as m } from "framer-motion";
import { generateId } from "@/functions";
import Loader from "@/components/Loader";

const Notes: FC = () => {
	const { notes, isFetching } = useAppSelector((state) => state.notes);
	const { addNote } = useActions();

	const handleAddNote = () => addNote({ id: generateId(notes), content: "" });

	return (
		<Block
			small
			fit
			title="Заметки"
			icon={<NotesIcon />}
			headerContent={
				<button onClick={handleAddNote} className="notes__add">
					<PlusIcon />
				</button>
			}
		>
			<div className="notes">
				{isFetching ? (
					<Loader isFetching={isFetching} className="notes__loader" />
				) : (
					<>
						{notes.length > 0 ? (
							notes.map((note) => <Note {...note} key={note.id} />)
						) : (
							<div className="text text--n">
								Заметок пока нет, можете выдохнуть и сделать перерыв! Самое время пополнить свой запас вдохновения и свежих идей.
							</div>
						)}
					</>
				)}
			</div>
		</Block>
	);
};

export default Notes;

interface NoteProps {
	id: number;
	content: string;
}

const Note: FC<NoteProps> = ({ id, content }) => {
	const { removeNote, updateNote } = useActions();

	const transitions = {
		initial: { opacity: 0, scale: 0.95 },
		animate: { opacity: 1, scale: 1 },
		exit: { opacity: 0, scale: 0.95 },
	};

	return (
		<AP mode="wait" initial={false}>
			<m.div key={id} {...transitions} className="note">
				<div className="note__header">
					<div className="note__name">Заметка {id + 1}</div>
					<button onClick={() => removeNote(id)} className="note__remove">
						<PlusIcon />
					</button>
				</div>
				<textarea
					className="note__textarea"
					placeholder=" Написать заметку..."
					value={content}
					onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
						updateNote({ id, data: { id, content: event.target.value } })
					}
				></textarea>
			</m.div>
		</AP>
	);
};
