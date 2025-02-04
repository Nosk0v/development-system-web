import css from './dropdown-menu.module.scss';
import classNames from 'classnames';
import { useFetchMaterialTypeQuery } from '../../api/materialApi';
import {useEffect} from "react";

interface DropdownUpdateMenuProps {
	width?: number;
	height?: number;
	id?: string;
	value: number | null;
	selectedTypeName: string;
	onChange: (value: number) => void;
}

export const DropdownUpdateMenu = ({ value, selectedTypeName, onChange, width, height, id }: DropdownUpdateMenuProps) => {
	const { data, isLoading, error } = useFetchMaterialTypeQuery();
	useEffect(() => {
		if (data && value === null && selectedTypeName) {
			const selectedType = data?.data.find(
				(option) => option.type === selectedTypeName
			);
			if (selectedType) {
				onChange(selectedType.type_id); // Передаем значение из data в родителя
			}
		}

	}, [data, value, selectedTypeName, onChange]);
	if (isLoading) {
		return (
			<div className={css.wrapper} style={{ width, height }}>
				<select className={css.select} disabled>
					<option>Загрузка типов...</option>
				</select>
			</div>
		);
	}

	if (error) {
		return (
			<div className={css.wrapper} style={{ width, height }}>
				<select className={css.select} disabled>
					<option>Ошибка загрузки</option>
				</select>
			</div>
		);
	}

	const options = data?.data.map((type) => ({
		value: type.type_id,
		label: type.type,
	})) || [];

	const selectedType = options.find(option => option.label === selectedTypeName);
	const dropdownValue = value ?? selectedType?.value ?? '';

	console.log("Итоговый dropdownValue:", dropdownValue);

	return (
		<div className={css.wrapper} style={{ width, height }}>
			<select
				className={classNames(css.select)}
				id={id}
				value={dropdownValue}
				onChange={(e) => onChange(Number(e.target.value))}
			>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		</div>
	);
};