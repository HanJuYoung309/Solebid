import type { OrderListProps } from "../types/OrderListProps";
import OrderItem from "./OrderItem";

const OrderList = ({
    orders,
    expandedOrder,
    toggleOrderExpansion,
}: OrderListProps) => {
    return (
        <div className="space-y-4">
            {orders.map((order) => (
                <OrderItem
                    key={order.id}
                    order={order}
                    isExpanded={expandedOrder === order.id}
                    onToggleExpand={toggleOrderExpansion}
                />
            ))}
        </div>
    );
};

export default OrderList;