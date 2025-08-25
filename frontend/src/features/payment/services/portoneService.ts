import { API_HOST, PORTONE_MERCHANT_ID, PORTONE_SDK_URL } from "../constants/portone";

/** window.IMP 타입 보완 */
declare global {
    interface Window {
        IMP: any;
    }
}

/** SDK 동적 로딩 (index.html 수정 불필요) */
async function loadPortoneSDK(): Promise<any> {
    if (window.IMP) return window.IMP;

    await new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = PORTONE_SDK_URL;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("PortOne SDK 로드 실패"));
        document.head.appendChild(script);
    });

    return window.IMP;
}

type PayMethod = "card" | "trans" | "vbank";

/** 포인트 충전 - 포트원 플로우 한 번에 실행 */
export async function startPortoneCharge(params: {
    amount: number;
    payMethod?: PayMethod; // default: card
    redirectUrl?: string;
    buyer?: { email?: string; name?: string; tel?: string };
    pg?: string; // default: html5_inicis
}): Promise<void> {
    const {
        amount,
        payMethod = "card",
        redirectUrl = window.location.origin + "/result",
        buyer = {},
        pg = "html5_inicis",
    } = params;

    const IMP = await loadPortoneSDK();
    IMP.init(PORTONE_MERCHANT_ID);

    // 1) 서버 준비(주문번호 발급)
    const prepareRes = await fetch(`${API_HOST}/api/payments/charge/prepare`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            amount,
            paymentMethod: payMethod.toUpperCase(), // CARD / TRANS / VBANK
            redirectUrl,
        }),
    });

    if (!prepareRes.ok) {
        const text = await prepareRes.text();
        throw new Error("prepare 실패: " + text);
    }
    const { orderId } = await prepareRes.json();

    // 2) 포트원 결제창
    await new Promise<void>((resolve, reject) => {
        IMP.request_pay(
            {
                pg,
                pay_method: payMethod, // 'card' | 'trans' | 'vbank'
                merchant_uid: orderId,
                name: "포인트 충전",
                amount,
                buyer_email: buyer.email ?? "test@example.com",
                buyer_name: buyer.name ?? "홍길동",
                buyer_tel: buyer.tel ?? "010-0000-0000",
            },
            async (rsp: any) => {
                if (!rsp.success) {
                    alert("결제 실패: " + rsp.error_msg);
                    reject(new Error(rsp.error_msg));
                    return;
                }

                // 3) 승인(검증)
                try {
                    const approveRes = await fetch(
                        `${API_HOST}/api/portone/approve?impUid=${encodeURIComponent(
                            rsp.imp_uid
                        )}`
                    );
                    const text = await approveRes.text();
                    if (!approveRes.ok) throw new Error("approve 실패: " + text);

                    alert("서버 응답: " + text);
                    resolve();
                } catch (e: any) {
                    alert("승인 요청 중 오류: " + e.message);
                    reject(e);
                }
            }
        );
    });
}
