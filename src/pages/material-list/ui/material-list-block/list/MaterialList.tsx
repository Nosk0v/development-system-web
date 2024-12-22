import { MaterialListItem } from './item';
import { useFetchMaterialsQuery } from '../../../../../api/materialApi.ts';
import css from './MaterialList.module.scss';

interface Material {
	material_id: number;
	title: string;
	competencies: string[];
	imageUrl: string;
}

export const MaterialList = ({ searchQuery }: { searchQuery: string }) => {
	const { data, error, isLoading } = useFetchMaterialsQuery();

	if (isLoading) {
		return <div>Загрузка...</div>;
	}

	if (error) {
		return <div>Ошибка при загрузке материалов</div>;
	}

	// Преобразуем данные и добавляем изображение, если отсутствует
	const materials: Material[] = data?.data.map((item) => ({
		...item,
		imageUrl: item.imageUrl || 'https://picsum.photos/200/300',
	})) || [];

	// Фильтруем материалы на основе поискового запроса
	const filteredMaterials = materials.filter((material) =>
		material.title.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const items = filteredMaterials.map((material) => (
		<MaterialListItem
			key={material.material_id}
			title={material.title}
			competencies={material.competencies}
			imageUrl={material.imageUrl}
		/>
	));

	return (
		<div className={css.wrapper}>
			<div className={css.list}>
				{items.length > 0 ? items : <div>Материалы отсутствуют</div>}
			</div>
		</div>
	);
};