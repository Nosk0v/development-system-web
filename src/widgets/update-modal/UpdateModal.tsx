import css from './UpdateModal.module.scss';
import { useFetchCompetenciesQuery } from '../../api/materialApi.ts'; // Импортируем хук для получения компетенций

interface UpdateModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const UpdateModal = ({
                                isOpen,
                                onClose
                            }: UpdateModalProps) => {
    const { data, isLoading, error } = useFetchCompetenciesQuery(); // Получаем список компетенций

    if (!isOpen) return null; // Если модальное окно не открыто, ничего не рендерим

    if (isLoading) {
        return (
            <div className={css.modal}>
                <div className={css.overlay} onClick={onClose}></div>
                <div className={css.content}>Загрузка...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={css.modal}>
                <div className={css.overlay} onClick={onClose}></div>
                <div className={css.content}>Ошибка при загрузке компетенций</div>
            </div>
        );
    }

    return (
        <div className={css.modal}>
            <div className={css.overlay} onClick={onClose}></div>
            <div className={css.content}>
                <h2>Список компетенций</h2>
                <ul className={css.list}>
                    {data?.data.map(({ competency_id, name }) => (
                        <li key={competency_id}>
                            {name}
                        </li>
                    ))}
                </ul>
                <div className={css.actions}>
                    <button onClick={onClose}>Закрыть</button>
                </div>
            </div>
        </div>
    );
};