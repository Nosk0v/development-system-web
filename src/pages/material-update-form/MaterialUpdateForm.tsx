import css from './MaterialUpdateForm.module.scss';
import { MaterialUpdateControl } from './material-update-control';
import { Label } from '../../widgets/input-label/label';
import { Input } from '../../widgets/input/input';
import { DropdownMenu } from '../../widgets/dropdown-menu/dropdown-menu';
import { TextArea } from '../../widgets/textarea/textarea';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React from "react";

interface MaterialUpdateFormProps {
    title: string;
    description: string;
    content: string;
    materialType: string;
    competencies: string[]; // Изменили на массив строк
    isModalOpen: boolean;
    toggleModal: () => void;
    handleCompetenciesSelect: (selectedCompetencies: string[]) => void; // Изменили на массив строк
    handleTitleChange: (value: string) => void;
    handleDescriptionChange: (value: string) => void;
    handleContentChange: (value: string) => void;
    handleMaterialTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onSave: () => void;
}

export const MaterialUpdateForm = ({
                                       title,
                                       description,
                                       content,
                                       materialType,
                                       competencies,
                                       toggleModal,
                                       handleTitleChange,
                                       handleDescriptionChange,
                                       handleContentChange,
                                       handleMaterialTypeChange,
                                       onSave,
                                   }: MaterialUpdateFormProps) => {
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
                        {competencies.map((competency, index) => (
                            <span key={index} className={css.competency}>
                                {competency}
                            </span>
                        ))}
                    </div>
                    <button
                        onClick={toggleModal}
                        className={css.addCompetencyButton}
                    >
                        Добавить компетенции
                    </button>
                </Label>
            </div>

            <ToastContainer />
        </div>
    );
};