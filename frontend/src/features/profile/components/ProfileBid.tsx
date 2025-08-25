import { Link } from "react-router-dom";
import type { ProfileBidProps } from "../types/ProfileBidProps";
import { bidData } from "./mockData";

const BidItem: React.FC<ProfileBidProps> = ({ name, date, price, imageUrl }) => {
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
            </div>
        </div>
    );
}

const ProfileBid = () => {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                    최근 낙찰 내역
                </h3>
                <Link
                    to="/cart"
                    className="text-blue-600 text-sm hover:text-blue-800 cursor-pointer">
                    전체 보기
                </Link>
            </div>
            <div className="space-y-4">
                {bidData.map(order => <BidItem key={order.id} {...order} />)}
            </div>
        </div>
    );
};

export default ProfileBid;