import { useState, useEffect } from 'react';
import { Input } from '../input/input.tsx';
import { TextArea } from '../textarea/textarea.tsx';
import { useCreateCompetencyMutation } from '../../api/materialApi.ts';
import { toast } from 'react-toastify';
import styles from './CreateCompetencyModal.module.scss';

interface CreateCompetencyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCompetencyCreated: () => void;
}

export const CreateCompetencyModal = ({ isOpen, onClose, onCompetencyCreated }: CreateCompetencyModalProps) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [createCompetency] = useCreateCompetencyMutation();

    const handleCreateCompetency = () => {
        if (name.length < 2) {
            toast.error("Название компетенции должно содержать минимум 2 символа.");
            return;
        }
        if (name.length > 400) {
            toast.error("Название компетенции не должно превышать 400 символов.");
            return;
        }
        if (description.length === 0) {
            toast.error("Пожалуйста, заполните описание компетенции!");
            return;
        }
        if (description.length > 400) {
            toast.error("Описание компетенции не должно превышать 400 символов.");
            return;
        }

        createCompetency({ name, description })
            .unwrap()
            .then(() => {
                toast.success("Компетенция успешно создана.");
                setName('');
                setDescription('');
                onCompetencyCreated();
                onClose();
            })
            .catch((error) => {
                console.error('Ошибка создания компетенции:', error);
                toast.error("Произошла ошибка при создании компетенции.");
            });
    };


    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                e.preventDefault();
                handleCreateCompetency();
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
    }, [isOpen, name, description]);

    if (!isOpen) return null;

    return (
        <div className={styles.modal}>
            <div className={styles.overlay} onClick={onClose}></div>
            <div className={styles.content}>
                <h2>Создание новой компетенции</h2>

                <Input
                    placeholder="Введите название компетенции"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={styles.inputField}
                />

                <TextArea
                    placeholder="Введите описание компетенции"
                    height={100}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <div className={styles.actions}>
                    <button onClick={onClose}>Закрыть</button>
                    <button onClick={handleCreateCompetency}>Создать</button>
                </div>
            </div>
        </div>
    );
};