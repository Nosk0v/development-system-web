import { useState, useEffect } from 'react';
import { useFetchMaterialsQuery } from '../../../../../api/materialApi.ts';
import { MaterialListItem } from './item';
import {toast, ToastContainer} from 'react-toastify';
import { useDeleteMaterialMutation } from '../../../../../api/materialApi.ts';
import 'react-toastify/dist/ReactToastify.css';
import css from './MaterialList.module.scss';

interface Material {
	material_id: number;
	title: string;
	competencies: string[];
	imageUrl: string;
}

export const MaterialList = ({ searchQuery }: { searchQuery: string }) => {
	const { data, error, isLoading } = useFetchMaterialsQuery();
	const [materials, setMaterials] = useState<Material[]>([]);
	const [selectedMaterialId, setSelectedMaterialId] = useState<number | null>(null); // Для хранения выбранного материала
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [deleteMaterial, { isLoading: isDeleting }] = useDeleteMaterialMutation();

	useEffect(() => {
		if (data?.data) {
			setMaterials(
				data.data.map((item) => ({
					...item,
					imageUrl: item.imageUrl || 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg',
				}))
			);
		}
	}, [data]);

	const handleMaterialDeleted = (deletedId: number) => {
		setMaterials((prev) => prev.filter((material) => material.material_id !== deletedId));
	};

	const handleDeleteRequest = (materialId: number) => {
		setSelectedMaterialId(materialId);
		setIsModalOpen(true); // Открываем модальное окно
	};

	const handleDeleteConfirm = async () => {
		if (selectedMaterialId !== null) {
			try {
				await deleteMaterial(selectedMaterialId).unwrap();
				handleMaterialDeleted(selectedMaterialId); // Удаляем материал
				toast.success('Материал успешно удалён!');
			} catch (error) {
				console.error('Ошибка при удалении:', error);
				toast.error('Ошибка при удалении материала');
			} finally {
				setIsModalOpen(false); // Закрываем модальное окно
			}
		}
	};

	const handleModalClose = () => {
		setIsModalOpen(false); // Закрываем модальное окно
	};

	const filteredMaterials = materials.filter((material) =>
		material.title.toLowerCase().includes(searchQuery.toLowerCase())
	);

	if (isLoading) {
		return <div>Загрузка...</div>;
	}

	if (error) {
		return <div>Ошибка при загрузке материалов</div>;
	}

	return (
		<div className={css.wrapper}>
			<div className={css.list}>
				{filteredMaterials.length > 0 ? (
					filteredMaterials.map((material) => (
						<MaterialListItem
							key={material.material_id}
							materialId={material.material_id}
							title={material.title}
							competencies={material.competencies}
							imageUrl={material.imageUrl}
							onMaterialDeleted={handleMaterialDeleted}
							onDeleteRequest={handleDeleteRequest} // Передаем функцию для запроса на удаление
						/>
					))
				) : (
					<div className={css.noMaterials}>
						<div className={css.emoji}>😞</div>
						Материалы отсутствуют
					</div>
				)}
			</div>

			{isModalOpen && (
				<div className={css.modal} onClick={handleModalClose}>
					<div className={css.modalContent}>
						<p>Вы точно хотите удалить материал?</p>
						<div className={css.modalActions}>
							<button onClick={handleDeleteConfirm} disabled={isDeleting}>
								{isDeleting ? 'Удаление...' : 'Да'}
							</button>
							<button onClick={handleModalClose}>Нет</button>
						</div>
					</div>
				</div>
			)}

			<ToastContainer />
		</div>
	);
};