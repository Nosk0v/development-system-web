import { useEffect, useMemo, useState } from 'react';
import css from './MaterialsModal.module.scss';
import { useFetchMaterialsQuery } from '../../api/materialApi';

interface MaterialsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (materialIds: number[]) => void;
    selectedMaterials: number[];
    materialNames?: Map<number, string>;
}

export const MaterialsModal = ({
                                   isOpen,
                                   onClose,
                                   onSelect,
                                   selectedMaterials,
                                   materialNames = new Map(),
                               }: MaterialsModalProps) => {
    const { data, isLoading } = useFetchMaterialsQuery();
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<number[]>(selectedMaterials);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'auto';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    const toggleMaterial = (id: number) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((matId) => matId !== id) : [...prev, id]
        );
    };

    useEffect(() => {
        if (isOpen) {
            setSelected(selectedMaterials);
        }
    }, [isOpen, selectedMaterials]);

    const handleSave = () => {
        onSelect(selected);
        onClose();
    };

    const filtered = useMemo(() => {
        return data?.data?.filter((m) =>
            m.title.toLowerCase().includes(search.toLowerCase())
        ) || [];
    }, [data, search]);

    const allSelected = filtered.length > 0 && filtered.every((m) => selected.includes(m.material_id));

    const handleSelectAll = () => {
        const allIds = filtered.map((m) => m.material_id);
        setSelected((prev) =>
            allSelected ? prev.filter((id) => !allIds.includes(id)) : [...new Set([...prev, ...allIds])]
        );
    };

    if (!isOpen) return null;

    return (
        <div className={css.modal} onClick={onClose}>
            <div className={css.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={css.header}>Выберите материалы</div>

                <div className={css.topBar}>
                    <button
                        type="button"
                        onClick={handleSelectAll}
                        className={`${css.toggleAll} ${allSelected ? css.unselect : ''}`}
                    >
                        {allSelected ? 'Убрать все' : 'Выбрать все'}
                    </button>

                    <input
                        className={css.searchInput}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Поиск"
                    />
                </div>

                <div className={css.materialList}>
                    {isLoading ? (
                        <div>Загрузка...</div>
                    ) : (
                        filtered.map((material) => (
                            <div key={material.material_id} className={css.materialItem}>
                                <div className={css.textBlock}>
                                    <div className={css.title}>{materialNames.get(material.material_id) || material.title}</div>
                                    <div className={css.description}>{material.description}</div>
                                </div>
                                <div className={css.checkboxWrapper}>
                                    <input
                                        type="checkbox"
                                        checked={selected.includes(material.material_id)}
                                        onChange={() => toggleMaterial(material.material_id)}
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className={css.actions}>
                    <button className={css.save} onClick={handleSave}>Сохранить</button>
                    <button className={css.cancel} onClick={onClose}>Отмена</button>
                </div>
            </div>
        </div>
    );
};
