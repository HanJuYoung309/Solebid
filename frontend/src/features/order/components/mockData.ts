export const periods = [
    "전체",
    "최근 1개월",
    "최근 3개월",
    "최근 6개월",
    "최근 1년",
];

export const statuses = [
    "전체",
    "결제완료",
    "배송준비중",
    "배송중",
    "배송완료",
    "취소·반품",
];

export const orders = [
    {
        id: "ORD-2024-001234",
        date: "2024.01.15",
        items: [
            {
                name: "무선 블루투스 헤드폰",
                image:
                    "https://readdy.ai/api/search-image?query=modern%20wireless%20bluetooth%20headphones%20black%20color%20clean%20white%20background%20product%20photography%20professional%20lighting%20high%20quality&width=80&height=80&seq=order001&orientation=squarish",
                quantity: 1,
                price: 89000,
            },
        ],
        totalAmount: 89000,
        status: "배송완료",
        statusColor: "green",
        trackingNumber: "CJ1234567890",
        deliveryAddress: "서울특별시 강남구 테헤란로 123 ABC빌딩 456호",
    },
    {
        id: "ORD-2024-001233",
        date: "2024.01.12",
        items: [
            {
                name: "프리미엄 원두 커피",
                image:
                    "https://readdy.ai/api/search-image?query=premium%20coffee%20beans%20package%20bag%20dark%20roast%20clean%20white%20background%20product%20photography%20professional%20lighting%20high%20quality&width=80&height=80&seq=order002&orientation=squarish",
                quantity: 2,
                price: 25000,
            },
        ],
        totalAmount: 50000,
        status: "배송중",
        statusColor: "blue",
        trackingNumber: "CJ0987654321",
        deliveryAddress: "서울특별시 강남구 테헤란로 123 ABC빌딩 456호",
    },
    {
        id: "ORD-2024-001232",
        date: "2024.01.10",
        items: [
            {
                name: "스마트폰 케이스",
                image:
                    "https://readdy.ai/api/search-image?query=modern%20smartphone%20case%20clear%20transparent%20design%20clean%20white%20background%20product%20photography%20professional%20lighting%20high%20quality&width=80&height=80&seq=order003&orientation=squarish",
                quantity: 1,
                price: 15000,
            },
            {
                name: "무선 충전기",
                image:
                    "https://readdy.ai/api/search-image?query=wireless%20charging%20pad%20modern%20design%20black%20color%20clean%20white%20background%20product%20photography%20professional%20lighting%20high%20quality&width=80&height=80&seq=order004&orientation=squarish",
                quantity: 1,
                price: 35000,
            },
        ],
        totalAmount: 50000,
        status: "배송완료",
        statusColor: "green",
        trackingNumber: "CJ1122334455",
        deliveryAddress: "서울특별시 강남구 테헤란로 123 ABC빌딩 456호",
    },
    {
        id: "ORD-2024-001231",
        date: "2024.01.08",
        items: [
            {
                name: "럭셔리 시계",
                image:
                    "https://readdy.ai/api/search-image?query=elegant%20watch%20luxury%20timepiece%20silver%20metal%20band%20clean%20white%20background%20product%20photography%20professional%20lighting%20high%20quality&width=80&height=80&seq=order005&orientation=squarish",
                quantity: 1,
                price: 299000,
            },
        ],
        totalAmount: 299000,
        status: "배송준비중",
        statusColor: "yellow",
        trackingNumber: "",
        deliveryAddress: "서울특별시 강남구 테헤란로 123 ABC빌딩 456호",
    },
    {
        id: "ORD-2024-001230",
        date: "2024.01.05",
        items: [
            {
                name: "노트북",
                image:
                    "https://readdy.ai/api/search-image?query=modern%20laptop%20computer%20silver%20aluminum%20design%20clean%20white%20background%20product%20photography%20professional%20lighting%20high%20quality&width=80&height=80&seq=order006&orientation=squarish",
                quantity: 1,
                price: 1299000,
            },
        ],
        totalAmount: 1299000,
        status: "취소·반품",
        statusColor: "red",
        trackingNumber: "",
        deliveryAddress: "서울특별시 강남구 테헤란로 123 ABC빌딩 456호",
    },
];
