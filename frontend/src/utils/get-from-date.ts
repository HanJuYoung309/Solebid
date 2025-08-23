export const getFromDate = (period: string): Date | null => {
    if (period === "전체") {
        return null;
    }
    const today = new Date();
    const fromDate = new Date(today);
    switch (period) {
        case "최근 1개월":
            fromDate.setMonth(today.getMonth() - 1);
            break;
        case "최근 3개월":
            fromDate.setMonth(today.getMonth() - 3);
            break;
        case "최근 6개월":
            fromDate.setMonth(today.getMonth() - 6);
            break;
        case "최근 1년":
            fromDate.setFullYear(today.getFullYear() - 1);
            break;
        default:
            return null;
    }
    return fromDate;
};