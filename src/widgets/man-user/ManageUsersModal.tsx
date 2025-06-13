import {
    useFetchOrganizationsQuery,
    useFetchOrganizationUsersQuery,
    useDeleteUserMutation,
    useFetchDepartmentsQuery
} from '../../api/materialApi';
import { getUserClaimsFromAccessToken } from '../../api/jwt';
import { toast } from 'react-toastify';
import styles from './ManageUsersModal.module.scss';
import { useEffect, useState } from "react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const ManageUsersModal = ({ isOpen, onClose }: Props) => {
    const [selectedOrgId, setSelectedOrgId] = useState<number | undefined>();
    const claims = getUserClaimsFromAccessToken();

    const isSuper = claims?.role === 2;
    const orgId = isSuper ? selectedOrgId : claims?.organization_id;

    const { data: orgsData } = useFetchOrganizationsQuery();
    const { data: usersData, refetch } = useFetchOrganizationUsersQuery(
        orgId !== undefined ? { organization_id: orgId } : {}
    );
    const { data: departmentsData } = useFetchDepartmentsQuery();

    const getDeptName = (id?: number | null) => {
        if (!id) return '—';
        const dept = departmentsData?.data.find(d => d.department_id === id);
        return dept ? dept.name : '—';
    };

    const [deleteUser] = useDeleteUserMutation();

    // Управление подтверждением удаления
    const [confirmDeleteEmail, setConfirmDeleteEmail] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            if (orgId) refetch();
        } else {
            document.body.style.overflow = '';
            setSelectedOrgId(undefined);
            setConfirmDeleteEmail(null);
            setIsDeleting(false);
        }
    }, [isOpen, orgId, refetch]);

    const canDelete = (currentRole: number | undefined, targetRole: number | undefined, targetEmail: string) => {
        if (!claims?.email) {
            toast.error('Ошибка: текущий пользователь не определён');
            return false;
        }
        if (!targetEmail) {
            toast.error('Ошибка: Email пользователя для удаления не указан');
            return false;
        }
        if (claims.email === targetEmail) {
            toast.error('Нельзя удалить самого себя');
            return false;
        }
        if (currentRole === 2) {
            // Супер-админ может удалить всех
            return true;
        }
        if (currentRole === 0) {
            // Админ (0) не может удалить супера (2) и админа (0), но может удалить user (1)
            if (targetRole === 1) return true;
            toast.error('Админ может удалять только пользователей с ролью Пользователь');
            return false;
        }
        // Пользователи (1) не могут удалять никого
        toast.error('У вас нет прав на удаление пользователей');
        return false;
    };

    // Открытие модалки подтверждения
    const openDeleteConfirm = (email: string, role: number | undefined) => {
        if (!canDelete(claims?.role, role, email)) return;
        setConfirmDeleteEmail(email);
    };

    // Подтверждение удаления
    const handleDeleteConfirm = () => {
        if (!confirmDeleteEmail) return;
        setIsDeleting(true);
        deleteUser(confirmDeleteEmail)
            .unwrap()
            .then(() => {
                toast.success('Пользователь удалён');
                refetch();
                setConfirmDeleteEmail(null);
            })
            .catch(() => toast.error('Ошибка удаления'))
            .finally(() => setIsDeleting(false));
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modal}>
            <div className={styles.overlay} onClick={onClose} />
            <div className={styles.content}>
                <h2>Управление пользователями</h2>

                {isSuper && (
                    <div className={styles.selectGroup}>
                        <label>Организация:</label>
                        <select
                            value={selectedOrgId ?? ''}
                            onChange={e => setSelectedOrgId(+e.target.value || undefined)}
                        >
                            <option value="" disabled>Выберите организацию</option>
                            {orgsData?.data.map(org => (
                                <option key={org.organization_id} value={org.organization_id}>
                                    {org.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div className={styles.listContainer}>
                    {usersData?.data && usersData.data.length > 0 ? (
                        <ul className={styles.userList}>
                            {usersData.data.map((u, idx) => {
                                const roleText = u.role === 2 ? 'Супер-админ' : u.role === 0 ? 'Админ' : 'Пользователь';
                                const deptName = getDeptName(u.department_id);

                                return (
                                    <li key={u.email || `user-${idx}`} className={styles.userItem}>
                                        <div>
                                            <strong>{u.name || u.email}</strong>
                                            <span className={styles.sub}>{u.email}</span>
                                            <span className={styles.sub}>Отделение: {deptName}</span>
                                            <span className={styles.sub}>Роль: {roleText}</span>
                                        </div>
                                        <button
                                            disabled={isDeleting && confirmDeleteEmail === u.email}
                                            className={styles.deleteBtn}
                                            onClick={() => openDeleteConfirm(u.email, u.role)}
                                        >
                                            Удалить
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p className={styles.emptyState}>
                            {orgId ? 'Пользователи не найдены' : 'Выберите организацию'}
                        </p>
                    )}
                </div>

                <div className={styles.actions}>
                    <button className={styles.btn} onClick={onClose}>Закрыть</button>
                </div>
            </div>

            {confirmDeleteEmail && (
                <div className={styles.confirmModal} onClick={() => setConfirmDeleteEmail(null)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <p>Вы уверены, что хотите удалить пользователя <strong>{confirmDeleteEmail}</strong>?</p>
                        <div className={styles.modalActions}>
                            <button onClick={handleDeleteConfirm} disabled={isDeleting}>
                                {isDeleting ? 'Удаление...' : 'Да'}
                            </button>
                            <button onClick={() => setConfirmDeleteEmail(null)} disabled={isDeleting}>
                                Нет
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};