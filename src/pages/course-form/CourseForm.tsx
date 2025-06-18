import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';

import css from './CourseForm.module.scss';
import { Label } from "../../widgets/input-label/label.tsx";
import { Input } from "../../widgets/input/input.tsx";
import { TextArea } from "../../widgets/textarea/textarea.tsx";
import { Competencies } from "../../widgets/competencies/competencies.tsx";
import { CompetenciesModal } from "../../widgets/competencies-modal/CompetenciesModal.tsx";
import { MaterialsModal } from "../../widgets/materials-modal/MaterialsModal.tsx";
import { CourseCreateControl } from "./index.ts";

interface Department {
    department_id: number;
    name: string;
}

interface CourseFormProps {
    title: string;
    description: string;
    competencies: number[];
    materials: number[];
    competencyNames: Map<number, string>;
    materialNames: Map<number, string>;
    isCompetencyModalOpen: boolean;
    isMaterialModalOpen: boolean;
    toggleCompetencyModal: () => void;
    toggleMaterialModal: () => void;
    handleCompetenciesSelect: (selectedCompetencies: number[]) => void;
    handleMaterialsSelect: (selectedMaterials: number[]) => void;
    handleTitleChange: (value: string) => void;
    handleDescriptionChange: (value: string) => void;
    onSave: () => void;
    mode: 'create' | 'update';
    courseId?: number;
    isSuperAdmin?: boolean;
    selectedOrganizationId?: number | null;
    setSelectedOrganizationId?: (id: number) => void;
    organizationsData?: { organization_id: number; name: string }[];
    // 👇 Добавлены пропсы для направления
    selectedDepartmentId: number | null;
    setSelectedDepartmentId: (id: number) => void;
    departmentsData: Department[];
}

export const CourseForm = ({
                               title,
                               description,
                               competencies,
                               materials,
                               competencyNames,
                               materialNames,
                               isCompetencyModalOpen,
                               isMaterialModalOpen,
                               toggleCompetencyModal,
                               toggleMaterialModal,
                               handleCompetenciesSelect,
                               handleMaterialsSelect,
                               handleTitleChange,
                               handleDescriptionChange,
                               onSave,
                               mode,
                               courseId,
                               selectedDepartmentId,
                               setSelectedDepartmentId,
                               departmentsData,
    isSuperAdmin,
    selectedOrganizationId,
    setSelectedOrganizationId,
    organizationsData
                           }: CourseFormProps) => {
    const initialCompetencies = competencies.map((id) => ({
        id,
        name: competencyNames.get(id) || 'Неизвестная компетенция',
    }));

    const initialMaterials = materials.map((id) => ({
        id,
        name: materialNames.get(id) || `Материал #${id}`
    }));

    useEffect(() => {
        document.body.style.overflow = (isCompetencyModalOpen || isMaterialModalOpen) ? 'hidden' : 'auto';
        return () => { document.body.style.overflow = 'auto'; };
    }, [isCompetencyModalOpen, isMaterialModalOpen]);

    return (
        <div className={css.wrapper}>
            <CourseCreateControl onSave={onSave} mode={mode} courseId={courseId} />

            <div className={css.form}>
                <Label label="Название курса">
                    <Input value={title} onChange={(e) => handleTitleChange(e.target.value)} />
                </Label>

                <Label label="Описание курса">
                        <TextArea
                            value={description}
                            onChange={(e) => handleDescriptionChange(e.target.value)}
                            placeholder="Кратко опишите цель и содержание курса..."
                            minRows={5}
                            maxRows={12}
                        />
                </Label>

                {/* 👇 Добавлен выбор направления */}
                <Label label="Направление курса">
                    <div className={css.selectGroup}>
                        <select
                            className={css.select}
                            value={selectedDepartmentId ?? ''}
                            onChange={(e) => setSelectedDepartmentId(Number(e.target.value))}
                        >
                            <option value="" disabled>Выберите направление</option>
                            {departmentsData.map((dep) => (
                                <option key={dep.department_id} value={dep.department_id}>
                                    {dep.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </Label>
                {isSuperAdmin && organizationsData && (
                    <Label label="Организация">
                        <div className={css.selectGroup}>
                            <select
                                className={css.select}
                                value={selectedOrganizationId ?? ''}
                                onChange={(e) => setSelectedOrganizationId?.(Number(e.target.value))}
                            >
                                <option value="" disabled>Выберите организацию</option>
                                {organizationsData.map((org) => (
                                    <option key={org.organization_id} value={org.organization_id}>
                                        {org.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </Label>
                )}
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
                        onClick={(e) => {
                            e.currentTarget.blur();
                            toggleCompetencyModal();
                        }}
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