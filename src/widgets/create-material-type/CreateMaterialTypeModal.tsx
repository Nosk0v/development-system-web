import { Input } from '../input/input.tsx';  // Подключите компонент Input
import { useState } from 'react';
import { useCreateMaterialTypeMutation, useFetchMaterialTypeQuery } from '../../api/materialApi.ts';
import { toast } from 'react-toastify';
import styles from './CreateMaterialTypeModal.module.scss';

interface CreateMaterialTypeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onTypeCreated: () => void;  // Функция для рефетча данных
}

export const CreateMaterialTypeModal = ({ isOpen, onClose, onTypeCreated }: CreateMaterialTypeModalProps) => {
    const [newTypeName, setNewTypeName] = useState('');
    const [createMaterialType] = useCreateMaterialTypeMutation();
    const { data: materialTypesData, isLoading, isError } = useFetchMaterialTypeQuery();

    const handleCreateType = () => {
        // Проверяем, если тип уже существует
        const typeExists = materialTypesData?.data.some((type: { type: string }) => type.type.toLowerCase() === newTypeName.toLowerCase());

        if (typeExists) {
            toast.error("Тип материала с таким названием уже существует.");
            return;
        }

        if (newTypeName.length >= 2) {
            createMaterialType({ type: newTypeName })
                .unwrap()
                .then(() => {
                    toast.success("Тип материала успешно создан.");
                    setNewTypeName('');
                    onTypeCreated();  // Вызываем функцию для рефетча
                    onClose();
                })
                .catch((error) => {
                    console.error('Ошибка создания типа материала:', error);
                    toast.error("Произошла ошибка при создании типа материала.");
                });
        } else {
            toast.error("Название типа материала должно содержать минимум 2 символа.");
        }
    };

    // Ожидание загрузки типов перед рендером
    if (isLoading) return <div>Загрузка...</div>;
    if (isError) return <div>Ошибка загрузки типов.</div>;

    if (!isOpen) return null;

    return (
        <div className={styles.modal}>
            <div className={styles.overlay} onClick={onClose}></div>
            <div className={styles.content}>
                <h2>Создание нового типа материала</h2>
                <Input
                    placeholder="Введите название типа материала"
                    value={newTypeName}
                    onChange={(e) => setNewTypeName(e.target.value)}
                    className={styles.inputField}
                />
                <div className={styles.actions}>
                    <button onClick={onClose}>Закрыть</button>
                    <button onClick={handleCreateType}>Создать</button>
                </div>
            </div>
        </div>
    );
};