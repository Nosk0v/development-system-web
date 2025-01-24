import css from './UpdateModal.module.scss';
import { useFetchCompetenciesQuery } from '../../api/materialApi.ts'; // Хук для получения компетенций
import { useState, useEffect } from 'react';

interface UpdateModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const UpdateModal = ({
                                isOpen,
                                onClose
                            }: UpdateModalProps) => {
    const { data, isLoading, error } = useFetchCompetenciesQuery(); // Получаем данные
    const [selected, setSelected] = useState<number[]>([]); // Состояние для выбранных компетенций

    useEffect(() => {
        if (!isOpen) {
            setSelected([]); // Сбрасываем выбор при закрытии
        }
    }, [isOpen]);

    const handleCompetencyToggle = (competencyId: number) => {
        setSelected((prev) =>
            prev.includes(competencyId)
                ? prev.filter((id) => id !== competencyId)
                : [...prev, competencyId]
        );
    };

    const handleSave = () => {
        console.log('Выбранные компетенции:', selected); // Логируем выбранные компетенции
        onClose(); // Закрываем модальное окно
    };

    if (!isOpen) return null; // Если окно закрыто, не рендерим ничего

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
                <h2>Выберите компетенции</h2>
                <ul className={css.list}>
                    {data?.data.map(({ competency_id, name }) => (
                        <li
                            key={competency_id}
                            className={selected.includes(competency_id) ? css.selected : css.listItem}
                            onClick={() => handleCompetencyToggle(competency_id)}
                        >
                            {name}
                        </li>
                    ))}
                </ul>
                <div className={css.actions}>
                    <button onClick={handleSave} className={css.saveButton}>
                        Сохранить
                    </button>
                    <button onClick={onClose} className={css.cancelButton}>
                        Отмена
                    </button>
                </div>
            </div>
        </div>
    );
};