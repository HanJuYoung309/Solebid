import type { Cart } from "./Cart";

export interface CartListProps {
    items: Cart[];
    isEditing: boolean;
    onRemoveItem: (id: number) => void;
}