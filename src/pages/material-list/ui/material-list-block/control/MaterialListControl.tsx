import { useNavigate } from 'react-router-dom';
import css from './MaterialListControl.module.scss';
import { MainButton } from '../../../../../widgets/button/button';
import { Label } from '../../../../../widgets/input-label/label';
import { Input } from '../../../../../widgets/input/input';
import { useId } from 'react';

export const MaterialListControl = ({ onSearch }: { onSearch: (query: string) => void }) => {
	const navigate = useNavigate();
	const searchId = useId();

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		onSearch(event.target.value); // Передаём значение в родительский компонент
	};

	const onCreateMaterialClick = () => {
		navigate('/create-material');
	};

	return (
		<div className={css.wrapper}>
			<Label
				label="Поиск"
				color="black"
				id={searchId}
			>
				<Input id={searchId} onChange={handleSearchChange} />
			</Label>
			<MainButton
				text="Создать"
				onClick={onCreateMaterialClick}
			/>
		</div>
	);
};