import css from './CourseViewPage.module.scss';
import { CourseViewBlock } from "./course-view-block";
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { SecondaryButton } from "../../widgets/cancel-button/secondary-button.tsx";
import { getUserClaimsFromAccessToken } from "../../api/jwt.ts";
import {
    useFetchCourseByIdQuery,
    useIsCourseCompletedQuery
} from "../../api/materialApi.ts";
import { useEffect } from "react";

export const CourseViewPage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const courseId = Number(id);

    const claims = getUserClaimsFromAccessToken();
    const isAdmin = claims?.role === 0 || claims?.role === 2;
    const userEmail = claims?.email ?? '';

    const { refetch: refetchCourse } = useFetchCourseByIdQuery(courseId);
    const { refetch: refetchCompletion } = useIsCourseCompletedQuery(courseId, {
        skip: !userEmail,
    });

    useEffect(() => {
        if (location.state?.forceRefetch) {
            refetchCourse();
            if (userEmail) refetchCompletion();
        }
    }, [location.state, refetchCourse, refetchCompletion, userEmail]);

    const from = location.state?.from;

    const handleBack = () => {
        if (from === 'modal') {
            navigate('/courses', { state: { openCompletedCoursesModal: true } });
        } else {
            navigate('/courses');
        }
    };

    const handleEdit = () => {
        navigate(`/update-course/${courseId}`);
    };

    return (
        <div className={css.wrapper}>
            <div className={css.topBar}>
                <SecondaryButton text="Закрыть" onClick={handleBack} />
                {isAdmin && (
                    <button className={css.editButton} onClick={handleEdit}>
                        Редактировать
                    </button>
                )}
            </div>
            <div className={css.inner}>
                <CourseViewBlock forceRefetch={location.state?.forceRefetch} />
            </div>
        </div>
    );
};