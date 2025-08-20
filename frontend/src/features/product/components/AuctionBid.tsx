import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AuctionBid() {
    const navigate = useNavigate();

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [productInfo, setProductInfo] = useState({
        name: "",
        brand: "",
        category: "",
        size: "",
        startPrice: "",
        confirmationPrice: "",
        startDate: "",
        endDate: "",
        condition: "",
        description: "",
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    const brands = [
        "Nike",
        "Adidas",
        "New Balance",
        "Converse",
        "Vans",
        "PUMA",
        "REEBOK",
        "ASICS",
    ];
    const categories = ["스니커즈", "러닝화", "농구화", "캔버스화"];
    const sizes = Array.from({ length: 15 }, (_, i) => 230 + 5 * i);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && selectedFiles.length < 5) {
            const newFiles = Array.from(files).slice(0, 5 - selectedFiles.length);
            setSelectedFiles([...selectedFiles, ...newFiles]);
            setPreviewUrls([
                ...previewUrls,
                ...newFiles.map(file => URL.createObjectURL(file)),
            ]);
        }
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!productInfo.name.trim()) {
            newErrors.name = "상품명을 입력해주세요.";
        }

        if (!productInfo.brand) {
            newErrors.brand = "브랜드를 선택해주세요.";
        }

        if (!productInfo.category) {
            newErrors.category = "카테고리를 선택해주세요.";
        }

        if (!productInfo.size) {
            newErrors.size = "사이즈를 선택해주세요.";
        }

        if (!productInfo.startPrice) {
            newErrors.startPrice = "시작가를 입력해주세요.";
        }

        if (!productInfo.confirmationPrice) {
            newErrors.confirmationPrice = "즉시 구매가를 입력해주세요.";
        }

        if (!productInfo.startDate) {
            newErrors.startDate = "경매 시작일을 선택해주세요.";
        }

        if (!productInfo.endDate) {
            newErrors.endDate = "경매 종료일을 선택해주세요.";
        }

        if (!productInfo.condition) {
            newErrors.condition = "상품 상태를 선택해주세요.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        const formData = new FormData();

        selectedFiles.forEach(file => { formData.append("files", file) });

        formData.append("name", productInfo.name);
        formData.append("brand", productInfo.brand);
        formData.append("category", productInfo.category);
        formData.append("size", productInfo.size);
        formData.append("startPrice", productInfo.startPrice.toString());
        formData.append("confirmationPrice", productInfo.confirmationPrice.toString());
        formData.append("startDate", productInfo.startDate);
        formData.append("endDate", productInfo.endDate);
        formData.append("condition", productInfo.condition);
        formData.append("description", productInfo.description);

        const res = await fetch("/api/auction/bid", {
            method: "POST",
            body: formData,
        });

        if (!res.ok) {
            const errorData = await res.json();
            alert(errorData.message);
            return;
        }

        setShowSuccessToast(true);
        setTimeout(() => {
            setShowSuccessToast(false);

        }, 2000);
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-[1440px] mx-auto">
                {/* Header */}
                <header className="h-16 px-6 flex items-center border-b bg-white sticky top-0 z-10">
                    <a
                        data-readdy="true"
                        className="flex items-center text-gray-600 hover:text-gray-900"
                    >
                        <i className="fas fa-arrow-left mr-2"></i>
                        <span>뒤로가기</span>
                    </a>
                    <h1 className="text-xl font-bold text-center flex-1">
                        경매 상품 등록
                    </h1>
                </header>
                {/* Main Content */}
                <div className="max-w-3xl mx-auto py-8 px-6">
                    {/* Image Upload */}
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold mb-4">상품 이미지</h2>
                        <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                            <input
                                type="file"
                                id="imageUpload"
                                multiple
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                            <label htmlFor="imageUpload" className="cursor-pointer">
                                <i className="fas fa-camera text-3xl text-gray-400 mb-4"></i>
                                <p className="text-gray-600">
                                    이미지를 드래그하거나 클릭하여 업로드하세요
                                </p>
                                <p className="text-sm text-gray-400 mt-2">
                                    최대 5장까지 등록 가능
                                </p>
                            </label>
                        </div>
                        {previewUrls.length > 0 && (
                            <div className="grid grid-cols-5 gap-4 mt-4">
                                {previewUrls.map((image, index) => (
                                    <div
                                        key={index}
                                        className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden"
                                    >
                                        <img
                                            src={image}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            onClick={() =>
                                                setPreviewUrls(
                                                    previewUrls.filter((_, i) => i !== index),
                                                )
                                            }
                                            className="absolute top-2 right-2 bg-gray-900 bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                        >
                                            <i className="fas fa-times text-sm"></i>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* Product Information */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                상품명
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="상품명을 입력하세요"
                                value={productInfo.name}
                                onChange={(e) =>
                                    setProductInfo({ ...productInfo, name: e.target.value })
                                }
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    브랜드
                                </label>
                                <div className="relative">
                                    <select
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={productInfo.brand}
                                        onChange={(e) =>
                                            setProductInfo({ ...productInfo, brand: e.target.value })
                                        }
                                    >
                                        <option value="">브랜드 선택</option>
                                        {brands.map((brand) => (
                                            <option key={brand} value={brand}>
                                                {brand}
                                            </option>
                                        ))}
                                    </select>
                                    <i className="fas fa-chevron-down absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                                </div>
                                {errors.brand && (
                                    <p className="text-red-500 text-sm mt-1">{errors.brand}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    카테고리
                                </label>
                                <div className="relative">
                                    <select
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={productInfo.category}
                                        onChange={(e) =>
                                            setProductInfo({
                                                ...productInfo,
                                                category: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="">카테고리 선택</option>
                                        {categories.map((category) => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                    <i className="fas fa-chevron-down absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                                </div>
                                {errors.category && (
                                    <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                사이즈
                            </label>
                            <div className="grid grid-cols-6 gap-2">
                                {sizes.map((size) => (
                                    <button
                                        key={size}
                                        className={`px-3 py-2 text-sm border !rounded-button cursor-pointer whitespace-nowrap ${productInfo.size === size.toString()
                                            ? "bg-blue-500 text-white border-blue-500"
                                            : "border-gray-300 text-gray-700 hover:border-blue-500"
                                            }`}
                                        onClick={() =>
                                            setProductInfo({ ...productInfo, size: size.toString() })
                                        }
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                            {errors.size && (
                                <p className="text-red-500 text-sm mt-1">{errors.size}</p>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    시작가
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="시작가 입력"
                                        value={productInfo.startPrice}
                                        onChange={(e) =>
                                            setProductInfo({
                                                ...productInfo,
                                                startPrice: e.target.value.replace(/[^0-9]/g, ""),
                                            })
                                        }
                                    />
                                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                                        원
                                    </span>
                                </div>
                                {errors.startPrice && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.startPrice}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    즉시 구매가
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="즉시 구매가 입력"
                                        value={productInfo.confirmationPrice}
                                        onChange={(e) =>
                                            setProductInfo({
                                                ...productInfo,
                                                confirmationPrice: e.target.value.replace(/[^0-9]/g, ""),
                                            })
                                        }
                                    />
                                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                                        원
                                    </span>
                                </div>
                                {errors.buyNowPrice && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.buyNowPrice}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    경매 시작일
                                </label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={productInfo.startDate}
                                    onChange={(e) =>
                                        setProductInfo({
                                            ...productInfo,
                                            startDate: e.target.value,
                                        })
                                    }
                                />
                                {errors.startDate && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.startDate}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    경매 종료일
                                </label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={productInfo.endDate}
                                    onChange={(e) =>
                                        setProductInfo({ ...productInfo, endDate: e.target.value })
                                    }
                                />
                                {errors.endDate && (
                                    <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                상품 상태
                            </label>
                            <div className="flex space-x-4">
                                {["새상품", "중고상품"].map((condition) => (
                                    <label
                                        key={condition}
                                        className="flex items-center cursor-pointer"
                                    >
                                        <input
                                            type="radio"
                                            className="w-4 h-4 text-blue-500 border-gray-300 focus:ring-blue-500"
                                            name="condition"
                                            value={condition}
                                            checked={productInfo.condition === condition}
                                            onChange={(e) =>
                                                setProductInfo({
                                                    ...productInfo,
                                                    condition: e.target.value,
                                                })
                                            }
                                        />
                                        <span className="ml-2 text-gray-700">{condition}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.condition && (
                                <p className="text-red-500 text-sm mt-1">{errors.condition}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                상세 설명
                            </label>
                            <textarea
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
                                placeholder="상품의 상세 정보와 특이사항을 입력해주세요"
                                value={productInfo.description}
                                onChange={(e) =>
                                    setProductInfo({
                                        ...productInfo,
                                        description: e.target.value,
                                    })
                                }
                            ></textarea>
                        </div>
                    </div>
                </div>
                {/* Footer Buttons */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
                    <div className="max-w-3xl mx-auto px-6 py-4 flex space-x-4">
                        <a
                            data-readdy="true"
                            className="flex-1"
                        >
                            <button className="w-full px-6 py-3 border border-gray-300 text-gray-700 !rounded-button hover:bg-gray-50 cursor-pointer whitespace-nowrap"
                                onClick={() => navigate("/")}
                            >
                                취소
                            </button>
                        </a>
                        <button
                            onClick={handleSubmit}
                            className="flex-1 px-6 py-3 bg-blue-500 text-white !rounded-button hover:bg-blue-600 cursor-pointer whitespace-nowrap"
                        >
                            등록하기
                        </button>
                    </div>
                </div>
                {/* Success Toast */}
                {showSuccessToast && (
                    <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
                        <div className="flex items-center">
                            <i className="fas fa-check-circle mr-2"></i>
                            <span>상품이 성공적으로 등록되었습니다</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AuctionBid;
