import { useState } from "react";
import Button from "../../../components/Button";
import CartEmptyList from "../components/CartEmptyList";
import CartHeader from "../components/CartHeader";
import CartList from "../components/CartList";
import CartSummary from "../components/CartSummary";
import { cartData } from "../components/mockData";
import type { Cart } from "../types/Cart";

const CartPage = () => {
    const [cartItems, setCartItems] = useState<Cart[]>(cartData);
    const [isEditing, setIsEditing] = useState(false);

    const removeItem = (id: number) => {
        setCartItems((items) => items.filter((item) => item.id !== id));
    };

    const totalAmount = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    );
    const shippingFee = totalAmount >= 50000 ? 0 : 3000;
    const finalAmount = totalAmount + shippingFee;

    const formatPrice = (price: number) => price.toLocaleString("ko-KR") + "원";

    if (cartItems.length === 0) {
        <CartEmptyList />
    }
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <CartHeader
                    isEditing={isEditing}
                    onToggleEdit={() => setIsEditing(!isEditing)}
                />
            </header>
            <main>
                <CartList
                    items={cartItems}
                    isEditing={isEditing}
                    onRemoveItem={removeItem}
                />
                <div className="mx-4 my-6">
                    <CartSummary
                        totalAmount={totalAmount}
                        shippingFee={shippingFee}
                        finalAmount={finalAmount}
                        formatPrice={formatPrice}
                    />
                </div>
            </main>
            <div className="fixed bottom-0 left-0 right-0 p-4">
                <Button
                    onClick={() => { }}
                    className="w-full bg-blue-600 text-white py-4 font-semibold text-lg cursor-pointer whitespace-nowrap hover:bg-blue-700 transition-colors rounded-lg"
                >
                    결제하기 · {formatPrice(finalAmount)}
                </Button>
            </div>
        </div>
    );
};

export default CartPage;
