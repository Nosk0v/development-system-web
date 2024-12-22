import css from './MaterialListPage.module.scss';
import { MaterialListBlock } from './material-list-block';

export const MaterialListPage = () => (
	<div className={css.wrapper}>
		<MaterialListBlock />
	</div>
);
