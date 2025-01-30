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
import  {useEffect} from "react";


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
    // Преобразуем список id компетенций в массив объектов { id, name }
    const initialCompetencies = competencies.map((id) => ({
        id,
        name: competencyNames.get(id) || 'Неизвестная компетенция',
    }));





    useEffect(() => {
        if (isModalOpen) {
            // Отключаем прокрутку на теле документа, когда модальное окно открыто
            document.body.style.overflow = 'hidden';
        } else {
            // Включаем прокрутку снова, когда модальное окно закрыто
            document.body.style.overflow = 'auto';
        }

        // Очищаем эффект, когда компонент будет размонтирован
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
                    <Competencies
                        initialCompetencies={initialCompetencies}
                        onUpdateCompetencies={(updatedCompetencies) =>
                            handleCompetenciesSelect(updatedCompetencies.map((c) => c.id))
                        }
                    />
                    <button
                        onClick={toggleModal}
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