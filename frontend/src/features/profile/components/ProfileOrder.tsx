import type { ProfileOrderProps } from "../types/ProfileOrderProps";
import { orderData } from "./mockData";

const OrderItem: React.FC<ProfileOrderProps> = ({ name, date, price, status, imageUrl }) => {
    const statusColor = status === '배송완료' ? 'text-green-600' : 'text-blue-600';
    return (
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
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