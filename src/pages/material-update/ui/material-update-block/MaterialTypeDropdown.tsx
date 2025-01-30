import { useFetchMaterialsQuery } from '../../../../api/materialApi.ts';
import { useState, useEffect } from 'react';
import classNames from 'classnames';
import css from './DropdownMenu.module.scss';

interface DropdownMenuProps {
    value: string; // Текущее выбранное значение
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; // Обработчик изменений
}

export const MaterialTypeDropdown = ({ value, onChange }: DropdownMenuProps) => {
    const { data, isLoading, error } = useFetchMaterialsQuery(); // Запрашиваем все материалы

    const [types, setTypes] = useState<string[]>([]); // Состояние для хранения уникальных типов

    useEffect(() => {
        if (data) {
            // Извлекаем уникальные типы материалов из данных
            const uniqueTypes = Array.from(new Set(data.data.map(item => item.type_name)));
            setTypes(uniqueTypes);
        }
    }, [data]);

    if (isLoading) {
        return <div className={css.loading}>Загрузка типов...</div>;
    }

    if (error) {
        return <div className={css.error}>Ошибка загрузки типов материалов</div>;
    }

    if (!data) {
        return <div className={css.notFound}>Типы материалов не найдены</div>;
    }

    return (
        <div className={css.wrapper}>
            <select
                className={classNames(css.select, { [css.placeholder]: !value })}
                value={value}
                onChange={onChange}
            >
                <option value="" disabled>
                    Выберите тип
                </option>
                {types.map((type) => (
                    <option key={type} value={type}>
                        {type}
                    </option>
                ))}
            </select>
        </div>
    );
};