import css from './MaterialListPage.module.scss';
import { MaterialListBlock } from './material-list-block';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

export const MaterialListPage = () => {
	const location = useLocation();

	useEffect(() => {
		if (location.state?.notification) {
			toast.success(location.state.notification);
		}
	}, [location]);

	return (
		<div className={css.wrapper}>
			<MaterialListBlock />
		</div>
	);
};