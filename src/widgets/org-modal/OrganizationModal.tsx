import { useEffect, useState } from 'react';
import { useCreateOrganizationMutation, useDeleteOrganizationMutation, useFetchOrganizationsQuery } from '../../api/materialApi.ts';
import { toast } from 'react-toastify';
import styles from './OrganizationModal.module.scss';

interface OrganizationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const OrganizationModal = ({ isOpen, onClose }: OrganizationModalProps) => {
    const [createOrganization] = useCreateOrganizationMutation();
    const [deleteOrganization] = useDeleteOrganizationMutation();
    const { data, refetch } = useFetchOrganizationsQuery();

    const [orgName, setOrgName] = useState('');
    const [prefix, setPrefix] = useState('');
    const [selectedOrg, setSelectedOrg] = useState<number | null>(null);
    const [orgIdToDelete, setOrgIdToDelete] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleCreate = () => {
        if (!orgName || !prefix) {
            toast.error("Введите название организации и префикс");
            return;
        }

        const prefixRegex = /^[a-zA-Z]{1,10}$/;
        if (!prefixRegex.test(prefix)) {
            toast.error("Префикс должен содержать только латинские буквы и быть не длиннее 10 символов");
            return;
        }

        createOrganization({ name: orgName, prefix })
            .unwrap()
            .then(() => {
                toast.success("Организация создана");
                setOrgName('');
                setPrefix('');
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
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="Префикс (например MTI)"
                        value={prefix}
                        onChange={(e) => {
                            const raw = e.target.value;
                            const filtered = raw.replace(/[^a-zA-Z]/g, '').slice(0, 10);
                            setPrefix(filtered);
                        }}
                    />
                </div>

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