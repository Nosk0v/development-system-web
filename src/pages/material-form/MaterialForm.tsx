import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFetchMaterialsQuery, useCreateMaterialMutation, useUpdateMaterialMutation } from '../../../api/materialApi.ts';
import { MaterialCreateControl } from './material-create-control';
import { Label } from '../../../../widgets/input-label/label';
import { Input } from '../../../../widgets/input/input';
import { DropdownMenu } from '../../../../widgets/dropdown-menu/dropdown-menu';
import { TextArea } from '../../../../widgets/textarea/textarea';
import { Competencies } from '../../../../widgets/competencies/competencies';
import { ToastContainer, toast } from 'react-toastify';

const MaterialForm = ({ isUpdate }: { isUpdate: boolean }) => {
    const { id } = useParams<{ id: string }>();
    const { data: materialsData, isLoading, error } = useFetchMaterialsQuery();
    const [createMaterial] = useCreateMaterialMutation();
    const [updateMaterial] = useUpdateMaterialMutation();

    const material = isUpdate
        ? materialsData?.data.find((item) => item.material_id === Number(id))
        : null;

    const [title, setTitle] = useState(material?.title || '');
    const [description, setDescription] = useState(material?.description || '');
    const [content, setContent] = useState(material?.content || '');
    const [materialType, setMaterialType] = useState(material?.type_name || '');
    const [competencies, setCompetencies] = useState(material?.competencies || []);

    const navigate = useNavigate();

    useEffect(() => {
        if (isUpdate && material) {
            setTitle(material.title);
            setDescription(material.description);
            setContent(material.content);
            setMaterialType(material.type_name);
            setCompetencies(material.competencies);
        }
    }, [isUpdate, material]);

    const handleSave = async () => {
        const newMaterial = {
            title,
            type_name: materialType,
            description,
            content,
            competencies,
        };

        try {
            if (isUpdate) {
                await updateMaterial({ id: Number(id), ...newMaterial }).unwrap();
                toast.success('Материал обновлен');
            } else {
                await createMaterial(newMaterial).unwrap();
                toast.success('Материал создан');
            }
        } catch (error) {
            toast.error('Ошибка при сохранении материала');
        }
    };

    if (isLoading) return <div>Загрузка...</div>;
    if (error) return <div>Ошибка при загрузке данных</div>;

    return (
        <div>
            <MaterialCreateControl onSave={handleSave} />
    <div>
    <Label label="Название">
    <Input value={title} onChange={(e) => setTitle(e.target.value)} />
    </Label>
    <Label label="Тип материала">
    <DropdownMenu value={materialType} onChange={(e) => setMaterialType(e.target.value)} />
    </Label>
    <Label label="Описание материала">
    <TextArea value={description} onChange={(e) => setDescription(e.target.value)} />
    </Label>
    <Label label="Контент материала">
    <TextArea value={content} onChange={(e) => setContent(e.target.value)} />
    </Label>
    <Label label="Компетенции">
    <Competencies initialCompetencies={competencies} onChange={setCompetencies} />
    </Label>
    </div>
    <ToastContainer />
    </div>
);
};