import { useFetchCompetenciesQuery } from '../../api/materialApi.ts';
import css from './CompetenciesModal.module.scss';
import {useState} from "react";

interface CompetenciesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (selectedCompetencies: string[]) => void;
}

export const CompetenciesModal = ({ isOpen, onClose, onSelect }: CompetenciesModalProps) => {
    const { data, error, isLoading } = useFetchCompetenciesQuery();
    const [selectedCompetencies, setSelectedCompetencies] = useState<string[]>([]);

    const handleCompetencyToggle = (competencyId: string) => {
        setSelectedCompetencies((prev) =>
            prev.includes(competencyId)
                ? prev.filter((id) => id !== competencyId)
                : [...prev, competencyId]
        );
    };

    const handleSave = () => {
        onSelect(selectedCompetencies);
        onClose();
    };

    if (!isOpen) return null;

    if (isLoading) return <div className={css.loading}>Загрузка компетенций...</div>;
    if (error) return <div className={css.error}>Ошибка загрузки компетенций</div>;

    return (
        <div className={css.modal}>
            <div className={css.overlay} onClick={onClose}></div>
            <div className={css.content}>
                <h2>Выберите компетенции</h2>
                <ul className={css.list}>
                    {data?.data.map((competency) => (
                        <li
                            key={competency.competency_id}
                            className={selectedCompetencies.includes(String(competency.competency_id)) ? css.selected : ''}
                            onClick={() => handleCompetencyToggle(String(competency.competency_id))}
                        >
                            {competency.name}
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