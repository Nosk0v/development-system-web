import React from 'react';
import css from './button.module.scss';

interface MainButtonProps {
    text: string;
    width?: number;
    height?: number;
    disabled?: boolean;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    className?: string;  // Добавляем className
}

export const MainButton = (props: MainButtonProps) => {
    const {
        text, width, height, onClick, disabled, className,
    } = props;
    return (
        <button
            className={`${css.main_button} ${className} ${disabled ? css.disabled : ''}`} // Добавляем className
            type="button"
            onClick={onClick}
            style={{
                width, height,
            }}
        >
            {text}
        </button>
    );
};