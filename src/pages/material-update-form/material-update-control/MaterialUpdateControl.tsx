import { MainButton } from '../../../widgets/button/button.tsx';
import { SecondaryButton } from '../../../widgets/cancel-button/secondary-button.tsx';
import { useNavigate, useParams } from 'react-router-dom';
import css from './MaterialUpdateControl.module.scss';
import {useFetchMaterialsQuery} from "../../../api/materialApi.ts";

interface MaterialUpdateControlProps {
	onSave: () => void;
}

export const MaterialUpdateControl = ({ onSave }: MaterialUpdateControlProps) => {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>(); // Получаем ID из URL
	const { refetch } = useFetchMaterialsQuery();
	const onClose = async () => {
		try {

			await refetch();

			// После обновления данных навигация на главную страницу
			navigate(`/view-materials/${id}`);
			window.location.reload()
		} catch (error) {
			console.error('Ошибка при перезагрузке списка:', error);
		}
	}

	return (
		<div className={css.wrapper}>
			<MainButton text="Сохранить" onClick={onSave} />
			<SecondaryButton text="Закрыть" onClick={onClose} />
		</div>
	);
};