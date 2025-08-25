export interface CartSummaryProps {
    totalAmount: number;
    shippingFee: number;
    finalAmount: number;
    formatPrice: (price: number) => string;
}