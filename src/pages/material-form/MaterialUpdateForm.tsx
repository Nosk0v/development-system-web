import css from './MaterialUpdateForm.module.scss';
import { MaterialCreateControl } from './material-create-control';
import { Label } from '../../widgets/input-label/label';
import { Input } from '../../widgets/input/input';
import { DropdownMenu } from '../../widgets/dropdown-menu/dropdown-menu';
import { TextArea } from '../../widgets/textarea/textarea';
import React from 'react';

interface MaterialUpdateFormProps {
    title: string;
    description: string;
    content: string;
    materialType: string;
    competencies: number[];
    competencyNames: Map<number, string>;
    handleCompetenciesSelect: (selectedCompetencies: number[]) => void;
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
                                       competencyNames,
                                       handleCompetenciesSelect,
                                       handleTitleChange,
                                       handleDescriptionChange,
                                       handleContentChange,
                                       handleMaterialTypeChange,
                                       onSave,
                                   }: MaterialUpdateFormProps) => {

    const availableCompetencies = Array.from(competencyNames.entries()).map(([id, name]) => ({
        id,
        name,
    }));

    const toggleCompetency = (id: number) => {
        const updatedCompetencies = competencies.includes(id)
            ? competencies.filter((compId) => compId !== id)
            : [...competencies, id];
        handleCompetenciesSelect(updatedCompetencies);
    };

    return (
        <div className={css.wrapper}>
            <MaterialCreateControl onSave={onSave} />

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
                    <div className={css.competenciesSelector}>
                        {availableCompetencies.map((comp) => (
                            <div
                                key={comp.id}
                                className={`${css.competencyItem} ${
                                    competencies.includes(comp.id) ? css.selected : ''
                                }`}
                                onClick={() => toggleCompetency(comp.id)}
                            >
                                {comp.name}
                            </div>
                        ))}
                    </div>
                </Label>
            </div>
        </div>
    );
};