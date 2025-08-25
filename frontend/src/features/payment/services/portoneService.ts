// src/features/payment/services/portoneService.ts
import { api, PORTONE_MERCHANT_ID, PORTONE_SDK_URL } from "../constants/portone";
import type {
    PortOneIMP,
    PortOnePayMethod,
    PortOnePayResponse,
} from "../constants/portone";

/* ---------- type guards (unknown → 구체 타입으로 내로잉) ---------- */
function isRecord(v: unknown): v is Record<string, unknown> {
    return typeof v === "object" && v !== null;
}
function hasString(r: Record<string, unknown>, k: string): r is Record<string, string> {
    return typeof r[k] === "string";
}
function isPortOneIMP(v: unknown): v is PortOneIMP {
    return isRecord(v)
        && typeof (v as Record<string, unknown>).init === "function"
        && typeof (v as Record<string, unknown>).request_pay === "function";
}
function isPortOnePayResponse(v: unknown): v is PortOnePayResponse {
    if (!isRecord(v)) return false;
    const success = v["success"];
    const imp_uid = v["imp_uid"];
    const merchant_uid = v["merchant_uid"];
    const error_msg = v["error_msg"];
    return typeof success === "boolean"
        && (imp_uid === undefined || typeof imp_uid === "string")
        && (merchant_uid === undefined || typeof merchant_uid === "string")
        && (error_msg === undefined || typeof error_msg === "string");
}
function getErrorMessage(err: unknown): string {
    return err instanceof Error ? err.message : String(err);
}

/* ---------- SDK 로딩 ---------- */
async function loadPortoneSDK(): Promise<PortOneIMP> {
    if (isPortOneIMP((window as unknown as { IMP?: unknown }).IMP)) {
        return (window as { IMP: PortOneIMP }).IMP;
    }
    await new Promise<void>((resolve, reject) => {
        const s = document.createElement("script");
        s.src = PORTONE_SDK_URL;
        s.async = true;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error("PortOne SDK 로드 실패"));
        document.head.appendChild(s);
    });

    const impUnknown: unknown = (window as unknown as { IMP?: unknown }).IMP;
    if (!isPortOneIMP(impUnknown)) {
        throw new Error("PortOne SDK 로드 실패(IMP 미탑재)");
    }
    return impUnknown;
}

type PayMethod = PortOnePayMethod;

/* ---------- 메인 함수 ---------- */
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

    if (!PORTONE_MERCHANT_ID) {
        throw new Error("VITE_PORTONE_IMP_KEY가 설정되지 않았습니다.");
    }

    const IMP = await loadPortoneSDK();
    IMP.init(PORTONE_MERCHANT_ID);

    // 1) 주문 준비 (서버 응답 JSON → unknown → 타입가드)
    const prepareRes = await fetch(api("/api/payments/charge/prepare"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            amount,
            paymentMethod: payMethod.toUpperCase(), // CARD / TRANS / VBANK
            redirectUrl,
        }),
    });
    if (!prepareRes.ok) {
        throw new Error("prepare 실패: " + (await prepareRes.text()));
    }
    const jsonUnknown: unknown = await prepareRes.json();
    if (!isRecord(jsonUnknown) || !hasString(jsonUnknown, "orderId")) {
        throw new Error("prepare 응답 형식 오류");
    }
    const orderId = (jsonUnknown as Record<string, string>).orderId;

    // 2) 포트원 결제창 (콜백 rsp: unknown → 타입가드)
    await new Promise<void>((resolve, reject) => {
        IMP.request_pay(
            {
                pg,
                pay_method: payMethod,
                merchant_uid: orderId,
                name: "포인트 충전",
                amount,
                buyer_email: buyer.email ?? "test@example.com",
                buyer_name: buyer.name ?? "홍길동",
                buyer_tel: buyer.tel ?? "010-0000-0000",
            },
            async (rspUnknown: unknown) => {
                if (!isPortOnePayResponse(rspUnknown)) {
                    const msg = "결제 콜백 응답 형식 오류";
                    alert(msg);
                    reject(new Error(msg));
                    return;
                }
                const rsp = rspUnknown;

                if (!rsp.success) {
                    const msg = rsp.error_msg ?? "결제 실패";
                    alert("결제 실패: " + msg);
                    reject(new Error(msg));
                    return;
                }

                try {
                    const approveRes = await fetch(
                        api(`/api/portone/approve?impUid=${encodeURIComponent(rsp.imp_uid ?? "")}`)
                    );
                    const text = await approveRes.text();
                    if (!approveRes.ok) throw new Error("approve 실패: " + text);
                    alert("서버 응답: " + text);
                    resolve();
                } catch (e: unknown) {
                    const msg = getErrorMessage(e);
                    alert("승인 요청 중 오류: " + msg);
                    reject(new Error(msg));
                }
            }
        );
    });
}
