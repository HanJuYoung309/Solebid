import BackPress from "../../../components/BackPress";
import type { CartHeaderProps } from "../types/CartHeaderProps";

const CartHeader: React.FC<CartHeaderProps> = ({ isEditing, onToggleEdit }) => {
    return (
        <div className="flex items-center justify-between px-4 py-4">
            <BackPress className="cursor-pointer">
                <i className="fas fa-arrow-left text-xl text-gray-700" />
            </BackPress>
            <h1 className="text-lg font-semibold text-gray-900">장바구니</h1>
            <button
                className="text-blue-600 font-medium cursor-pointer whitespace-nowrap"
                onClick={onToggleEdit}
            >
                {isEditing ? "완료" : "편집"}
            </button>
        </div>
    );
};

export default CartHeader;