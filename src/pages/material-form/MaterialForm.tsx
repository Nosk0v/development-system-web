import css from './MaterialForm.module.scss';
import { MaterialCreateControl } from './material-create-control';
import { Label } from '../../widgets/input-label/label';
import { Input } from '../../widgets/input/input';
import { DropdownMenu } from '../../widgets/dropdown-menu/dropdown-menu';
import { TextArea } from '../../widgets/textarea/textarea';
import { Competencies } from '../../widgets/competencies/competencies';
import { CompetenciesModal } from '../../widgets/competencies-modal/CompetenciesModal';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, {useEffect} from "react";


interface MaterialFormProps {
    title: string;
    description: string;
    content: string;
    competencies: number[];
    competencyNames: Map<number, string>;
    isModalOpen: boolean;
    toggleModal: () => void;
    handleCompetenciesSelect: (selectedCompetencies: number[]) => void;
    handleTitleChange: (value: string) => void;
    handleDescriptionChange: (value: string) => void;
    handleContentChange: (value: string) => void;
    onSave: () => void;
    value: number | null;       // <--- Основной проп для значения
    onChange: (typeId: number) => void; // <--- Основной обработчик
}

export const MaterialForm = ({
                                 title,
                                 description,
                                 content,
                                 competencies,
                                 competencyNames,
                                 isModalOpen,
                                 toggleModal,
                                 handleCompetenciesSelect,
                                 handleTitleChange,
                                 handleDescriptionChange,
                                 handleContentChange,
                                 onSave,
                                 value,
                                 onChange,

                             }: MaterialFormProps) => {

    const initialCompetencies = competencies.map((id) => ({
        id,
        name: competencyNames.get(id) || 'Неизвестная компетенция',
    }));

    const onAddCompetenciesClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.blur()
        toggleModal();
    }


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
            {/* Передача пропсов в MaterialUpdateControl */}
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
                        value={value}        // <--- Используем переданное значение
                        onChange={onChange}  // <--- Используем переданный обработчик
                    />
                </Label>
                <Label label="Описание материала">
                    <TextArea
                        value={description}
                        onChange={(e) => handleDescriptionChange(e.target.value)}
                        minRows={3}
                        maxRows={8}
                        placeholder="Введите краткое описание..."
                    />
                </Label>
                <Label
                    label={
                        <div className={css.labelWithTooltip}>
                            <span>Контент материала</span>
                            <span
                                className={css.tooltipIcon}
                                data-tooltip="Если вы добавляете ссылку на видео или статью, указывайте только саму ссылку в формате https://example.com. Предпросмотр подгружается автоматически."
                            >
        ?
      </span>
                        </div>
                    }
                >
                    <TextArea
                        value={content}
                        onChange={(e) => handleContentChange(e.target.value)}
                        minRows={6}
                        maxRows={16}
                        placeholder="Введите текст, видео-ссылку или статью..."
                    />
                </Label>
                <Label label="Компетенции">
                    <Competencies
                        initialCompetencies={initialCompetencies}
                        onUpdateCompetencies={(updatedCompetencies) =>
                            handleCompetenciesSelect(updatedCompetencies.map((c) => c.id))
                        }
                    />
                    <button
                        onClick={onAddCompetenciesClick}
                        className={css.addCompetencyButton}
                    >
                        Добавить компетенции
                    </button>
                </Label>
            </div>

            <CompetenciesModal
                isOpen={isModalOpen}
                onClose={toggleModal}
                onSelect={handleCompetenciesSelect}
                selectedCompetencies={competencies}
                competencyNames={competencyNames}
            />

            <ToastContainer />
        </div>
    );
};