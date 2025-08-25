
import React, { useState } from "react";
import InfoBanner from "../components/InfoBanner";
import AmountSelector from "../components/AmountSelector";
import PaymentMethodList from "../components/PaymentMethodList";
import SummaryCard from "../components/SummaryCard";
import SecurityInfo from "../components/SecurityInfo";
import AdditionalInfo from "../components/AdditionalInfo";
import { PRESET_AMOUNTS, CURRENT_POINTS, formatNumber } from "../constants/presets";
import type { PaymentId, RegisteredPayments } from "../types";
import { startPortoneCharge } from "../services/portoneService";

const ChargePointsPage: React.FC = () => {
    // 금액/입력
    const [selectedAmount, setSelectedAmount] = useState<number>(0);
    const [customAmount, setCustomAmount] = useState<string>("");
    const [showCustomInput, setShowCustomInput] = useState<boolean>(false);

    // 결제 선택
    const [selectedPayment, setSelectedPayment] = useState<PaymentId | "">("");
    const [selectedCard, setSelectedCard] = useState<number | null>(null);
    const [selectedAccount, setSelectedAccount] = useState<number | null>(null);

    // (선택) 기타
    const [cashReceiptPhone] = useState<string>("");

    // 등록된 간편 결제 (mock)
    const [registeredPayments] = useState<RegisteredPayments>({ cards: [], accounts: [] });

    const handleAmountSelect = (amount: number) => {
        setSelectedAmount(amount);
        setShowCustomInput(false);
        setCustomAmount("");
    };

    const handleCustomAmountChange = (value: string) => {
        const numValue = parseInt(value.replace(/[^0-9]/g, ""), 10);
        if (!Number.isNaN(numValue)) {
            setSelectedAmount(numValue);
            setCustomAmount(value);
        } else {
            setSelectedAmount(0);
            setCustomAmount("");
        }
    };

    // bank(vbank) 제거됨: quickBank → 'trans', 나머지 → 'card'
    const toPayMethod = (p: PaymentId | ""): "card" | "trans" => {
        if (p === "quickBank") return "trans";
        return "card";
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-300">
            <div className="max-w-4xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-900">포인트 충전</h1>
                        <div className="flex items-center space-x-2">
                            <i className="fas fa-coins text-yellow-500" />
                            <span className="text-sm text-gray-600">현재 보유 포인트</span>
                            <span className="text-lg font-semibold text-blue-600">
                {formatNumber(CURRENT_POINTS)}P
              </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="max-w-4xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main */}
                    <div className="lg:col-span-2 space-y-8">
                        <InfoBanner />

                        <AmountSelector
                            presets={PRESET_AMOUNTS}
                            selectedAmount={selectedAmount}
                            showCustomInput={showCustomInput}
                            customAmount={customAmount}
                            onSelectAmount={handleAmountSelect}
                            onShowCustom={() => {
                                setShowCustomInput(true);
                                setSelectedAmount(0);
                            }}
                            onCustomChange={handleCustomAmountChange}
                        />

                        <PaymentMethodList
                            selectedPayment={selectedPayment}
                            setSelectedPayment={(v) => setSelectedPayment(v)}
                            registeredPayments={registeredPayments}
                            setSelectedCard={setSelectedCard}
                            setSelectedAccount={setSelectedAccount}
                        />
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6 sticky top-6">
                        <SummaryCard
                            selectedAmount={selectedAmount}
                            selectedPayment={selectedPayment}
                            onSubmit={async () => {
                                try {
                                    if (selectedAmount <= 0) return;
                                    await startPortoneCharge({
                                        amount: selectedAmount,
                                        payMethod: toPayMethod(selectedPayment),
                                        buyer: {
                                            email: "test@example.com",
                                            name: "홍길동",
                                            tel: "010-1234-5678",
                                        },
                                    });
                                    // TODO: 성공 후 라우팅 등
                                    console.log("submit", {
                                        selectedAmount,
                                        selectedPayment,
                                        selectedCard,
                                        selectedAccount,
                                        cashReceiptPhone,
                                    });
                                } catch (e) {
                                    console.error(e);
                                }
                            }}
                        />
                        <SecurityInfo />
                    </div>
                </div>

                <AdditionalInfo />
            </div>
        </div>
    );
};

export default ChargePointsPage;
