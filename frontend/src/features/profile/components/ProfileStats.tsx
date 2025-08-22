import type { Stat } from "../types/Stat";

const statsData: Stat[] = [
    { label: "총 주문", value: 12, color: "text-blue-600" },
    { label: "리뷰 작성", value: 8, color: "text-green-600" },
    { label: "적립 포인트", value: "2,450", color: "text-purple-600" },
];

const StatCard: React.FC<Stat> = ({ label, value, color }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <div className={`text-2xl font-bold ${color} mb-1`}>{value}</div>
        <div className="text-gray-600 text-sm">{label}</div>
    </div>
);

const ProfileStats = () => {
    return (
        <div className="grid grid-cols-3 gap-4 mb-6">
            {statsData.map((stat) => (
                <StatCard key={stat.label} {...stat} />
            ))}
        </div>
    );
};

export default ProfileStats;