import { Input } from '../input/input.tsx';
import { useState, useEffect } from 'react';
import { useCreateMaterialTypeMutation, useFetchMaterialTypeQuery } from '../../api/materialApi.ts';
import { toast } from 'react-toastify';
import styles from './CreateMaterialTypeModal.module.scss';

interface CreateMaterialTypeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onTypeCreated: () => void;
}

export const CreateMaterialTypeModal = ({ isOpen, onClose, onTypeCreated }: CreateMaterialTypeModalProps) => {
    const [newTypeName, setNewTypeName] = useState('');
    const [createMaterialType] = useCreateMaterialTypeMutation();
    const { data: materialTypesData, isLoading, isError } = useFetchMaterialTypeQuery();

    const handleCreateType = async () => {
        const typeExists = materialTypesData?.data.some(
            (type: { type: string }) => type.type.toLowerCase() === newTypeName.toLowerCase()
        );

        if (typeExists) {
            toast.error("Тип материала с таким названием уже существует.");
            return;
        }
        if (newTypeName.length > 30) {
            toast.error("Название типа материала должно не превышать 30 символов.");
            return;
        }
        if (newTypeName.length < 2) {
            toast.error("Название типа материала должно содержать минимум 2 символа.");
            return;
        }
        try {
            await createMaterialType({type: newTypeName}).unwrap();
            toast.success("Тип материала успешно создан.");
            setNewTypeName('');
            onTypeCreated();
            onClose();
        } catch (error) {
            console.error('Ошибка создания типа материала:', error);
            toast.error("Произошла ошибка при создании типа материала.");
        }
    };

    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                e.preventDefault();
                handleCreateType();
            }
        };
        if (isOpen) {
            document.addEventListener('keydown', handleGlobalKeyDown);
        } else {
            document.removeEventListener('keydown', handleGlobalKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleGlobalKeyDown);
        };
    }, [handleCreateType, isOpen, newTypeName]);

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
                    <button onClick={onClose} className={styles.cancelButton}>Закрыть</button>
                    <button onClick={handleCreateType} className={styles.createButton}>Создать</button>
                </div>
            </div>
        </div>
    );
};