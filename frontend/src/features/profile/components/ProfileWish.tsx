import type { Wish } from "../types/Wish";

const wishData: Wish[] = [
    { id: 1, name: "럭셔리 시계", price: "299,000원", imageUrl: "https://readdy.ai/api/search-image?query=elegant%20watch%20luxury%20timepiece%20silver%20metal%20band%20clean%20white%20background%20product%20photography%20professional%20lighting%20high%20quality&width=120&height=120&seq=wishlist001&orientation=squarish" },
    { id: 2, name: "노트북", price: "1,299,000원", imageUrl: "https://readdy.ai/api/search-image?query=modern%20laptop%20computer%20silver%20aluminum%20design%20clean%20white%20background%20product%20photography%20professional%20lighting%20high%20quality&width=120&height=120&seq=wishlist002&orientation=squarish" },
    { id: 3, name: "스킨케어 세트", price: "89,000원", imageUrl: "https://readdy.ai/api/search-image?query=premium%20skincare%20cream%20jar%20white%20container%20clean%20white%20background%20product%20photography%20professional%20lighting%20high%20quality&width=120&height=120&seq=wishlist003&orientation=squarish" },
];

const WishItem: React.FC<Wish> = ({ name, price, imageUrl }) => (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
        <img
            src={imageUrl}
            alt={name}
            className="w-full h-24 object-cover rounded-lg mb-2" />
        <h4 className="font-medium text-gray-900 text-sm">
            {name}
        </h4>
        <p className="text-blue-600 font-semibold text-sm">
            {price}
        </p>
    </div>
);

const ProfileWish = () => {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                    찜한 상품
                </h3>
                <button className="text-blue-600 text-sm hover:text-blue-800 cursor-pointer">
                    전체 보기
                </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
                {wishData.map(item => <WishItem key={item.id} {...item} />)}
            </div>
        </div>
    );
};

export default ProfileWish;