import { BADGE_COLOR } from "../constants/styles.constants";

export const getBadgeClass = (color: string) => {
    const baseClass = "px-3 py-1 rounded-full text-sm font-medium";
    const variantClass = BADGE_COLOR[color] || BADGE_COLOR.default
    return `${baseClass} ${variantClass}`
};
