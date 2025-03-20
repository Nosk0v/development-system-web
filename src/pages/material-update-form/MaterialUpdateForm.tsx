import css from './MaterialUpdateForm.module.scss';
import { MaterialUpdateControl } from './material-update-control';
import { Label } from '../../widgets/input-label/label';
import { Input } from '../../widgets/input/input';
import { TextArea } from '../../widgets/textarea/textarea';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useCallback } from 'react';
import { UpdateModal } from '../../widgets/update-modal/UpdateModal';
import { DropdownUpdateMenu } from "../../widgets/dropdown-menu/dropdown-update-menu.tsx";
import TrashIcon from '../../assets/images/trash.svg';

interface MaterialUpdateFormProps {
    title: string;
    description: string;
    content: string;
    competencies: string[];
    handleCompetenciesSelect: (selectedCompetencies: string[]) => void;
    handleTitleChange: (value: string) => void;
    handleDescriptionChange: (value: string) => void;
    handleContentChange: (value: string) => void;
    materialType: number | null;
    materialTypeName: string;
    handleMaterialTypeChange: (value: number) => void;
    onSave: () => void;
    isModalOpen: boolean;
    toggleModal: () => void;
}

export const MaterialUpdateForm = ({
                                       title,
                                       description,
                                       content,
                                       competencies,
                                       handleTitleChange,
                                       handleDescriptionChange,
                                       handleContentChange,
                                       handleCompetenciesSelect,
                                       onSave,
                                       materialType,
                                       materialTypeName,
                                       handleMaterialTypeChange,
                                       isModalOpen,
                                       toggleModal
                                   }: MaterialUpdateFormProps) => {

    const handleRemoveCompetency = useCallback((index: number) => {
        const updatedCompetencies = competencies.filter((_, i) => i !== index);
        handleCompetenciesSelect(updatedCompetencies);
    }, [competencies, handleCompetenciesSelect]);

    useEffect(() => {
        // Handling the overflow behavior for the modal
        document.body.style.overflow = isModalOpen ? 'hidden' : 'auto';
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
                    <DropdownUpdateMenu
                        value={materialType}
                        selectedTypeName={materialTypeName}
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
                                            className={css.trashButton}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveCompetency(index);
                                            }}
                                        >
                                            <img src={TrashIcon} alt={"Удалить"}/>
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <span>Нет выбранных компетенций</span>
                        )}
                    </div>
                    <button
                        onClick={toggleModal}
                        className={css.addCompetencyButton}
                    >
                        Добавить компетенции
                    </button>
                </Label>
            </div>

            <UpdateModal
                isOpen={isModalOpen}
                onClose={toggleModal}
                selectedCompetencies={competencies}
                onSave={handleCompetenciesSelect}
            />
            <ToastContainer />
        </div>
    );
};