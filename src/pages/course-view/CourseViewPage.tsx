import css from './CourseViewPage.module.scss';
import { CourseViewBlock } from "./course-view-block";
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { SecondaryButton } from "../../widgets/cancel-button/secondary-button.tsx";
import { MainButton } from "../../widgets/button/button.tsx";
import { getUserClaimsFromAccessToken } from "../../api/jwt.ts";

export const CourseViewPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams<{ id: string }>();
    const claims = getUserClaimsFromAccessToken();
    const isAdmin = claims?.role === 0 || claims?.role === 2;

    const from = location.state?.from;

    const handleBack = () => {
        if (from === 'modal') {
            // Возвращаем на главную и можно также передать флаг, чтобы открыть модалку
            navigate('/courses', { state: { openCompletedCoursesModal: true } });
        } else {
            navigate('/courses');
        }
    };

    const handleEdit = () => {
        navigate(`/update-course/${id}`);
    };

    return (
        <div className={css.wrapper}>
            <div className={css.topBar}>
                <SecondaryButton text="Назад" onClick={handleBack}/>
                {isAdmin && (
                    <MainButton text="Редактировать курс" onClick={handleEdit}/>
                )}
            </div>
            <div className={css.inner}>
                <CourseViewBlock />
            </div>
        </div>
    );
};