import { useEffect, useMemo } from 'react';
import styles from './OrganizationCourseProgressModal.module.scss';
import { useFetchOrganizationCourseProgressQuery } from '../../api/materialApi';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface UserCourseProgress {
    user_email: string;
    user_name: string;
    course_id: number;
    course_title: string;
    is_completed: boolean | null;
    completed_at: string | null;
    total_materials: number;
    viewed_materials: number;
    last_viewed_at: string | null;
}

interface UserWithCourses {
    user_email: string;
    user_name: string;
    courses: UserCourseProgress[];
}

export const OrganizationCourseProgressModal = ({ isOpen, onClose }: ModalProps) => {
    const { data, isLoading, isError, refetch } = useFetchOrganizationCourseProgressQuery();

    const grouped = useMemo(() => {
        if (!data?.data) return [];

        const map = new Map<string, UserWithCourses>();

        data.data.forEach((entry: UserCourseProgress) => {
            if (!map.has(entry.user_email)) {
                map.set(entry.user_email, {
                    user_email: entry.user_email,
                    user_name: entry.user_name,
                    courses: []
                });
            }
            map.get(entry.user_email)!.courses.push(entry);
        });

        return Array.from(map.values());
    }, [data]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            refetch();
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen, refetch]);

    return (
        <div className={styles.modal} style={{ display: isOpen ? 'flex' : 'none' }}>
            <div className={styles.overlay} onClick={onClose} />
            <div className={styles.content}>
                <h2>Прогресс сотрудников по курсам</h2>

                {isError && <p className={styles.emptyState}>Ошибка загрузки данных</p>}
                {isLoading ? (
                    <p className={styles.emptyState}>Загрузка...</p>
                ) : grouped.length === 0 ? (
                    <p className={styles.emptyState}>Нет данных</p>
                ) : (
                    <div className={styles.usersList}>
                        {grouped.map(user => (
                            <div key={user.user_email} className={styles.userBlock}>
                                <h3>{user.user_name ?? user.user_email}</h3>
                                <p className={styles.email}>{user.user_email}</p>
                                <ul className={styles.courseList}>
                                    {user.courses.map(course => {


                                        return (
                                            <li key={course.course_id} className={styles.courseItem}>
                                                <div className={styles.courseInfo}>
                                                    <span className={styles.courseTitle}>{course.course_title}</span>
                                                </div>
                                                <div className={styles.courseStatus}>
                                                    {course.completed_at && (
                                                        <span className={styles.date}>
                                                            Завершён: {new Date(course.completed_at).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                    <span className={styles.materialProgress}>
                                                        Материалы: {course.viewed_materials}/{course.total_materials}
                                                    </span>
                                                    {course.last_viewed_at && (
                                                        <span className={styles.lastViewed}>
                                                            Последний просмотр: {new Date(course.last_viewed_at).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                    <span
                                                        className={course.completed_at ? styles.iconCompleted : styles.iconPending}
                                                    >
    {course.completed_at ? '✔ Пройден' : '⏳ Не пройден'}
</span>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}

                <div className={styles.actions}>
                    <button onClick={onClose}>Закрыть</button>
                </div>
            </div>
        </div>
    );
};