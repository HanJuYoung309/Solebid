import { useNavigate } from 'react-router-dom';
import type { BackButtonProps } from '../types/BackButtonProps';

const BackButton: React.FC<BackButtonProps> = ({ children, className }) => {
    const navigate = useNavigate();
    const handleBackPressed = () => { navigate(-1); };
    return (
        <button
            onClick={handleBackPressed}
            className={className}
        >
            {children}
        </button>
    );
};

export default BackButton;