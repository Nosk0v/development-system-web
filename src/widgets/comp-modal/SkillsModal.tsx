import { useEffect, useState } from 'react';
import {
    useFetchCompetenciesQuery,
    useDeleteCompetencyMutation,
    useFetchMaterialsQuery
} from '../../api/materialApi.ts';
import { toast } from 'react-toastify';
import styles from './SkillsModal.module.scss';

interface SkillsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SkillsModal = ({ isOpen, onClose }: SkillsModalProps) => {
    const { data: competenciesData, isLoading, isError } = useFetchCompetenciesQuery();
    const { data: materialsData } = useFetchMaterialsQuery();
    const [competencies, setCompetencies] = useState<{ competency_id: number; name: string }[]>([]);
    const [deleteCompetency] = useDeleteCompetencyMutation();

    useEffect(() => {
        if (competenciesData && competenciesData.data) {
            setCompetencies(competenciesData.data);
        }
    }, [competenciesData]);

    const handleDelete = (competencyId: number, competencyName: string) => {
        // Проверяем, связана ли компетенция с материалом
        const isLinked = materialsData?.data.some(material =>
            material.competencies.includes(competencyName)
        );

        if (isLinked) {
            toast.error("Невозможно удалить компетенцию, так как она связана с одним или несколькими материалами.");
            return;
        }

        deleteCompetency(competencyId)
            .unwrap()
            .then(() => {
                setCompetencies((prev) => prev.filter((c) => c.competency_id !== competencyId));
                toast.success("Компетенция успешно удалена.");
            })
            .catch((error) => {
                console.error('Ошибка удаления компетенции:', error);
                toast.error("Ошибка при удалении компетенции.");
            });
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    return (
        <div className={styles.modal}>
            <div className={styles.overlay} onClick={onClose}></div>
            <div className={styles.content}>
                <h2>Список компетенций</h2>

                {isLoading && <p>Загрузка компетенций...</p>}
                {isError && <p>Ошибка загрузки компетенций</p>}

                <ul className={styles.list}>
                    {competencies.map((competency) => (
                        <li key={competency.competency_id} className={styles.wrapper}>
                            <span className={styles.competency}>{competency.name}</span>
                            <button
                                className={styles.deleteButton}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(competency.competency_id, competency.name);
                                }}
                            >
                                🗑️
                            </button>
                        </li>
                    ))}
                </ul>

                <div className={styles.actions}>
                    <button onClick={onClose}>Закрыть</button>
                </div>
            </div>
        </div>
    );
};
