const ProfileHeader = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                    <h1 className="text-2xl font-bold text-gray-900">
                        마이페이지
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
    );
};

export default ProfileHeader;