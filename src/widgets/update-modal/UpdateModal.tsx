import css from './UpdateModal.module.scss';
import { useFetchCompetenciesQuery } from '../../api/materialApi.ts'; // Хук для получения компетенций
import { useState, useEffect } from 'react';

interface UpdateModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedCompetencies: string[]; // Список выбранных компетенций (имена)
    onSave: (updatedCompetencies: string[]) => void; // Обработчик сохранения
}

export const UpdateModal = ({
                                isOpen,
                                onClose,
                                selectedCompetencies,
                                onSave
                            }: UpdateModalProps) => {
    const { data, isLoading, error } = useFetchCompetenciesQuery();
    const [selected, setSelected] = useState<number[]>([]); // Состояние теперь хранит ID компетенций

    useEffect(() => {
        if (isOpen) {
            // Преобразуем список имен в список ID для начальной загрузки
            const selectedIds = data?.data
                .filter((competency) => selectedCompetencies.includes(competency.name))
                .map((competency) => competency.competency_id) || [];
            setSelected(selectedIds);
        }
    }, [isOpen, selectedCompetencies, data?.data]);

    const handleCompetencyToggle = (competencyId: number) => {
        setSelected((prev) =>
            prev.includes(competencyId)
                ? prev.filter((id) => id !== competencyId)
                : [...prev, competencyId]
        );
    };

    const handleSave = () => {
        // Передаем имена компетенций, соответствующие выбранным ID, в родительский компонент
        const updatedCompetencies = data?.data
            .filter((competency) => selected.includes(competency.competency_id))
            .map((competency) => competency.name) || [];
        onSave(updatedCompetencies);
        onClose();
    };

    if (!isOpen) return null;

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
                            onClick={() => handleCompetencyToggle(competency_id)} // Используем ID для выбора
                        >
                            {name}
                        </li>
                    ))}
                </ul>
                <div className={css.actions}>
                    <button onClick={onClose} className={css.cancelButton}>
                        Отмена
                    </button>
                    <button onClick={handleSave} className={css.saveButton}>
                        Сохранить
                    </button>

                </div>
            </div>
        </div>
    );
};