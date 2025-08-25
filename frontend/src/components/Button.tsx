import React from 'react';
import type { ButtonProps } from '../types/ButtonProps';

const Button: React.FC<ButtonProps> = ({ onClick, className, children }) => {
    return (
        <button
            onClick={onClick}
            className={className}
        >
            {children}
        </button>
    );
};

export default Button;