import { Route, Routes } from 'react-router-dom';
import css from './Router.module.scss';
import { MaterialListPage } from '../../pages/material-list';
import { MaterialCreatePage } from '../../pages/material-create';
import { MaterialView } from '../../pages/material-view';

const Router = () => (
	<div className={css.router}>
		<Routes>
			<Route path="/" element={<MaterialListPage />} />
			<Route path="/create-material" element={<MaterialCreatePage />} />
			<Route path="/materials/:id" element={<MaterialView />} />
		</Routes>
	</div>
);
export default Router;
