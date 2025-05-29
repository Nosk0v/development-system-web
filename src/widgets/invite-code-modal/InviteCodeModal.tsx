import { useEffect, useState } from 'react';
import { getUserClaimsFromAccessToken } from '../../api/jwt';
import styles from './InviteCodeModal.module.scss';
import { useFetchOrganizationsQuery, useCreateRegistrationCodeMutation } from '../../api/materialApi';
import { toast } from 'react-toastify';

interface InviteCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const InviteCodeModal = ({ isOpen, onClose }: InviteCodeModalProps) => {
    const { data, isLoading, isError } = useFetchOrganizationsQuery();
    const [createCode] = useCreateRegistrationCodeMutation();

    const [selectedOrg, setSelectedOrg] = useState<number | null>(null);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [generatedCode, setGeneratedCode] = useState<string | null>(null);
    useEffect(() => {
        const claims = getUserClaimsFromAccessToken();
        const role = claims?.role;
        const orgId = claims?.organization_id;

        if (role === 2) {
            setIsSuperAdmin(true);
        } else if (orgId) {
            setSelectedOrg(orgId);
        }
    }, []);


    const handleCopy = () => {
        if (!generatedCode) return;
        navigator.clipboard.writeText(generatedCode);
        toast.success('Код скопирован!');
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);


    const handleGenerateCode = () => {
        if (!selectedOrg) {
            toast.error('Выберите организацию');
            return;
        }

        createCode({ organization_id: selectedOrg, is_admin: isAdmin })
            .unwrap()
            .then((res) => {
                toast.success('Код успешно создан');
                setGeneratedCode(res.code);
            })
            .catch(() => {
                toast.error('Ошибка при создании кода');
            });
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modal}>
            <div className={styles.overlay} onClick={onClose} />
            <div className={styles.content}>
                <h2>Создание кода приглашения</h2>

                {isLoading && <p>Загрузка организаций...</p>}
                {isError && <p>Ошибка загрузки организаций</p>}

                {isSuperAdmin ? (
                    <div className={styles.fieldGroup}>
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
                ) : (
                    <div className={styles.fieldGroupOrg}>
                        <h3 className={styles.subheading}>Код будет создан для вашей организации</h3>
                    </div>
                )}

                <div className={styles.checkboxGroup}>
                    <label className={styles.switch}>
                        <input
                            type="checkbox"
                            checked={isAdmin}
                            onChange={(e) => setIsAdmin(e.target.checked)}
                        />
                        <span className={styles.slider}></span>
                    </label>
                    <span className={styles.checkboxLabel}>Сделать для администратора</span>
                </div>

                {generatedCode && (
                    <>
                        <div onClick={handleCopy} className={styles.codeBlock}>
                            <span>{generatedCode}</span>
                        </div>
                    </>
                )}

                <div className={styles.actions}>
                    <button onClick={onClose}>Закрыть</button>
                    <button onClick={handleGenerateCode}>Создать</button>
                </div>
            </div>
        </div>
    );
};