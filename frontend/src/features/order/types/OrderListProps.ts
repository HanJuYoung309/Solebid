import type { Order } from "./Order";

export interface OrderListProps {
    orders: Order[];
    expandedOrder: string | null;
    toggleOrderExpansion: (orderId: string) => void;
}