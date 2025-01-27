import css from './MaterialUpdateForm.module.scss';
import { MaterialUpdateControl } from './material-update-control';
import { Label } from '../../widgets/input-label/label';
import { Input } from '../../widgets/input/input';
import { DropdownMenu } from '../../widgets/dropdown-menu/dropdown-menu';
import { TextArea } from '../../widgets/textarea/textarea';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from "react";
import { UpdateModal } from '../../widgets/update-modal/UpdateModal';

interface MaterialUpdateFormProps {
    title: string;
    description: string;
    content: string;
    materialType: string;
    competencies: string[]; // Массив строк
    handleCompetenciesSelect: (selectedCompetencies: string[]) => void; // Принимает массив строк
    handleTitleChange: (value: string) => void;
    handleDescriptionChange: (value: string) => void;
    handleContentChange: (value: string) => void;
    handleMaterialTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onSave: () => void;
    isModalOpen: boolean; // Добавьте это
    toggleModal: () => void; // Добавьте это
}



export const MaterialUpdateForm = ({
                                       title,
                                       description,
                                       content,
                                       materialType,
                                       competencies,
                                       handleTitleChange,
                                       handleDescriptionChange,
                                       handleContentChange,
                                       handleMaterialTypeChange,
                                       handleCompetenciesSelect,
                                       onSave,

                                   }: MaterialUpdateFormProps) => {

    // Модальное окно для выбора компетенций
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModalWindow = () => {
        setIsModalOpen(!isModalOpen);
    };

    // Обработчик удаления компетенции
    const handleRemoveCompetency = (index: number) => {
        const updatedCompetencies = competencies.filter((_, i) => i !== index);
        handleCompetenciesSelect(updatedCompetencies); // Передаем обновленный массив родительскому компоненту
    };

    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isModalOpen]);

    return (
        <div className={css.wrapper}>
            <MaterialUpdateControl onSave={onSave} />

            <div className={css.form}>
                <Label label="Название">
                    <Input
                        value={title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                    />
                </Label>
                <Label label="Тип материала">
                    <DropdownMenu
                        options={[
                            { value: '1', label: 'Статья' },
                            { value: '2', label: 'Книга' },
                            { value: '3', label: 'Видео' },
                        ]}
                        value={materialType}
                        onChange={handleMaterialTypeChange}
                    />
                </Label>
                <Label label="Описание материала">
                    <TextArea
                        value={description}
                        height={100}
                        onChange={(e) => handleDescriptionChange(e.target.value)}
                    />
                </Label>
                <Label label="Контент материала">
                    <TextArea
                        value={content}
                        height={200}
                        onChange={(e) => handleContentChange(e.target.value)}
                    />
                </Label>

                <Label label="Компетенции">
                    <div className={css.competenciesList}>
                        {competencies.length > 0 ? (
                            competencies.map((competency, index) => (
                                <div key={index} className={css.wrapperCompetency}>
                                    <div className={css.content}>
                                        <span className={css.competency}>{competency}</span>
                                        <button
                                            className={css.deleteButton}
                                            onClick={(e) => {
                                                e.stopPropagation(); // Чтобы клик не активировал другие действия
                                                handleRemoveCompetency(index); // Удалить компетенцию
                                            }}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <span>Нет выбранных компетенций</span>
                        )}
                    </div>
                    <button
                        onClick={toggleModalWindow}
                        className={css.addCompetencyButton}
                    >
                        Добавить компетенции
                    </button>
                </Label>
            </div>

            <UpdateModal
                isOpen={isModalOpen}
                onClose={toggleModalWindow}
                selectedCompetencies={competencies} // Передаем текущий список компетенций
                onSave={(updatedCompetencies) => handleCompetenciesSelect(updatedCompetencies)}
            />
            <ToastContainer/>
        </div>
    );
};