import { useNavigate } from 'react-router-dom';
import { useId, ChangeEvent } from 'react';
import css from './CourseListControl.module.scss';

import { MainButton } from '../../../../../widgets/button/button';
import { Label } from '../../../../../widgets/input-label/label';
import { Input } from '../../../../../widgets/input/input';
import { getUserClaimsFromAccessToken } from '../../../../../api/jwt';

export const CourseListControl = ({ onSearch }: { onSearch: (query: string) => void }) => {
	const navigate = useNavigate();
	const searchId = useId();

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
			{/* Поле поиска */}
			<Label label="Поиск" color="black" id={searchId}>
				<Input className={css.input} id={searchId} onChange={handleSearchChange} />
			</Label>

			{/* Кнопки */}
			{isAdmin && (
				<MainButton text="Создать" className={css.mainButton} onClick={onCreateCourseClick} />
			)}
			<div className={css.bottomButtons}>
				{isAdmin && (
					<MainButton text="Материалы" className={css.compButton} onClick={onMaterialsClick} />
				)}
				<MainButton text="Выйти" className={css.typeButton} onClick={onLogoutClick} />
			</div>
		</div>
	);
};