import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Signup: React.FC = () => {
    const navigate = useNavigate();

    // 폼 데이터 상태
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        nickname: "", // 닉네임 필드 추가
        name: "",
        phone: "",
    });

    // 약관 동의 상태
    const [agreements, setAgreements] = useState({
        all: false,
        terms: false,
        privacy: false,
        marketing: false,
    });

    // 유효성 검사 에러 메시지 상태
    const [errors, setErrors] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        nickname: "",
        name: "",
        phone: "",
        agreeTerms: "",
        agreePrivacy: "",
    });

    // 약관 모달 표시 상태
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);

    // --- 유효성 검사 함수들 (백엔드 기준) ---
    const validateEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) return "이메일을 입력해주세요.";
        if (!regex.test(email)) return "올바른 이메일 형식이 아닙니다.";
        return "";
    };

    const validatePassword = (password: string) => {
        const regex = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*\W)(?=\S+$).{8,20}$/;
        if (!password) return "비밀번호를 입력해주세요.";
        if (!regex.test(password)) return "비밀번호는 8~20자 영문, 숫자, 특수문자를 포함해야 합니다.";
        return "";
    };

    const validateNickname = (nickname: string) => {
        if (!nickname) return "닉네임을 입력해주세요.";
        if (nickname.length < 2 || nickname.length > 10) return "닉네임은 2자 이상 10자 이하로 입력해주세요.";
        return "";
    };

    const validatePhone = (phone: string) => {
        const regex = /^01(?:0|1|[6-9])[0-9]{7,8}$/;
        if (!phone) return "휴대폰 번호를 입력해주세요.";
        if (!regex.test(phone)) return "올바른 휴대폰 번호 형식이 아닙니다.";
        return "";
    };

    // --- 이벤트 핸들러 ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // 실시간 유효성 검사
        let error = "";
        if (name === "email") error = validateEmail(value);
        if (name === "password") error = validatePassword(value);
        if (name === "confirmPassword") {
            error = formData.password !== value ? "비밀번호가 일치하지 않습니다." : "";
        }
        if (name === "nickname") error = validateNickname(value);
        if (name === "phone") error = validatePhone(value);
        if (name === "name" && !value) error = "이름을 입력해주세요.";

        setErrors((prev) => ({ ...prev, [name]: error }));
    };

    const handleAllAgreements = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = e.target;
        setAgreements({ all: checked, terms: checked, privacy: checked, marketing: checked });
    };

    const handleAgreementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setAgreements((prev) => ({ ...prev, [name]: checked }));
    };

    useEffect(() => {
        const { terms, privacy, marketing } = agreements;
        setAgreements((prev) => ({ ...prev, all: terms && privacy && marketing }));
    }, [agreements.terms, agreements.privacy, agreements.marketing]);


    const isFormValid = () => {
        const isFormDataFilled = Object.values(formData).every(value => value.trim() !== "");
        const noErrors = !Object.values(errors).some(error => error !== "");
        const requiredAgreements = agreements.terms && agreements.privacy;
        return isFormDataFilled && noErrors && requiredAgreements;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // 최종 유효성 검사
        const newErrors = {
            email: validateEmail(formData.email),
            password: validatePassword(formData.password),
            confirmPassword: formData.password !== formData.confirmPassword ? "비밀번호가 일치하지 않습니다." : "",
            nickname: validateNickname(formData.nickname),
            name: !formData.name ? "이름을 입력해주세요." : "",
            phone: validatePhone(formData.phone),
            agreeTerms: !agreements.terms ? "이용약관에 동의해주세요." : "",
            agreePrivacy: !agreements.privacy ? "개인정보 처리방침에 동의해주세요." : ""
        };
        setErrors(newErrors);

        const isValid = Object.values(newErrors).every(error => error === "");

        if (isValid) {
            try {
                const response = await fetch("/api/users/signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password,
                        nickname: formData.nickname,
                        name: formData.name,
                        phone: formData.phone,
                    }),
                });

                const result = await response.json();

                if (response.status === 201 && result.is_success) {
                    alert("회원가입이 성공적으로 완료되었습니다!");
                    navigate("/");
                } else {
                    alert(result.message || "회원가입에 실패했습니다.");
                }
            } catch (error) {
                console.error("Signup error:", error);
                alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
            }
        }
    };

    const openTermsModal = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowTermsModal(true);
    };
    const openPrivacyModal = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowPrivacyModal(true);
    };
    const closeModal = () => {
        setShowTermsModal(false);
        setShowPrivacyModal(false);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Main Content */}
            <div className="flex items-center justify-center py-12 px-6">
                <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            새 계정 만들기
                        </h3>
                        <p className="text-gray-600 text-sm">
                            SoleBid에서 신발 경매를 시작해보세요
                        </p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                이메일 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email" id="email" name="email"
                                value={formData.email} onChange={handleInputChange}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-blue-500 text-sm ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                                placeholder="example@email.com"
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>
                        {/* Password */}
                        <div>
                            <label htmlFor="password"
                                   className="block text-sm font-medium text-gray-700 mb-2">
                                비밀번호 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password" id="password" name="password"
                                value={formData.password} onChange={handleInputChange}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-blue-500 text-sm ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                                placeholder="8~20자 영문, 숫자, 특수문자 포함"
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                        </div>
                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword"
                                   className="block text-sm font-medium text-gray-700 mb-2">
                                비밀번호 확인 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password" id="confirmPassword" name="confirmPassword"
                                value={formData.confirmPassword} onChange={handleInputChange}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-blue-500 text-sm ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                                placeholder="비밀번호를 다시 입력해주세요"
                            />
                            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                        </div>
                        {/* Nickname */}
                        <div>
                            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
                                닉네임 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text" id="nickname" name="nickname"
                                value={formData.nickname} onChange={handleInputChange}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-blue-500 text-sm ${errors.nickname ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                                placeholder="2자 이상 10자 이하"
                            />
                            {errors.nickname && <p className="text-red-500 text-xs mt-1">{errors.nickname}</p>}
                        </div>
                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                이름 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text" id="name" name="name"
                                value={formData.name} onChange={handleInputChange}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-blue-500 text-sm ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                                placeholder="실명을 입력해주세요"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>
                        {/* Phone */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                전화번호 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel" id="phone" name="phone"
                                value={formData.phone} onChange={handleInputChange}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-blue-500 text-sm ${errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                                placeholder="'-' 없이 숫자만 입력"
                            />
                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                        </div>
                        {/* Terms Agreement */}
                        <div className="space-y-3 pt-4">
                            <div className="flex items-center">
                                <input type="checkbox" id="all" checked={agreements.all} onChange={handleAllAgreements}
                                       className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                                <label htmlFor="all" className="ml-2 text-sm font-medium text-gray-700">
                                    전체 동의
                                </label>
                            </div>
                            <div className="flex items-start">
                                <input type="checkbox" id="terms" name="terms" checked={agreements.terms} onChange={handleAgreementChange}
                                       className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer" />
                                <label htmlFor="terms" className="ml-3 text-sm text-gray-700 cursor-pointer">
                                    <span className="text-red-500">*</span> 이용약관에 동의합니다
                                    <a href="#" onClick={openTermsModal} className="text-blue-600 hover:text-blue-800 ml-1 underline cursor-pointer">
                                        보기
                                    </a>
                                </label>
                            </div>
                            {errors.agreeTerms && <p className="text-red-500 text-xs ml-7">{errors.agreeTerms}</p>}
                            <div className="flex items-start">
                                <input type="checkbox" id="privacy" name="privacy" checked={agreements.privacy} onChange={handleAgreementChange}
                                       className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer" />
                                <label htmlFor="privacy" className="ml-3 text-sm text-gray-700 cursor-pointer">
                                    <span className="text-red-500">*</span> 개인정보 처리방침에 동의합니다
                                    <a href="#" onClick={openPrivacyModal} className="text-blue-600 hover:text-blue-800 ml-1 underline cursor-pointer">
                                        보기
                                    </a>
                                </label>
                            </div>
                            {errors.agreePrivacy && <p className="text-red-500 text-xs ml-7">{errors.agreePrivacy}</p>}
                            <div className="flex items-start">
                                <input type="checkbox" id="marketing" name="marketing" checked={agreements.marketing} onChange={handleAgreementChange}
                                       className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer" />
                                <label htmlFor="marketing" className="ml-3 text-sm text-gray-700 cursor-pointer">
                                    마케팅 정보 수신에 동의합니다 (선택)
                                </label>
                            </div>
                        </div>
                        {/* Submit Button */}
                        <button type="submit" disabled={!isFormValid()}
                                className={`w-full py-3 font-medium !rounded-button cursor-pointer whitespace-nowrap transition-colors ${isFormValid() ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
                            회원가입
                        </button>
                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">또는</span>
                            </div>
                        </div>
                        {/* Kakao Signup */}
                        <button type="button"
                                className="w-full py-3 bg-[#FEE500] text-gray-900 font-medium !rounded-button hover:bg-[#FDD800] cursor-pointer whitespace-nowrap flex items-center justify-center transition-colors no-underline">
                            <i className="fas fa-comment mr-2"></i>
                            카카오로 시작하기
                        </button>
                    </form>
                    {/* Login Link */}
                    <div className="text-center mt-8 pt-6 border-t border-gray-200">
                        <span className="text-gray-600 text-sm">이미 계정이 있으신가요?</span>
                        <button onClick={() => navigate("/")} className="ml-2 text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer">
                            로그인
                        </button>
                    </div>
                </div>
            </div>
            {/* Terms Modal */}
            {showTermsModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900">이용약관</h3>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1 text-sm text-gray-700 leading-relaxed">
                            {/* 약관 내용... */}
                            <p>이용약관 내용이 여기에 표시됩니다.</p>
                        </div>
                        <div className="p-6 border-t border-gray-200">
                            <button onClick={closeModal} className="w-full py-3 bg-blue-500 text-white font-medium !rounded-button hover:bg-blue-600">
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Privacy Modal */}
            {showPrivacyModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900">개인정보 처리방침</h3>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1 text-sm text-gray-700 leading-relaxed">
                            {/* 개인정보 처리방침 내용... */}
                            <p>개인정보 처리방침 내용이 여기에 표시됩니다.</p>
                        </div>
                        <div className="p-6 border-t border-gray-200">
                            <button onClick={closeModal} className="w-full py-3 bg-blue-500 text-white font-medium !rounded-button hover:bg-blue-600">
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Signup;
