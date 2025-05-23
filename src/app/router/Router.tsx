import { Route, Routes } from 'react-router-dom';
import css from './Router.module.scss';
import { MaterialListPage } from '../../pages/material-list';
import { MaterialCreatePage } from '../../pages/material-create';
import { MaterialView } from '../../pages/material-view';
import { MaterialUpdatePage } from '../../pages/material-update';
import { SignInPage } from '../../pages/sing-in';
import { PrivateRoute } from './PrivateRoute';

const Router = () => (
	<div className={css.router}>
		<Routes>
			<Route path="/" element={<SignInPage />} />
			<Route path="/material-list" element={
				<PrivateRoute>
					<MaterialListPage />
				</PrivateRoute>
			} />
			<Route path="/create-material" element={
				<PrivateRoute>
					<MaterialCreatePage />
				</PrivateRoute>
			} />
			<Route path="/view-materials/:id" element={
				<PrivateRoute>
					<MaterialView />
				</PrivateRoute>
			} />
			<Route path="/update-material/:id" element={
				<PrivateRoute>
					<MaterialUpdatePage />
				</PrivateRoute>
			} />
		</Routes>
	</div>
);

export default Router;