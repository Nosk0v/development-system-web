import { Route, Routes } from 'react-router-dom';
import css from './Router.module.scss';
import { MaterialListPage } from '../../pages/material-list';
import { MaterialCreatePage } from '../../pages/material-create';
import { MaterialView } from '../../pages/material-view';
import {MaterialUpdatePage} from "../../pages/material-update";
import { SignInPage } from '../../pages/sing-in';

const Router = () => (
	<div className={css.router}>
		<Routes>
			<Route path="/" element={<SignInPage/>} />
			<Route path="/material-list" element={<MaterialListPage />} />
			<Route path="/create-material" element={<MaterialCreatePage />} />
			<Route path="/view-materials/:id" element={<MaterialView />} />
			<Route path="/update-material/:id" element={<MaterialUpdatePage />} />
		</Routes>
	</div>
);
export default Router;
