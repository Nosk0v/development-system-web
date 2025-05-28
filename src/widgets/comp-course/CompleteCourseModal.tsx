import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CompletedCoursesModal.module.scss';
import { useFetchCompletedCoursesQuery } from '../../api/materialApi.ts';

interface CompletedCoursesModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CompletedCoursesModal = ({ isOpen, onClose }: CompletedCoursesModalProps) => {
    const navigate = useNavigate();

    const {
        data,
        isLoading,
        isError,
        refetch
    } = useFetchCompletedCoursesQuery();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            refetch();

            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                    onClose();
                }
            };

            window.addEventListener('keydown', handleKeyDown);
            return () => {
                window.removeEventListener('keydown', handleKeyDown);
                document.body.style.overflow = '';
            };
        }
    }, [isOpen, refetch, onClose]);

    const handleCourseClick = (courseId: number) => {
        onClose();
        navigate(`/view-course/${courseId}`, {
            state: {
                from: 'modal'
            }
        });
    };

    return (
        <div className={styles.modal} style={{ display: isOpen ? 'flex' : 'none' }}>
            <div className={styles.overlay} onClick={onClose}></div>
            <div className={styles.content}>
                <h2>Пройденные курсы</h2>

                {isError && <p className={styles.emptyState}>Ошибка загрузки курсов.</p>}

                {!isError && (
                    isLoading ? (
                        <p className={styles.emptyState}>Загрузка...</p>
                    ) : (
                        data?.data?.length ? (
                            <ul className={styles.list}>
                                {data.data.map((course) => (
                                    <li
                                        key={course.course_id}
                                        onClick={() => handleCourseClick(course.course_id)}
                                        className={styles.listItem}
                                    >
                                        <span className={styles.courseTitle}>{course.title}</span>
                                        <p className={styles.courseDescription}>{course.description}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className={styles.emptyState}>
                                <p>Вы ещё не завершили ни один курс. Пройдите материалы — и они появятся здесь ✨</p>
                            </div>
                        )
                    )
                )}

                <div className={styles.actions}>
                    <button onClick={onClose}>Закрыть</button>
                </div>
            </div>
        </div>
    );
};