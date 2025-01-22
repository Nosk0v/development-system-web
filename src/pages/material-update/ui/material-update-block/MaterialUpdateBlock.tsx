import { useParams } from 'react-router-dom';
import { useFetchMaterialByIdQuery } from '../../../../api/materialApi.ts';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';


export const MaterialUpdateBlock = () => {
	const { id } = useParams<{ id: string }>();

	// Fetch material data by ID
	const { data: materialData, error: materialError, isLoading: isMaterialLoading } = useFetchMaterialByIdQuery(Number(id));

	// Form states
	const [title, setTitle] = useState<string>('');
	const [description, setDescription] = useState<string>('');
	const [content, setContent] = useState<string>('');
	const [materialType, setMaterialType] = useState<string>('');
	const [competencies, setCompetencies] = useState<number[]>([]);
	const [competencyNames, setCompetencyNames] = useState<Map<number, string>>(new Map());

	// Initialize form fields from API data
	useEffect(() => {
		if (materialData) {
			setTitle(materialData.title || '');
			setMaterialType(materialData.type_id?.toString() || '');
			setDescription(materialData.description || '');
			setContent(materialData.content || '');

			const competenciesArray = materialData.competencies.map((comp) => parseInt(comp, 10));
			setCompetencies(competenciesArray);

			const competencyNamesMap = new Map<number, string>();
			competenciesArray.forEach((compId) => {
				competencyNamesMap.set(compId, `Компетенция ${compId}`); // Example names
			});
			setCompetencyNames(competencyNamesMap);
		}
	}, [materialData]);

	if (isMaterialLoading) return <div>Загрузка...</div>;
	if (materialError) return <div>Ошибка загрузки материала</div>;

	// Handle checkbox toggle for competencies
	const handleCompetencyToggle = (competencyId: number) => {
		setCompetencies((prev) =>
			prev.includes(competencyId)
				? prev.filter((id) => id !== competencyId)
				: [...prev, competencyId]
		);
	};

	return (
		<form className={css.form}>
			<h1>Редактирование материала</h1>

			<div className={css.field}>
				<label htmlFor="title">Название:</label>
				<input
					id="title"
					type="text"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
			</div>

			<div className={css.field}>
				<label htmlFor="description">Описание:</label>
				<textarea
					id="description"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
				/>
			</div>

			<div className={css.field}>
				<label htmlFor="content">Содержание:</label>
				<textarea
					id="content"
					value={content}
					onChange={(e) => setContent(e.target.value)}
				/>
			</div>

			<div className={css.field}>
				<label htmlFor="materialType">Тип материала:</label>
				<select
					id="materialType"
					value={materialType}
					onChange={(e) => setMaterialType(e.target.value)}
				>
					<option value="" disabled>Выберите тип</option>
					<option value="1">Тип 1</option>
					<option value="2">Тип 2</option>
					{/* Add additional types as needed */}
				</select>
			</div>

			<div className={css.field}>
				<label>Компетенции:</label>
				<ul className={css.competenciesList}>
					{Array.from(competencyNames.entries()).map(([competencyId, competencyName]) => (
						<li key={competencyId}>
							<label>
								<input
									type="checkbox"
									checked={competencies.includes(competencyId)}
									onChange={() => handleCompetencyToggle(competencyId)}
								/>
								{competencyName}
							</label>
						</li>
					))}
				</ul>
			</div>

			<div className={css.actions}>
				<button type="button" onClick={() => toast.info('Сохранение пока не реализовано')}>
					Сохранить
				</button>
			</div>
		</form>
	);
};