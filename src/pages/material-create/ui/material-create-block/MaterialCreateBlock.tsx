import css from './MaterialCreateBlock.module.scss';
import { MaterialCreateControl } from './material-create-control';
import { Label } from '../../../../widgets/input-label/label';
import { Input } from '../../../../widgets/input/input';
import { DropdownMenu } from '../../../../widgets/dropdown-menu/dropdown-menu';
import { TextArea } from '../../../../widgets/textarea/textarea';
import { Competencies } from '../../../../widgets/competencies/competencies';
import { CompetenciesModal } from '../../../../widgets/competencies-modal/CompetenciesModal';
import {useId, useState} from "react";

export const MaterialCreateBlock = () => {
	const materialTypes = [
		{ value: 'chooseType', label: 'Выберите тип материала' },
		{ value: 'article', label: 'Статья' },
		{ value: 'video', label: 'Видео' },
		{ value: 'book', label: 'Книга' },
	];

	const [competencies, setCompetencies] = useState<string[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const titleId = useId();
	const typeId = useId();
	const descriptionId = useId();

	const openModal = () => setIsModalOpen(true);
	const closeModal = () => setIsModalOpen(false);

	const handleCompetenciesSelect = (selectedCompetencies: string[]) => {
		setCompetencies((prev) => [...prev, ...selectedCompetencies]);
	};

	return (
		<div className={css.wrapper}>
			<MaterialCreateControl />
			<Label label="Название" id={titleId}>
				<Input id={titleId} />
			</Label>
			<Label label="Тип материала" id={typeId}>
				<DropdownMenu options={materialTypes} id={typeId} />
			</Label>
			<Label label="Содержание материала" id={descriptionId}>
				<TextArea id={descriptionId} height={100} />
			</Label>
			<Label label="Компетенции" color="black" fontSize="20px">
				<Competencies initialCompetencies={competencies} />
				<button onClick={openModal} style={{ marginTop: '10px' }}>
					Добавить компетенции
				</button>
			</Label>
			<CompetenciesModal
				isOpen={isModalOpen}
				onClose={closeModal}
				onSelect={handleCompetenciesSelect}
			/>
		</div>
	);
};