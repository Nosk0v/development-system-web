import css from './CompetenciesModal.module.scss';
import { useState, useEffect } from 'react';

interface CompetenciesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (selectedCompetencies: number[]) => void;
    selectedCompetencies?: number[];
    competencyNames: Map<number, string>;
}

export const CompetenciesModal = ({
                                      isOpen,
                                      onClose,
                                      onSelect,
                                      selectedCompetencies = [],
                                      competencyNames
                                  }: CompetenciesModalProps) => {
    const [selected, setSelected] = useState<number[]>(selectedCompetencies);

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
        onSelect(selected);
        onClose();
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                handleSave();
            } else if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, selected, onSelect, onClose]);

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
                    <button onClick={onClose}>Отмена</button>
                    <button onClick={handleSave}>Сохранить</button>
                </div>
            </div>
        </div>
    );
};