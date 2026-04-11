/**
 * 오늘의 운세 해석 템플릿 (십성별)
 *
 * 오늘의 일운(日運) 천간이 내 일간과 만들어내는 십성을 기반으로
 * 오늘 하루의 운세를 해석합니다.
 *
 * 사용: 일운의 천간 십성 (stemStar) 으로 조회
 *
 * 무료: short (1~2줄 짧은 운세)
 * 광고/유료: detail + advice + lucky
 */
export interface DailyFortuneText {
    /** 십성 한글명 */
    star: string;
    /** 오늘의 테마 */
    theme: string;
    /** 운세 등급 (1~5, 5가 최고) */
    rating: number;
    /** 운세 등급 이모지 */
    ratingEmoji: string;
    /** 짧은 운세 (무료 - 1~2줄) */
    short: string;
    /** 상세 운세 (광고/유료) */
    detail: string;
    /** 오늘의 조언 */
    advice: string;
    /** 행운 포인트 */
    lucky: {
        color: string;
        direction: string;
        number: string;
        time: string;
    };
    /** 주의사항 */
    caution: string;
}
export declare const DAILY_FORTUNE_TEXTS: Record<string, DailyFortuneText>;
/**
 * 십성 한글명으로 오늘의 운세 조회
 */
export declare function getDailyFortuneText(star: string): DailyFortuneText | null;
//# sourceMappingURL=dailyFortuneTexts.d.ts.map