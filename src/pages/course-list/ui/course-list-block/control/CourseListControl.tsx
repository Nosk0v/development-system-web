import { useNavigate } from 'react-router-dom';
import { useId, ChangeEvent, useState } from 'react';

import css from './CourseListControl.module.scss';

import { MainButton } from '../../../../../widgets/button/button';
import { Label } from '../../../../../widgets/input-label/label';
import { Input } from '../../../../../widgets/input/input';
import { getUserClaimsFromAccessToken } from '../../../../../api/jwt';
import { CompletedCoursesModal } from '../../../../../widgets/comp-course/CompleteCourseModal.tsx';
import { InviteCodeModal } from '../../../../../widgets/invite-code-modal/InviteCodeModal.tsx';

export const CourseListControl = ({ onSearch }: { onSearch: (query: string) => void }) => {
	const navigate = useNavigate();
	const searchId = useId();

	const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false);
	const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

	const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
		onSearch(event.target.value);
	};

	const onMaterialsClick = () => {
		navigate('/material-list');
	};

	const onCreateCourseClick = () => {
		navigate('/create-course');
	};

	const onLogoutClick = () => {
		localStorage.removeItem('access_token');
		window.location.replace('/');
	};

	const claims = getUserClaimsFromAccessToken();
	const isAdmin = claims?.role === 0 || claims?.role === 2;

	return (
		<div className={css.wrapper}>
			<Label label="Поиск" color="black" id={searchId}>
				<Input className={css.input} id={searchId} onChange={handleSearchChange} />
			</Label>

			{isAdmin && (
				<MainButton text="Создать" className={css.mainButton} onClick={onCreateCourseClick} />
			)}
			<div className={css.bottomButtons}>
				{isAdmin && (
					<>
						<MainButton text="Материалы" className={css.compButton} onClick={onMaterialsClick} />
						<MainButton
							text="Коды приглашений"
							className={css.inviteButton}
							onClick={() => setIsInviteModalOpen(true)}
						/>
					</>
				)}
				<MainButton
					text="Пройденные курсы"
					className={css.completedButton}
					onClick={() => setIsCompletedModalOpen(true)}
				/>
				<MainButton text="Выйти" className={css.typeButton} onClick={onLogoutClick} />
			</div>

			{isCompletedModalOpen && (
				<CompletedCoursesModal
					isOpen={isCompletedModalOpen}
					onClose={() => setIsCompletedModalOpen(false)}
				/>
			)}

			{isInviteModalOpen && (
				<InviteCodeModal
					isOpen={isInviteModalOpen}
					onClose={() => setIsInviteModalOpen(false)}
				/>
			)}
		</div>
	);
};