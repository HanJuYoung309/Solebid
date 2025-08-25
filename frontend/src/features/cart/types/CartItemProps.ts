import type { Cart } from "./Cart";

export interface CartItemProps {
    item: Cart;
    isEditing: boolean;
    onRemoveItem: (id: number) => void;
}