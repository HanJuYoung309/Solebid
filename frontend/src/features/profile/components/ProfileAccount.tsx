const ProfileAccount = () => {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                계정 관리
            </h3>
            <div className="space-y-3">
                <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer !rounded-button whitespace-nowrap">
                    <i className="fas fa-shield-alt mr-2" />
                    보안 설정
                </button>
                <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer !rounded-button whitespace-nowrap">
                    <i className="fas fa-sign-out-alt mr-2" />
                    로그아웃
                </button>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="text-center space-y-2">
                    <a
                        href="#"
                        className="block text-gray-600 text-sm hover:text-gray-900 cursor-pointer">
                        회원 탈퇴
                    </a>
                    <a
                        href="#"
                        className="block text-gray-600 text-sm hover:text-gray-900 cursor-pointer">
                        개인정보 처리방침
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ProfileAccount;