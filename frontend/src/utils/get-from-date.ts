const periodActions: Record<string, (date: Date) => Date> = {
    "최근 1개월": (date) => new Date(date.getFullYear(), date.getMonth() - 1, date.getDate()),
    "최근 3개월": (date) => new Date(date.getFullYear(), date.getMonth() - 3, date.getDate()),
    "최근 6개월": (date) => new Date(date.getFullYear(), date.getMonth() - 6, date.getDate()),
    "최근 1년": (date) => new Date(date.getFullYear() - 1, date.getMonth(), date.getDate()),
};

export const getFromDate = (period: string): Date | null => {
    if (period === "전체") {
        return null;
    }
    const action = periodActions[period];
    return action ? action(new Date()) : null;
};