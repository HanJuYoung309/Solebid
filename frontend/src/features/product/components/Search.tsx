import React, { useMemo, useState } from "react";

const Search: React.FC = () => {
    const [searchQuery] = useState("나이키");
    const [sortBy, setSortBy] = useState("인기순");

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const itemsDropdown = document.getElementById("itemsPerPageDropdown");
            const itemsMenu = document.getElementById("dropdownMenu");
            const sortDropdown = document.getElementById("sortDropdown");
            const sortMenu = document.getElementById("sortDropdownMenu");

            if (
                itemsDropdown &&
                !itemsDropdown.contains(event.target as Node) &&
                itemsMenu
            ) {
                itemsMenu.classList.add("hidden");
            }

            if (
                sortDropdown &&
                !sortDropdown.contains(event.target as Node) &&
                sortMenu
            ) {
                sortMenu.classList.add("hidden");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const [showFilters, setShowFilters] = useState(false);
    const [priceRange, setPriceRange] = useState([0, 500000]);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(12);
    const [showToast, setShowToast] = useState(false);

    const brands = ["Nike", "Adidas", "New Balance", "Converse", "Vans", "Puma"];
    const sizes = [
        "230",
        "235",
        "240",
        "245",
        "250",
        "255",
        "260",
        "265",
        "270",
        "275",
        "280",
    ];

    const sortOptions = ["인기순", "가격 높은순", "가격 낮은순", "최신순"];

    const allSearchResults = [
        {
            image:
                "https://readdy.ai/api/search-image?query=premium%20white%20Nike%20Air%20Max%20sneakers%20on%20minimal%20light%20background%20with%20subtle%20reflection%2C%20professional%20product%20photography&width=300&height=300&seq=6&orientation=squarish",
            brand: "Nike",
            name: "Air Max 270 React",
            price: "189,000",
            bidCount: 24,
            timeLeft: "2:14:53",
        },
        {
            image:
                "https://readdy.ai/api/search-image?query=stylish%20black%20Nike%20Air%20Force%20sneakers%20on%20minimal%20light%20background%20with%20clean%20composition%2C%20high-end%20product%20shot&width=300&height=300&seq=7&orientation=squarish",
            brand: "Nike",
            name: "Air Force 1 Low",
            price: "159,000",
            bidCount: 18,
            timeLeft: "1:45:21",
        },
        {
            image:
                "https://readdy.ai/api/search-image?query=modern%20red%20and%20white%20Nike%20basketball%20shoes%20on%20minimal%20light%20background%20with%20soft%20shadows%2C%20professional%20studio%20photography&width=300&height=300&seq=8&orientation=squarish",
            brand: "Nike",
            name: "Air Jordan 1 Mid",
            price: "229,000",
            bidCount: 32,
            timeLeft: "3:22:15",
        },
        {
            image:
                "https://readdy.ai/api/search-image?query=elegant%20gray%20Nike%20running%20shoes%20on%20minimal%20light%20background%20with%20artistic%20lighting%2C%20commercial%20product%20photography&width=300&height=300&seq=9&orientation=squarish",
            brand: "Nike",
            name: "React Infinity Run",
            price: "179,000",
            bidCount: 15,
            timeLeft: "4:55:32",
        },
        {
            image:
                "https://readdy.ai/api/search-image?query=premium%20blue%20Nike%20Dunk%20sneakers%20on%20minimal%20light%20background%20with%20subtle%20reflection%2C%20professional%20product%20photography&width=300&height=300&seq=10&orientation=squarish",
            brand: "Nike",
            name: "Dunk Low Retro",
            price: "149,000",
            bidCount: 28,
            timeLeft: "2:30:45",
        },
        {
            image:
                "https://readdy.ai/api/search-image?query=trendy%20white%20Nike%20Blazer%20sneakers%20on%20minimal%20light%20background%20with%20clean%20composition%2C%20high-end%20product%20shot&width=300&height=300&seq=11&orientation=squarish",
            brand: "Nike",
            name: "Blazer Mid 77",
            price: "139,000",
            bidCount: 21,
            timeLeft: "5:12:18",
        },
        {
            image:
                "https://readdy.ai/api/search-image?query=stylish%20black%20and%20gold%20Nike%20Air%20Max%20sneakers%20on%20minimal%20light%20background%20with%20soft%20shadows%2C%20professional%20studio%20photography&width=300&height=300&seq=12&orientation=squarish",
            brand: "Nike",
            name: "Air Max 90",
            price: "169,000",
            bidCount: 19,
            timeLeft: "1:25:33",
        },
        {
            image:
                "https://readdy.ai/api/search-image?query=modern%20green%20Nike%20React%20running%20shoes%20on%20minimal%20light%20background%20with%20artistic%20lighting%2C%20commercial%20product%20photography&width=300&height=300&seq=13&orientation=squarish",
            brand: "Nike",
            name: "React Element 55",
            price: "159,000",
            bidCount: 16,
            timeLeft: "3:45:27",
        },
        {
            image:
                "https://readdy.ai/api/search-image?query=premium%20purple%20Nike%20basketball%20shoes%20on%20minimal%20light%20background%20with%20subtle%20reflection%2C%20professional%20product%20photography&width=300&height=300&seq=14&orientation=squarish",
            brand: "Nike",
            name: "LeBron 20",
            price: "289,000",
            bidCount: 35,
            timeLeft: "2:18:42",
        },
        {
            image:
                "https://readdy.ai/api/search-image?query=classic%20white%20Adidas%20three%20stripes%20sneakers%20on%20minimal%20light%20background%20with%20clean%20composition%2C%20professional%20product%20photography&width=300&height=300&seq=15&orientation=squarish",
            brand: "Adidas",
            name: "Stan Smith",
            price: "119,000",
            bidCount: 12,
            timeLeft: "3:45:27",
        },
        {
            image:
                "https://readdy.ai/api/search-image?query=modern%20black%20Adidas%20boost%20running%20shoes%20on%20minimal%20light%20background%20with%20subtle%20reflection%2C%20professional%20studio%20photography&width=300&height=300&seq=16&orientation=squarish",
            brand: "Adidas",
            name: "Ultraboost 22",
            price: "219,000",
            bidCount: 27,
            timeLeft: "1:15:33",
        },
        {
            image:
                "https://readdy.ai/api/search-image?query=stylish%20gray%20New%20Balance%20sneakers%20on%20minimal%20light%20background%20with%20artistic%20lighting%2C%20commercial%20product%20photography&width=300&height=300&seq=17&orientation=squarish",
            brand: "New Balance",
            name: "990v5",
            price: "199,000",
            bidCount: 22,
            timeLeft: "4:30:15",
        },
    ];

    const filteredResults = useMemo(() => {
        let filtered = allSearchResults;

        // Filter by selected brands
        if (selectedBrands.length > 0) {
            filtered = filtered.filter((product) =>
                selectedBrands.includes(product.brand),
            );
        }

        // Filter by price range
        filtered = filtered.filter((product) => {
            const price = parseInt(product.price.replace(",", ""));
            return price >= priceRange[0] && price <= priceRange[1];
        });

        // Sort results
        switch (sortBy) {
            case "가격 높은순":
                filtered.sort(
                    (a, b) =>
                        parseInt(b.price.replace(",", "")) -
                        parseInt(a.price.replace(",", "")),
                );
                break;
            case "가격 낮은순":
                filtered.sort(
                    (a, b) =>
                        parseInt(a.price.replace(",", "")) -
                        parseInt(b.price.replace(",", "")),
                );
                break;
            case "최신순":
                // Keep original order for latest
                break;
            case "인기순":
            default:
                filtered.sort((a, b) => b.bidCount - a.bidCount);
                break;
        }

        return filtered;
    }, [selectedBrands, priceRange, sortBy]);

    const totalResults = filteredResults.length;
    const totalPages = Math.ceil(totalResults / itemsPerPage);

    const handleBrandChange = (brand: string) => {
        setSelectedBrands((prev) =>
            prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
        );
        setCurrentPage(1); // Reset to first page when filter changes
    };

    const handleSizeChange = (size: string) => {
        setSelectedSizes((prev) =>
            prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
        );
    };

    const resetFilters = () => {
        setPriceRange([0, 500000]);
        setSelectedBrands([]);
        setSelectedSizes([]);
        setCurrentPage(1);
        setSortBy("인기순");

        const priceRangeInput = document.querySelector(
            'input[type="range"]',
        ) as HTMLInputElement;

        if (priceRangeInput) {
            priceRangeInput.value = "500000";
        }

        const brandCheckboxes = document.querySelectorAll(
            'input[type="checkbox"]',
        ) as NodeListOf<HTMLInputElement>;

        brandCheckboxes.forEach((checkbox) => {
            checkbox.checked = false;
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <div className="max-w-[1440px] mx-auto px-6 py-8">
                {/* Search Results Header */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        "{searchQuery}"에 대한 검색결과 {totalResults}개
                    </h2>
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="md:hidden px-4 py-2 bg-white border border-gray-300 text-gray-700 !rounded-button hover:bg-gray-50 cursor-pointer whitespace-nowrap"
                        >
                            <i className="fas fa-filter mr-2"></i>
                            필터
                        </button>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">정렬:</span>
                            <div className="relative" id="sortDropdown">
                                <button
                                    id="sortDropdownToggle"
                                    className="flex items-center justify-between min-w-[120px] bg-white border border-gray-300 px-4 py-2 !rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                    onClick={() => {
                                        const menu = document.getElementById("sortDropdownMenu");
                                        if (menu) {
                                            menu.classList.toggle("hidden");
                                        }
                                    }}
                                >
                                    <span>{sortBy}</span>
                                    <i className="fas fa-chevron-down text-gray-400 text-xs ml-2"></i>
                                </button>
                                <div
                                    id="sortDropdownMenu"
                                    className="hidden absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                                >
                                    {sortOptions.map((option) => (
                                        <button
                                            key={option}
                                            className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${sortBy === option
                                                ? "bg-blue-50 text-blue-600"
                                                : "text-gray-700"
                                                }`}
                                            onClick={() => {
                                                setSortBy(option);
                                                setCurrentPage(1);
                                                const menu =
                                                    document.getElementById("sortDropdownMenu");
                                                if (menu) {
                                                    menu.classList.add("hidden");
                                                }
                                            }}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex gap-8">
                    {/* Filter Sidebar */}
                    <div
                        className={`w-64 bg-white rounded-lg shadow-sm p-6 h-fit ${showFilters ? "block" : "hidden md:block"}`}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">필터</h3>
                            <button
                                onClick={resetFilters}
                                className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
                            >
                                초기화
                            </button>
                        </div>
                        {/* Price Range */}
                        <div className="mb-8">
                            <h4 className="text-sm font-medium text-gray-900 mb-4">가격대</h4>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <span>₩{priceRange[0].toLocaleString()}</span>
                                    <span>₩{priceRange[1].toLocaleString()}</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="500000"
                                    step="10000"
                                    value={priceRange[1]}
                                    onChange={(e) =>
                                        setPriceRange([priceRange[0], parseInt(e.target.value)])
                                    }
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                        </div>
                        {/* Brand Filter */}
                        <div className="mb-8">
                            <h4 className="text-sm font-medium text-gray-900 mb-4">브랜드</h4>
                            <div className="space-y-3">
                                {brands.map((brand) => (
                                    <label
                                        key={brand}
                                        className="flex items-center cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedBrands.includes(brand)}
                                            onChange={() => handleBrandChange(brand)}
                                            className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                                        />
                                        <span className="text-sm text-gray-700">{brand}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        {/* Size Filter */}
                        <div className="mb-8">
                            <h4 className="text-sm font-medium text-gray-900 mb-4">사이즈</h4>
                            <div className="grid grid-cols-3 gap-2">
                                {sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => handleSizeChange(size)}
                                        className={`px-3 py-2 text-sm !rounded-button border cursor-pointer whitespace-nowrap ${selectedSizes.includes(size)
                                            ? "bg-blue-500 text-white border-blue-500"
                                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button
                            id="applyFilterBtn"
                            onClick={() => {
                                setShowToast(true);
                                setTimeout(() => setShowToast(false), 3000);
                            }}
                            className="w-full py-3 bg-blue-500 text-white !rounded-button hover:bg-blue-600 cursor-pointer whitespace-nowrap"
                        >
                            필터 적용
                        </button>
                    </div>
                    {/* Toast Notification */}
                    <div
                        className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-opacity duration-300 ${showToast ? "opacity-100" : "opacity-0 pointer-events-none"
                            }`}
                    >
                        <div className="bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg">
                            <div className="flex items-center space-x-2">
                                <i className="fas fa-check-circle text-green-400"></i>
                                <span>필터가 성공적으로 적용되었습니다</span>
                            </div>
                        </div>
                    </div>
                    {/* Product Grid */}
                    <div className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {filteredResults
                                .slice(
                                    (currentPage - 1) * itemsPerPage,
                                    currentPage * itemsPerPage,
                                )
                                .map((product, index) => (
                                    <div
                                        key={index}
                                        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
                                    >
                                        <a
                                            href="https://readdy.ai/home/8c14b666-4886-429c-ad07-c16c2cd22c03/1a7c3882-3e81-42c2-9362-0f181f1f510e"
                                            data-readdy="true"
                                        >
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-64 object-cover object-top"
                                            />
                                        </a>
                                        <div className="p-4">
                                            <div className="text-sm text-gray-500 mb-1">
                                                {product.brand}
                                            </div>
                                            <h4 className="text-lg font-medium text-gray-900 mb-2">
                                                {product.name}
                                            </h4>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm text-gray-500">현재가</p>
                                                    <p className="text-lg font-semibold text-blue-600">
                                                        ₩{product.price}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-gray-500">
                                                        {product.bidCount}명 참여
                                                    </p>
                                                    <p className="text-sm font-medium text-red-500">
                                                        {product.timeLeft} 남음
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                        {/* Pagination */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">페이지당 표시:</span>
                                <div className="relative" id="itemsPerPageDropdown">
                                    <button
                                        id="dropdownToggle"
                                        className="flex items-center justify-between w-24 px-3 py-1 bg-white border border-gray-300 !rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        onClick={() => {
                                            const dropdown = document.getElementById("dropdownMenu");
                                            if (dropdown) {
                                                dropdown.classList.toggle("hidden");
                                            }
                                        }}
                                    >
                                        <span>{itemsPerPage}개</span>
                                        <i className="fas fa-chevron-down text-gray-400 text-xs ml-2"></i>
                                    </button>
                                    <div
                                        id="dropdownMenu"
                                        className="hidden absolute top-full left-0 mt-1 w-24 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                                    >
                                        {[12, 24, 36].map((count) => (
                                            <button
                                                key={count}
                                                className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 ${itemsPerPage === count
                                                    ? "bg-blue-50 text-blue-600"
                                                    : "text-gray-700"
                                                    }`}
                                                onClick={() => {
                                                    setItemsPerPage(count);
                                                    setCurrentPage(1);
                                                    const dropdown =
                                                        document.getElementById("dropdownMenu");
                                                    if (dropdown) {
                                                        dropdown.classList.add("hidden");
                                                    }
                                                }}
                                            >
                                                {count}개
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-2 border border-gray-300 text-gray-500 !rounded-button hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
                                >
                                    이전
                                </button>
                                {[...Array(Math.min(5, totalPages))].map((_, index) => {
                                    const pageNum =
                                        currentPage <= 3 ? index + 1 : currentPage - 2 + index;
                                    if (pageNum > totalPages) return null;
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`px-3 py-2 !rounded-button cursor-pointer whitespace-nowrap ${currentPage === pageNum
                                                ? "bg-blue-500 text-white"
                                                : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                                <button
                                    onClick={() =>
                                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                                    }
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-2 border border-gray-300 text-gray-500 !rounded-button hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
                                >
                                    다음
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Search;
