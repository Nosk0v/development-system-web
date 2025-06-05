import { useState } from 'react';
import css from './MaterialListControl.module.scss';

interface CompetencyDropdownProps {
    competencies: string[];
    selected: string[];
    onChange: (updated: string[]) => void;
}

export const CompetencyDropdown: React.FC<CompetencyDropdownProps> = ({
                                                                          competencies,
                                                                          selected,
                                                                          onChange,
                                                                      }) => {
    const [open, setOpen] = useState(false);

    const handleToggle = () => setOpen((prev) => !prev);

    const handleSelect = (name: string) => {
        if (selected.includes(name)) {
            onChange(selected.filter((item) => item !== name));
        } else {
            onChange([...selected, name]);
        }
    };

    return (
        <div className={css.dropdownWrapper}>
            <button className={css.dropdownToggle} onClick={handleToggle}>
                Компетенции {selected.length > 0 ? `(${selected.length})` : ''}
            </button>

            {open && (
                <div className={css.dropdownMenu}>
                    <div className={css.checkboxList}>
                        {competencies.map((comp) => (
                            <div
                                key={comp}
                                className={`${css.checkboxItem} ${selected.includes(comp) ? css.selected : ''}`}
                                onClick={() => handleSelect(comp)}
                            >
                                {comp}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};