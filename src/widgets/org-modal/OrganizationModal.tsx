import { useEffect, useState } from 'react';
import { useCreateOrganizationMutation, useDeleteOrganizationMutation, useFetchOrganizationsQuery } from '../../api/materialApi.ts';
import { toast } from 'react-toastify';
import styles from './OrganizationModal.module.scss';

const cyrillicToLatinMap: Record<string, string> = {
    а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh',
    з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o',
    п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts',
    ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
};

const transliterate = (text: string): string => {
    return text.split('').map(char => {
        const lower = char.toLowerCase();
        return cyrillicToLatinMap[lower] ?? char;
    }).join('');
};

interface OrganizationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const OrganizationModal = ({ isOpen, onClose }: OrganizationModalProps) => {
    const [createOrganization] = useCreateOrganizationMutation();
    const [deleteOrganization] = useDeleteOrganizationMutation();
    const { data, refetch } = useFetchOrganizationsQuery();

    const [orgName, setOrgName] = useState('');
    const [selectedOrg, setSelectedOrg] = useState<number | null>(null);
    const [orgIdToDelete, setOrgIdToDelete] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const generatedPrefix = transliterate(orgName).replace(/[^a-zA-Z]/g, '').toLowerCase().slice(0, 40);

    const handleCreate = () => {
        if (!orgName || !generatedPrefix) {
            toast.error("Введите название организации и префикс");
            return;
        }

        const prefixRegex = /^[a-zA-Z]{1,40}$/;
        if (!prefixRegex.test(generatedPrefix)) {
            toast.error("Префикс должен содержать только латинские буквы и быть не длиннее 40 символов");
            return;
        }

        const duplicate = data?.data.some(
            (org) => org.name.trim().toLowerCase() === orgName.trim().toLowerCase()
        );
        if (duplicate) {
            toast.error("Организация с таким названием уже существует");
            return;
        }


        createOrganization({ name: orgName, prefix: generatedPrefix })
            .unwrap()
            .then(() => {
                toast.success("Организация создана");
                setOrgName('');
                refetch();
            })
            .catch(() => toast.error("Ошибка при создании организации"));
    };

    const openDeleteConfirm = (id: number) => {
        setOrgIdToDelete(id);
        setIsModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (!orgIdToDelete) return;

        setIsDeleting(true);
        deleteOrganization(orgIdToDelete)
            .unwrap()
            .then(() => {
                toast.success("Организация удалена");
                setOrgIdToDelete(null);
                setSelectedOrg(null);
                setIsModalOpen(false);
                refetch();
            })
            .catch(() => toast.error("Ошибка при удалении организации"))
            .finally(() => setIsDeleting(false));
    };

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className={styles.modal}>
            <div className={styles.overlay} onClick={onClose}></div>
            <div className={styles.content}>
                <h2>Управление организациями</h2>
                <p className={styles.deleteLabel}>Создать организацию</p>
                <div className={styles.inputGroup}>
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="Название организации"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                    />
                </div>
                <p className={styles.prefixPreview}>Ваш префикс: <strong>{generatedPrefix}</strong></p>

                <p className={styles.deleteLabel}>Удалить организацию</p>

                <div className={styles.selectGroup}>
                    <select
                        className={styles.select}
                        value={selectedOrg ?? ''}
                        onChange={(e) => setSelectedOrg(Number(e.target.value))}
                    >
                        <option value="" disabled>Выберите организацию</option>
                        {data?.data.map((org) => (
                            <option key={org.organization_id} value={org.organization_id}>
                                {org.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.buttonGroup}>
                    <button className={styles.button} onClick={handleCreate}>Создать</button>
                    <button
                        className={styles.button}
                        onClick={() => {
                            if (selectedOrg !== null) {
                                openDeleteConfirm(selectedOrg);
                            } else {
                                toast.error("Выберите организацию для удаления");
                            }
                        }}
                    >
                        Удалить
                    </button>
                    <button className={styles.button} onClick={onClose}>Закрыть</button>
                </div>

                {isModalOpen && (
                    <div className={styles.confirmModal} onClick={() => setIsModalOpen(false)}>
                        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                            <p>Вы точно хотите удалить организацию? Это удалит также всех пользователей и коды
                                приглашений.</p>
                            <div className={styles.modalActions}>
                                <button onClick={handleDeleteConfirm} disabled={isDeleting}>
                                    {isDeleting ? 'Удаление...' : 'Да'}
                                </button>
                                <button onClick={() => setIsModalOpen(false)}>Нет</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};