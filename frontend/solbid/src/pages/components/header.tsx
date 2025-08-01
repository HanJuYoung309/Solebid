import React, { useState } from "react";
import {useNavigate} from "react-router-dom";

function Header()
{
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [userProfile] = useState({
        name: "김민준",
        email: "minjun.kim@email.com",
        joinDate: "2024-12-15",
        bidCount: 45,
        successfulBids: 12,
    });
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [loginForm, setLoginForm] = useState({
        email: "",
        password: "",
    });
    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle login logic here
        console.log("Login attempted:", loginForm);
    };
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const profileMenu = document.getElementById("profile-menu");
            const profileButton = document.getElementById("profile-button");
            if (
                profileMenu &&
                profileButton &&
                !profileMenu.contains(event.target as Node) &&
                !profileButton.contains(event.target as Node)
            ) {
                setShowProfileMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    return (
        <>
            <nav className="bg-white shadow-sm">
                <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
                    {/* 좌측 로고 + 메뉴 */}
                    <div className="flex items-center space-x-8">

                        <h1 className="text-2xl font-bold text-blue-600 cursor-pointer"
                        onClick={() => navigate('/')}
                        >SoleBid</h1>

                        <div className="hidden md:flex space-x-6">
                            <span className="text-gray-600 hover:text-gray-900 cursor-pointer"
                            onClick={() => navigate("/productListByAuction")}
                            >경매</span>

                            <span className="text-gray-600 hover:text-gray-900 cursor-pointer"
                                  onClick={() => navigate("/productListByBrand")}
                            >브랜드</span>

                            <span className="text-gray-600 hover:text-gray-900 cursor-pointer"
                                  onClick={() => navigate("/productListByRank")}
                            >랭킹</span>
                        </div>
                    </div>

                    {/* 우측 검색 + 버튼들 */}
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <div className="relative">
                                <input
                                    type="search"
                                    placeholder="상품 검색"
                                    className="w-64 pl-10 pr-4 py-2 bg-gray-100 rounded-l-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
                            </div>
                            <button className="px-4 py-2 bg-blue-500 text-white !rounded-r-lg hover:bg-blue-600 cursor-pointer whitespace-nowrap"
                            onClick={() => navigate("/productListBySearch")}>
                                검색
                            </button>
                        </div>

                        <button
                            className="px-4 py-2 bg-blue-500 text-white !rounded-button hover:bg-blue-600 cursor-pointer whitespace-nowrap"
                            onClick={() => navigate(`/productRegister`)}
                        >
                            경매 등록
                        </button>

                        {isLoggedIn ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 !rounded-button hover:bg-gray-50"
                                >
                                    <i className="fas fa-user-circle text-lg"></i>
                                    <span>{userProfile.name}</span>
                                </button>
                                {/* 드롭다운 메뉴 */}
                                <div
                                    className={`absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg transition-all duration-200 z-50 ${
                                        showProfileMenu ? "opacity-100 visible" : "opacity-0 invisible"
                                    }`}
                                >
                                    <a href="#profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                                        <i className="fas fa-user mr-2"></i>마이페이지
                                    </a>
                                    <a href="#settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                                        <i className="fas fa-cog mr-2"></i>설정
                                    </a>
                                    <button
                                        onClick={() => setIsLoggedIn(false)}
                                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50"
                                    >
                                        <i className="fas fa-sign-out-alt mr-2"></i>로그아웃
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowLoginModal(true)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 !rounded-button hover:bg-gray-50 cursor-pointer whitespace-nowrap"
                            >
                                로그인
                            </button>
                        )}

                        {/* 회원가입 버튼 */}
                        <button className="px-4 py-2 bg-gray-900 text-white !rounded-button hover:bg-gray-800 cursor-pointer whitespace-nowrap">
                            회원가입
                        </button>
                    </div>
                </div>
            </nav>

            {/* 로그인 모달 */}
            {showLoginModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 w-full max-w-md relative">
                        <button
                            onClick={() => setShowLoginModal(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            <i className="fas fa-times"></i>
                        </button>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">로그인</h2>
                        <form onSubmit={handleLoginSubmit} className="space-y-4">
                            <input
                                type="email"
                                placeholder="이메일"
                                value={loginForm.email}
                                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            />
                            <input
                                type="password"
                                placeholder="비밀번호"
                                value={loginForm.password}
                                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            />
                            <button type="submit" className="w-full py-3 bg-blue-500 text-white !rounded-button">
                                로그인
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default Header;