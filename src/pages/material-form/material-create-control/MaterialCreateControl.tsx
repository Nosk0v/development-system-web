import { MainButton } from '../../../widgets/button/button.tsx';
import { SecondaryButton } from '../../../widgets/cancel-button/secondary-button.tsx';
import { useNavigate } from 'react-router-dom';
import css from './MaterialCreateControl.module.scss';
import {useFetchMaterialsQuery} from "../../../api/materialApi.ts";

interface MaterialCreateControlProps {
	onSave: () => void;
}

export const MaterialCreateControl = ({ onSave }: MaterialCreateControlProps) => {
	const navigate = useNavigate();
	const { refetch } = useFetchMaterialsQuery();

	const onClose = async () => {
		try {
			await refetch();

			navigate('/material-list');
		} catch (error) {
			console.error('Ошибка при перезагрузке списка:', error);
		}
	};

	return (
		<div className={css.wrapper}>
			<SecondaryButton  text="Закрыть" onClick={onClose} />
			<MainButton text="Сохранить" onClick={() => onSave()} />
		</div>
	);
};