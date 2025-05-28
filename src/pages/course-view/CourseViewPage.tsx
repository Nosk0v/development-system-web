import css from './CourseViewPage.module.scss';
import { CourseViewBlock } from "./course-view-block";
import { useNavigate, useParams } from 'react-router-dom';
import { SecondaryButton } from "../../widgets/cancel-button/secondary-button.tsx";
import { MainButton } from "../../widgets/button/button.tsx";
import { getUserClaimsFromAccessToken } from "../../api/jwt.ts";

export const CourseViewPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const claims = getUserClaimsFromAccessToken();
  const isAdmin = claims?.role === 0 || claims?.role === 2;

  const handleBack = () => {
    navigate('/courses');
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
          <CourseViewBlock/>
        </div>
      </div>
  );
};
