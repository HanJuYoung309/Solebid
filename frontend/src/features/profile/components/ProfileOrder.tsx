import type { Order } from "../types/Order";

const orderData: Order[] = [
    { id: 1, name: "무선 블루투스 헤드폰", date: "2024.01.15 주문", price: "89,000원", status: "배송완료", imageUrl: "https://readdy.ai/api/search-image?query=modern%20wireless%20bluetooth%20headphones%20black%20color%20clean%20white%20background%20product%20photography%20professional%20lighting%20high%20quality&width=60&height=60&seq=product001&orientation=squarish" },
    { id: 2, name: "프리미엄 원두 커피", date: "2024.01.12 주문", price: "25,000원", status: "배송중", imageUrl: "https://readdy.ai/api/search-image?query=premium%20coffee%20beans%20package%20bag%20dark%20roast%20clean%20white%20background%20product%20photography%20professional%20lighting%20high%20quality&width=60&height=60&seq=product002&orientation=squarish" },
    { id: 3, name: "스마트폰 케이스", date: "2024.01.10 주문", price: "15,000원", status: "배송완료", imageUrl: "https://readdy.ai/api/search-image?query=modern%20smartphone%20case%20clear%20transparent%20design%20clean%20white%20background%20product%20photography%20professional%20lighting%20high%20quality&width=60&height=60&seq=product003&orientation=squarish" },
];

const OrderItem: React.FC<Order> = ({ name, date, price, status, imageUrl }) => {
    const statusColor = status === '배송완료' ? 'text-green-600' : 'text-blue-600';
    return (
        <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center">
                <img
                    src={imageUrl}
                    alt={name}
                    className="w-12 h-12 rounded-lg object-cover mr-4" />
                <div>
                    <h4 className="font-medium text-gray-900">
                        {name}
                    </h4>
                    <p className="text-gray-600 text-sm">
                        {date}
                    </p>
                </div>
            </div>
            <div className="text-right">
                <div className="font-semibold text-gray-900">
                    {price}
                </div>
                <div className={`${statusColor} text-sm`}>
                    {status}
                </div>
            </div>
        </div>
    );
}

const ProfileOrder = () => {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                    최근 주문 내역
                </h3>
                <button className="text-blue-600 text-sm hover:text-blue-800 cursor-pointer">
                    전체 보기
                </button>
            </div>
            <div className="space-y-4">
                {orderData.map(order => <OrderItem key={order.id} {...order} />)}
            </div>
        </div>
    );
};

export default ProfileOrder;