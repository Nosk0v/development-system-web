import { useState, ChangeEvent, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import css from './CourseListControl.module.scss';

import { MainButton } from '../../../../../widgets/button/button';
import { Label } from '../../../../../widgets/input-label/label';
import { Input } from '../../../../../widgets/input/input';
import { getUserClaimsFromAccessToken } from '../../../../../api/jwt';
import { CompletedCoursesModal } from '../../../../../widgets/comp-course/CompleteCourseModal.tsx';
import { InviteCodeModal } from '../../../../../widgets/invite-code-modal/InviteCodeModal.tsx';
import { OrganizationModal } from '../../../../../widgets/org-modal/OrganizationModal.tsx';
import { useFetchCompetenciesQuery } from '../../../../../api/materialApi.ts';
import {CompetencyDropdown} from "../../../../material-list/ui/material-list-block/control/CompetencyDropdown.tsx";


interface CourseListControlProps {
	onSearch: (query: string) => void;
	onCompetencyFilterChange: (competencies: string[]) => void;
}

export const CourseListControl = ({ onSearch, onCompetencyFilterChange }: CourseListControlProps) => {
	const navigate = useNavigate();
	const searchId = useId();

	const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false);
	const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
	const [isOrganizationModalOpen, setIsOrganizationModalOpen] = useState(false);
	const [selectedCompetencies, setSelectedCompetencies] = useState<string[]>([]);

	const { data: competenciesData } = useFetchCompetenciesQuery();

	const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
		onSearch(event.target.value);
	};

	const handleCompetencyChange = (updated: string[]) => {
		setSelectedCompetencies(updated);
		onCompetencyFilterChange(updated);
	};

	const onMaterialsClick = () => {
		navigate('/material-list');
	};

	const onCreateCourseClick = () => {
		navigate('/create-course');
	};

	const onLogoutClick = () => {
		localStorage.removeItem('access_token');
		window.location.replace('/');
	};

	const claims = getUserClaimsFromAccessToken();
	const isAdmin = claims?.role === 0 || claims?.role === 2;
	const isSuperAdmin = claims?.role === 2;

	return (
		<div className={css.wrapper}>
			<Label label="Поиск" color="black" id={searchId}>
				<Input className={css.input} id={searchId} onChange={handleSearchChange} />
			</Label>

			{competenciesData?.data && (
				<CompetencyDropdown
					competencies={competenciesData.data.map((c) => c.name)}
					selected={selectedCompetencies}
					onChange={handleCompetencyChange}
				/>
			)}

			{isAdmin && (
				<MainButton text="Создать" className={css.mainButton} onClick={onCreateCourseClick} />
			)}
			<div className={css.bottomButtons}>
				{isAdmin && (
					<>
						{isSuperAdmin && (
							<MainButton
								text="Организации"
								className={css.inviteButton}
								onClick={() => setIsOrganizationModalOpen(true)}
							/>
						)}
						<MainButton text="Материалы" className={css.compButton} onClick={onMaterialsClick} />

						<MainButton
							text="Коды приглашений"
							className={css.inviteButton}
							onClick={() => setIsInviteModalOpen(true)}
						/>
					</>
				)}
				<MainButton
					text="Пройденные курсы"
					className={css.completedButton}
					onClick={() => setIsCompletedModalOpen(true)}
				/>
				<MainButton text="Выйти" className={css.typeButton} onClick={onLogoutClick} />
			</div>

			{isCompletedModalOpen && (
				<CompletedCoursesModal
					isOpen={isCompletedModalOpen}
					onClose={() => setIsCompletedModalOpen(false)}
				/>
			)}

			{isInviteModalOpen && (
				<InviteCodeModal
					isOpen={isInviteModalOpen}
					onClose={() => setIsInviteModalOpen(false)}
				/>
			)}
			{isOrganizationModalOpen && (
				<OrganizationModal
					isOpen={isOrganizationModalOpen}
					onClose={() => setIsOrganizationModalOpen(false)}
				/>
			)}
		</div>
	);
};