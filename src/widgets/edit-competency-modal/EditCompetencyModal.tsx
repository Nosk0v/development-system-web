import { useState } from "react";
import { useUpdateCompetencyMutation } from "../../api/materialApi.ts";
import { toast } from "react-toastify";
import styles from "./EditCompetencyModal.module.scss";
import { Input } from '../input/input.tsx';
import { TextArea } from '../textarea/textarea.tsx';

interface EditCompetencyModalProps {
    isOpen: boolean;
    onClose: () => void;
    competencyId: number;
    initialName: string;
    initialDescription: string;
    onCompetencyUpdated: () => void;
}

export const EditCompetencyModal = ({
                                        isOpen,
                                        onClose,
                                        competencyId,
                                        initialName,
                                        initialDescription,
                                        onCompetencyUpdated
                                    }: EditCompetencyModalProps) => {
    const [name, setName] = useState(initialName);
    const [description, setDescription] = useState(initialDescription);
    const [updateCompetency] = useUpdateCompetencyMutation();

    const handleSave = async () => {
        if (name === initialName && description === initialDescription) {
            toast.info("Пожалуйста, внесите хотя бы одно изменение в компетенцию!");
            return;
        }

        if (name.length < 2) {
            toast.error("Название компетенции должно содержать минимум 2 символа.");
            return;
        }
        if (description.length === 0) {
            toast.error("Пожалуйста, заполните описание компетенции!");
            return;
        }

        try {
            await updateCompetency({ competencyId, data: { name, description } }).unwrap();
            toast.success("Компетенция успешно обновлена.");
            onCompetencyUpdated();
            onClose();
        } catch (error) {
            console.error("Ошибка при обновлении компетенции:", error);
            toast.error("Ошибка при обновлении компетенции.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modal}>
            <div className={styles.overlay} onClick={onClose}></div>
            <div className={styles.content}>
                <h2>Редактировать компетенцию</h2>
                <Input
                    placeholder="Введите название компетенции"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={styles.inputField}
                />

                <TextArea
                    placeholder="Введите описание компетенции"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <div className={styles.actions}>
                    <button onClick={onClose} className={styles.cancelButton}>Отмена</button>
                    <button onClick={handleSave} className={styles.saveButton}>Сохранить</button>
                </div>
            </div>
        </div>
    );
};