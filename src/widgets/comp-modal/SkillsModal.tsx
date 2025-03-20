import { useEffect, useState } from 'react';
import {
    useFetchCompetenciesQuery,
    useDeleteCompetencyMutation,
    useFetchMaterialsQuery
} from '../../api/materialApi.ts';
import { toast } from 'react-toastify';
import styles from './SkillsModal.module.scss';
import { CreateCompetencyModal } from "../create-competency-modal/CreateCompetencyModal.tsx";
import EditIcon from '../../assets/images/edit.svg';
import TrashIcon from '../../assets/images/trash.svg';
import { EditCompetencyModal } from "../edit-competency-modal/EditCompetencyModal.tsx";

interface SkillsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SkillsModal = ({ isOpen, onClose }: SkillsModalProps) => {
    const { data: competenciesData, isLoading, isError, refetch } = useFetchCompetenciesQuery();
    const { data: materialsData } = useFetchMaterialsQuery();
    const [competencies, setCompetencies] = useState<{ competency_id: number; name: string; description: string }[]>([]);
    const [deleteCompetency] = useDeleteCompetencyMutation();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editCompetency, setEditCompetency] = useState<{ competency_id: number; name: string; description: string } | null>(null);


    useEffect(() => {
        if (isOpen) {
            refetch();
        }
    }, [isOpen, refetch]);

    useEffect(() => {
        if (competenciesData && competenciesData.data) {
            setCompetencies(competenciesData.data);
        }
    }, [competenciesData]);

    const handleEditClick = (competency: { competency_id: number; name: string; description?: string }) => {
        setEditCompetency({
            competency_id: competency.competency_id,
            name: competency.name,
            description: competency.description || "",
        });
    };

    const handleDelete = (competencyId: number, competencyName: string) => {
        const isLinked = materialsData?.data && materialsData.data.length > 0
            ? materialsData.data.some(material =>
                material.competencies.includes(competencyName)
            )
            : false;
        if (isLinked) {
            toast.error("Невозможно удалить компетенцию, так как она связана с одним или несколькими материалами.");
            return;
        }
        deleteCompetency(competencyId)
            .unwrap()
            .then(() => {
                refetch();
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

    const handleCreateCompetency = () => {
        refetch();
    };

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
                            <div className={styles.actionsContainer}>
                                <button
                                    className={styles.editButton}
                                    onClick={() => handleEditClick(competency)}
                                >
                                    <img src={EditIcon} alt="Редактировать"/>
                                </button>
                                <button
                                    className={styles.trashButton}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(competency.competency_id, competency.name);
                                    }}
                                >
                                    <img src={TrashIcon} alt="Удалить"/>
                                </button>
                            </div>
                            <div className={styles.textContainer}>
                                <span className={styles.competencyName}>{competency.name}</span>
                                <span className={styles.competencyDescription}>{competency.description}</span>
                            </div>
                        </li>
                    ))}
                </ul>

                <div className={styles.actions}>
                    <button onClick={onClose}>Закрыть</button>
                    <button onClick={() => setIsCreateModalOpen(true)} className={styles.createButton}>
                        Создать
                    </button>
                </div>
            </div>
            {isCreateModalOpen && (
                <CreateCompetencyModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onCompetencyCreated={handleCreateCompetency}
                />
            )}
            {editCompetency && (
                <EditCompetencyModal
                    isOpen={!!editCompetency}
                    onClose={() => setEditCompetency(null)}
                    competencyId={editCompetency.competency_id} // Передаём правильный ID
                    initialName={editCompetency.name}
                    initialDescription={editCompetency.description}
                    onCompetencyUpdated={refetch}
                />
            )}
        </div>
    );
};