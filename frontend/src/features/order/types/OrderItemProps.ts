import type { Order } from "./Order";

export interface OrderItemProps {
    order: Order;
    isExpanded: boolean;
    onToggleExpand: (orderId: string) => void;
}