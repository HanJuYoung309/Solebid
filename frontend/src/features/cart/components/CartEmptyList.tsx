const CartEmptyList = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b border-gray-200">
                <div className="flex items-center justify-between px-4 py-4">
                    <button className="cursor-pointer">
                        <i className="fas fa-arrow-left text-xl text-gray-700" />
                    </button>
                    <h1 className="text-lg font-semibold text-gray-900">
                        장바구니
                    </h1>
                </div>
            </div>
            <div className="flex flex-col items-center justify-center px-6 py-32">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <i className="fas fa-shopping-cart text-3xl text-gray-400" />
                </div>
                <h2 className="text-xl font-medium text-gray-900 mb-2">
                    장바구니가 비어있습니다
                </h2>
                <p className="text-gray-500 text-center mb-8">
                    원하는 상품을 장바구니에 담아보세요
                </p>
                <button className="bg-blue-600 text-white px-8 py-3 !rounded-button font-medium cursor-pointer whitespace-nowrap hover:bg-blue-700 transition-colors">
                    쇼핑 계속하기
                </button>
            </div>
        </div>
    );
};

export default CartEmptyList;