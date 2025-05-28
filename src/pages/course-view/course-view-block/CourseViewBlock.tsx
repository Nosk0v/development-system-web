import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import css from './CourseViewBlock.module.scss';
import {
  useFetchCourseByIdQuery,
  useFetchCourseProgressQuery,
  useMarkMaterialAsCompletedMutation,
  useFetchMaterialsQuery,
  useIsCourseCompletedQuery,
  useCompleteCourseMutation
} from '../../../api/materialApi.ts';


export const CourseViewBlock = () => {
  const { id } = useParams<{ id: string }>();
  const courseId = Number(id);

  const [visited, setVisited] = useState<number[]>([]);
  const [markMaterialAsCompleted] = useMarkMaterialAsCompletedMutation();
  const [completeCourse] = useCompleteCourseMutation();

  const { data: course, isLoading: courseLoading } = useFetchCourseByIdQuery(courseId);
  const { data: progress, refetch: refetchProgress } = useFetchCourseProgressQuery(courseId);
  const { data: completedStatus, refetch: refetchCompletedStatus } = useIsCourseCompletedQuery(courseId);
  const { data: allMaterials } = useFetchMaterialsQuery();

  // при обновлении данных — ставим "просмотренные"
  useEffect(() => {
    if (!course || !progress) return;
    setVisited(progress.completed_materials || []);
  }, [course, progress]);
  const navigate = useNavigate();
  const isCourseAlreadyCompleted = useMemo(() => {
    return !!completedStatus?.completed;
  }, [completedStatus]);

  const materialsInCourse = useMemo(() => {
    return allMaterials?.data?.filter(m => course?.materials?.includes(m.title)) || [];
  }, [allMaterials, course]);

  const isCourseReadyForCompletion = useMemo(() => {
    if (!materialsInCourse.length) return false;
    return materialsInCourse.every(m => visited.includes(m.material_id));
  }, [materialsInCourse, visited]);

  const handleMaterialClick = async (materialId: number) => {
    if (!visited.includes(materialId)) {
      try {
        await markMaterialAsCompleted({ courseId, materialId });
        setVisited(prev => [...prev, materialId]);
        await refetchProgress();
      } catch (e) {
        console.error('Ошибка при отметке материала как просмотренного:', e);
      }
    }
    navigate(`/view-materials/${materialId}`, { state: { from: 'course', courseId } });
  };

  const handleCompleteCourse = async () => {
    try {
      await completeCourse(courseId);
      await refetchProgress();
      await refetchCompletedStatus();
    } catch (e) {
      console.error('Ошибка при завершении курса:', e);
    }
  };

  if (courseLoading) return <div>Загрузка...</div>;
  if (!course) return <div>Курс не найден</div>;

  return (
      <div className={css.wrapper}>
        <div className={css.courseInfo}>
          <h1 className={css.title}>{course.title}</h1>
          <p className={css.description}>{course.description}</p>
        </div>

        <div className={css.meta}>
          Создан: {course?.create_date ? new Date(course.create_date).toLocaleDateString() : '—'}
          {isCourseAlreadyCompleted ? (
              <span className={css.completeMark}>✅ Курс пройден</span>
          ) : (
              isCourseReadyForCompletion && (
                  <span className={css.readyMark}>🔸 Курс можно завершить</span>
              )
          )}
        </div>

        <div className={css.competencies}>
          <label>Компетенции:</label>
          <div className={css.competenciesList}>
            {course?.competencies?.map(c => (
                <span key={c} className={css.competency}>{c}</span>
            ))}
          </div>
        </div>

        <div className={css.materials}>
          <h2>Материалы</h2>
          <ul className={css.materialList}>
            {materialsInCourse
                .map(material => {
                  const isViewed = visited.includes(material.material_id);
                  return (
                    <li key={material.material_id} className={css.materialItem}>
                      <div
                        className={css.textBlock}
                        onClick={() => handleMaterialClick(material.material_id)}
                        title={`Открыть "${material.title}"`}
                      >
                        <div className={css.title}>
                          {material.title} {isViewed && <span className={css.check}>✓</span>}
                        </div>
                        <div className={css.description}>{material.description}</div>
                      </div>
                    </li>
                  );
                })}
          </ul>

          {!isCourseAlreadyCompleted && (
            <div>
              {isCourseReadyForCompletion ? (
                <button className={css.completeButton} onClick={handleCompleteCourse}>
                  Завершить курс
                </button>
              ) : (
                <p style={{ color: '#888', fontSize: '14px', marginTop: '12px', textAlign: 'center' }}>
                  Чтобы завершить курс, изучите все материалы.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
  );
};