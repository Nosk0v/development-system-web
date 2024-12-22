import css from './MaterialCreatePage.module.scss';
import { MaterialCreateBlock } from './material-create-block';

export const MaterialCreatePage = () => (
	<div className={css.wrapper}>
		<MaterialCreateBlock />
	</div>
);
