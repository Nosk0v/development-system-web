// MaterialTypesModal.tsx
import { useEffect, useState } from 'react';
import { useFetchMaterialTypeQuery, useDeleteMaterialTypeMutation, useFetchMaterialsQuery } from '../../api/materialApi.ts';
import { toast } from 'react-toastify';
import styles from './MaterialTypesModal.module.scss';
import { CreateMaterialTypeModal } from '../create-material-type/CreateMaterialTypeModal';  // Импортируем новый компонент

interface MaterialTypesModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const MaterialTypesModal = ({ isOpen, onClose }: MaterialTypesModalProps) => {
    const { data: materialTypesData, isLoading: isMaterialTypesLoading, isError: isMaterialTypesError, refetch } = useFetchMaterialTypeQuery();
    const { data: materialsData, isLoading: isMaterialsLoading, isError: isMaterialsError } = useFetchMaterialsQuery();  // Fetch all materials
    const [materialTypes, setMaterialTypes] = useState<{ type_id: number; type: string }[]>([]);
    const [deleteMaterialType] = useDeleteMaterialTypeMutation();
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);

    useEffect(() => {
        if (materialTypesData && materialTypesData.data) {
            setMaterialTypes(materialTypesData.data);
        }
    }, [materialTypesData]);

    const handleDelete = (typeId: number, typeName: string) => {
        if (materialsData && materialsData.data.some((material) => material.type_name === typeName)) {
            toast.error("Невозможно удалить тип материала, так как он используется в одном или нескольких материалах.");
            return;
        }

        deleteMaterialType(typeId)
            .unwrap()
            .then(() => {
                setMaterialTypes((prevTypes) => prevTypes.filter((type) => type.type_id !== typeId));
                toast.success("Тип материала успешно удалён.");
            })
            .catch((error) => {
                console.error('Ошибка удаления типа материала:', error);
                toast.error("Произошла ошибка при удалении типа материала.");
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

    // Функция для перезагрузки списка типов после создания
    const handleTypeCreated = () => {
        refetch();  // Вызываем refetch для обновления данных
    };

    return (
        <div className={styles.modal}>
            <div className={styles.overlay} onClick={onClose}></div>
            <div className={styles.content}>
                <h2>Список типов материалов</h2>

                {isMaterialTypesLoading && <p>Загрузка типов материалов...</p>}
                {isMaterialTypesError && <p>Ошибка загрузки типов материалов</p>}
                {isMaterialsLoading && <p>Загрузка материалов...</p>}
                {isMaterialsError && <p>Ошибка загрузки материалов</p>}

                <ul className={styles.list}>
                    {materialTypes.map((type) => (
                        <li key={type.type_id} className={styles.wrapper}>
                            <span className={styles.competency}>{type.type}</span>
                            <button
                                className={styles.deleteButton}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(type.type_id, type.type);
                                }}
                            >
                                🗑️
                            </button>
                        </li>
                    ))}
                </ul>

                <div className={styles.actions}>
                    <button onClick={onClose}>Закрыть</button>
                    <button onClick={() => setCreateModalOpen(true)}>Создать</button>
                </div>
            </div>

            {/* Модалка для создания нового типа материала */}
            <CreateMaterialTypeModal
                isOpen={isCreateModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onTypeCreated={handleTypeCreated} />
        </div>
    );
};