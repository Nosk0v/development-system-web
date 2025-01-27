import css from './UpdateModal.module.scss';
import { useFetchCompetenciesQuery } from '../../api/materialApi.ts'; // Хук для получения компетенций
import { useState, useEffect } from 'react';

interface UpdateModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedCompetencies: string[]; // Список выбранных компетенций
    onSave: (updatedCompetencies: string[]) => void; // Обработчик сохранения
}

export const UpdateModal = ({
                                isOpen,
                                onClose,
                                selectedCompetencies,
                                onSave
                            }: UpdateModalProps) => {
    const { data, isLoading, error } = useFetchCompetenciesQuery();
    const [selected, setSelected] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen) {
            setSelected(selectedCompetencies); // Устанавливаем переданный список выбранных компетенций
        }
    }, [isOpen, selectedCompetencies]);

    const handleCompetencyToggle = (competencyName: string) => {
        setSelected((prev) =>
            prev.includes(competencyName)
                ? prev.filter((name) => name !== competencyName)
                : [...prev, competencyName]
        );
    };

    const handleSave = () => {
        onSave(selected); // Передаем обновленный список в родительский компонент
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
                            className={selected.includes(name) ? css.selected : css.listItem}
                            onClick={() => handleCompetencyToggle(name)}
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