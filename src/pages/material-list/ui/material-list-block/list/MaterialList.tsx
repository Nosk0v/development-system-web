import { useState, useEffect } from 'react';
import { useFetchMaterialsQuery } from '../../../../../api/materialApi.ts';
import { MaterialListItem } from './item';
import { toast, ToastContainer } from 'react-toastify';
import { useDeleteMaterialMutation } from '../../../../../api/materialApi.ts';
import 'react-toastify/dist/ReactToastify.css';
import css from './MaterialList.module.scss';

interface Material {
	material_id: number;
	title: string;
	competencies: string[];
}

export const MaterialList = ({ searchQuery }: { searchQuery: string }) => {
	const { data, error, isLoading, refetch } = useFetchMaterialsQuery(); // Добавляем refetch
	const [materials, setMaterials] = useState<Material[]>([]);
	const [selectedMaterialId, setSelectedMaterialId] = useState<number | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [deleteMaterial, { isLoading: isDeleting }] = useDeleteMaterialMutation();

	useEffect(() => {
		if (data?.data) {
			setMaterials(
				data.data.map((item) => ({
					...item
				}))
			);
		}
	}, [data]);

	// Отключение прокрутки при открытии модального окна
	useEffect(() => {
		if (isModalOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}

		return () => {
			document.body.style.overflow = '';
		};
	}, [isModalOpen]);

	const handleMaterialDeleted = (deletedId: number) => {
		setMaterials((prev) => prev.filter((material) => material.material_id !== deletedId));
	};

	const handleDeleteRequest = (materialId: number) => {
		setSelectedMaterialId(materialId);
		setIsModalOpen(true);
	};

	const handleDeleteConfirm = async () => {
		if (selectedMaterialId !== null) {
			try {
				await deleteMaterial(selectedMaterialId).unwrap();
				handleMaterialDeleted(selectedMaterialId);

				// Запрос на обновление данных после удаления
				refetch();
				toast.success('Материал успешно удалён!');
			} catch (error) {
				console.error('Ошибка при удалении:', error);
				toast.error('Ошибка при удалении материала');
			} finally {
				setIsModalOpen(false);
			}
		}
	};

	const handleModalClose = () => {
		setIsModalOpen(false);
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
							onMaterialDeleted={handleMaterialDeleted}
							onDeleteRequest={handleDeleteRequest}
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
					<div className={css.modalContent} onClick={(e) => e.stopPropagation()}>
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