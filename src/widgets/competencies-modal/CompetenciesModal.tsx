import css from './CompetenciesModal.module.scss';
import { useState, useEffect } from 'react';

interface CompetenciesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (selectedCompetencies: number[]) => void; // Передаем массив ID компетенций
    selectedCompetencies?: number[];  // Массив ID выбранных компетенций
    competencyNames: Map<number, string>;  // Список имен компетенций, где ключ - это ID компетенции
}

export const CompetenciesModal = ({
                                      isOpen,
                                      onClose,
                                      onSelect,
                                      selectedCompetencies = [],
                                      competencyNames
                                  }: CompetenciesModalProps) => {
    const [selected, setSelected] = useState<number[]>(selectedCompetencies);

    // Обновляем состояние выбранных компетенций, если они переданы извне
    useEffect(() => {
        setSelected(selectedCompetencies);
    }, [selectedCompetencies]);

    const handleCompetencyToggle = (competencyId: number) => {
        setSelected((prev) =>
            prev.includes(competencyId)
                ? prev.filter((id) => id !== competencyId)
                : [...prev, competencyId]
        );
    };

    const handleSave = () => {
        onSelect(selected); // Передаем выбранные компетенции в родительский компонент
        onClose(); // Закрываем модальное окно
    };

    if (!isOpen) return null;

    return (
        <div className={css.modal}>
            <div className={css.overlay} onClick={onClose}></div>
            <div className={css.content}>
                <h2>Выберите компетенции</h2>
                <ul className={css.list}>
                    {Array.from(competencyNames.entries()).map(([competencyId, competencyName]) => (
                        <li
                            key={competencyId}
                            className={selected.includes(competencyId) ? css.selected : ''}
                            onClick={() => handleCompetencyToggle(competencyId)}
                        >
                            {competencyName}
                        </li>
                    ))}
                </ul>
                <div className={css.actions}>
                    <button onClick={handleSave}>Сохранить</button>
                    <button onClick={onClose}>Отмена</button>
                </div>
            </div>
        </div>
    );
};