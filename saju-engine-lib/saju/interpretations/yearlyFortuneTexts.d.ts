/**
 * 올해의 운세 해석 템플릿 (십성별)
 *
 * 세운(歲運) 천간이 내 일간과 만들어내는 십성을 기반으로
 * 올해의 운세를 해석합니다.
 *
 * 무료: short (1~2줄)
 * 광고/유료: detail + advice + outlook
 */
export interface YearlyFortuneText {
    star: string;
    theme: string;
    rating: number;
    ratingEmoji: string;
    short: string;
    detail: string;
    advice: string;
    /** 올해의 분야별 전망 */
    outlook: {
        career: string;
        relationship: string;
        health: string;
        wealth: string;
    };
    /** 올해의 키워드 3개 */
    keywords: [string, string, string];
    caution: string;
}
export declare const YEARLY_FORTUNE_TEXTS: Record<string, YearlyFortuneText>;
export declare function getYearlyFortuneText(star: string): YearlyFortuneText | null;
//# sourceMappingURL=yearlyFortuneTexts.d.ts.map