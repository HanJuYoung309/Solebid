export interface ProfileOrderProps {
    id: number;
    name: string;
    date: string;
    price: string;
    status: '배송완료' | '배송중';
    imageUrl: string;
}