import { Link } from "react-router-dom";

const OrderHeader = () => {
    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link
                            to="https://readdy.ai/home/..."
                            data-readdy="true"
                            className="flex items-center text-gray-600 hover:text-gray-900 mr-4 cursor-pointer"
                        >
                            <i className="fas fa-arrow-left text-lg mr-2" />
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">
                            주문/배송 조회
                        </h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="text-gray-600 hover:text-gray-900 cursor-pointer">
                            <i className="fas fa-bell text-lg" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 cursor-pointer">
                            <i className="fas fa-cog text-lg" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default OrderHeader;