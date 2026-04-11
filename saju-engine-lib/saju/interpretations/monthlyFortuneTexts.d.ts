/**
 * 이번달 운세 해석 템플릿 (십성별)
 *
 * 월운(月運) 천간이 내 일간과 만들어내는 십성을 기반으로
 * 이번 달의 운세를 해석합니다.
 *
 * 무료: short (1~2줄)
 * 광고/유료: detail + advice + focus
 */
export interface MonthlyFortuneText {
    star: string;
    theme: string;
    rating: number;
    ratingEmoji: string;
    short: string;
    detail: string;
    advice: string;
    /** 이달의 집중 포인트 */
    focus: {
        career: string;
        relationship: string;
        health: string;
        wealth: string;
    };
    caution: string;
}
export declare const MONTHLY_FORTUNE_TEXTS: Record<string, MonthlyFortuneText>;
export declare function getMonthlyFortuneText(star: string): MonthlyFortuneText | null;
//# sourceMappingURL=monthlyFortuneTexts.d.ts.map