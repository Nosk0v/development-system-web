import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';

import css from './CourseForm.module.scss';
import {Label} from "../../widgets/input-label/label.tsx";
import {Input} from "../../widgets/input/input.tsx";
import {TextArea} from "../../widgets/textarea/textarea.tsx";
import {Competencies} from "../../widgets/competencies/competencies.tsx";
import {CompetenciesModal} from "../../widgets/competencies-modal/CompetenciesModal.tsx";
import {MaterialsModal} from "../../widgets/materials-modal/MaterialsModal.tsx";
import {CourseCreateControl} from "./index.ts";

interface CourseFormProps {
    title: string;
    description: string;
    competencies: number[];
    materials: number[];
    competencyNames: Map<number, string>;
    materialNames: Map<number, string>; // <--- Добавлено
    isCompetencyModalOpen: boolean;
    isMaterialModalOpen: boolean;
    toggleCompetencyModal: () => void;
    toggleMaterialModal: () => void;
    handleCompetenciesSelect: (selectedCompetencies: number[]) => void;
    handleMaterialsSelect: (selectedMaterials: number[]) => void;
    handleTitleChange: (value: string) => void;
    handleDescriptionChange: (value: string) => void;
    onSave: () => void;
}

export const CourseForm = ({
                               title,
                               description,
                               competencies,
                               materials,
                               competencyNames,
                               materialNames, // <--- Добавлено
                               isCompetencyModalOpen,
                               isMaterialModalOpen,
                               toggleCompetencyModal,
                               toggleMaterialModal,
                               handleCompetenciesSelect,
                               handleMaterialsSelect,
                               handleTitleChange,
                               handleDescriptionChange,
                               onSave,
                           }: CourseFormProps) => {
    const initialCompetencies = competencies.map((id) => ({
        id,
        name: competencyNames.get(id) || 'Неизвестная компетенция',
    }));
    const initialMaterials = materials.map((id) => ({
        id,
        name: materialNames.get(id) || `Материал #${id}` // <--- Обновлено
    }));


    useEffect(() => {
        document.body.style.overflow = (isCompetencyModalOpen || isMaterialModalOpen) ? 'hidden' : 'auto';
        return () => { document.body.style.overflow = 'auto'; };
    }, [isCompetencyModalOpen, isMaterialModalOpen]);

    return (
        <div className={css.wrapper}>
            <CourseCreateControl onSave={onSave} />

            <div className={css.form}>
                <Label label="Название курса">
                    <Input value={title} onChange={(e) => handleTitleChange(e.target.value)} />
                </Label>
                <Label label="Описание курса">
                    <TextArea
                        value={description}
                        height={140}
                        onChange={(e) => handleDescriptionChange(e.target.value)}
                    />
                </Label>

                <Label label="Материалы">
                    <Competencies
                        initialCompetencies={initialMaterials}
                        onUpdateCompetencies={(updated) => handleMaterialsSelect(updated.map((c) => c.id))}
                    />
                    <button
                        onClick={(e) => {
                            e.currentTarget.blur();
                            toggleMaterialModal();
                        }}
                        className={css.addMaterialButton}
                    >
                        Добавить материалы
                    </button>
                </Label>

                <Label label="Компетенции">
                    <Competencies
                        initialCompetencies={initialCompetencies}
                        onUpdateCompetencies={(updated) => handleCompetenciesSelect(updated.map((c) => c.id))}
                    />
                    <button
                        onClick={(e) => { e.currentTarget.blur(); toggleCompetencyModal(); }}
                        className={css.addCompetencyButton}
                    >
                        Добавить компетенции
                    </button>
                </Label>
            </div>

            <MaterialsModal
                isOpen={isMaterialModalOpen}
                onClose={toggleMaterialModal}
                onSelect={handleMaterialsSelect}
                selectedMaterials={materials}
            />

            <CompetenciesModal
                isOpen={isCompetencyModalOpen}
                onClose={toggleCompetencyModal}
                onSelect={handleCompetenciesSelect}
                selectedCompetencies={competencies}
                competencyNames={competencyNames}
            />

            <ToastContainer />
        </div>
    );
};