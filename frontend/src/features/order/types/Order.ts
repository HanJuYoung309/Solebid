export interface Order {
    id: string;
    date: string;
    items: OrderItem[];
    totalAmount: number;
    status: string;
    statusColor: string;
    trackingNumber: string;
    deliveryAddress: string;
}

export interface OrderItem {
    name: string;
    image: string;
    quantity: number;
    price: number;
}
