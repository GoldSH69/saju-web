/**
 * 십성(十星) 키워드 해석 템플릿
 *
 * 십성은 일간(나)과 다른 천간/지지의 관계를 나타냅니다.
 * 각 십성의 의미, 성격적 특성, 많을 때/없을 때 해석을 제공합니다.
 *
 * 5개 카테고리:
 *   비겁(比劫): 비견, 겁재 — 나와 같은 기운
 *   식상(食傷): 식신, 상관 — 내가 생하는 기운
 *   재성(財星): 편재, 정재 — 내가 극하는 기운
 *   관성(官星): 편관, 정관 — 나를 극하는 기운
 *   인성(印星): 편인, 정인 — 나를 생하는 기운
 */
export interface TenStarText {
    /** 십성 한글명 */
    star: string;
    /** 소속 카테고리 */
    category: string;
    /** 카테고리 한자 */
    categoryHanja: string;
    /** 상징 키워드 */
    symbol: string;
    /** 짧은 해석 (무료 - 1~2줄) */
    short: string;
    /** 상세 해석 (광고/유료) */
    detail: string;
    /** 많을 때 (3개 이상) */
    excess: string;
    /** 없을 때 (0개) */
    lack: string;
    /** 키워드 태그 */
    keywords: string[];
}
export declare const TEN_STAR_TEXTS: Record<string, TenStarText>;
/**
 * 십성 한글명으로 해석 조회
 */
export declare function getTenStarText(star: string): TenStarText | null;
/**
 * 십성 분포에서 과다/부족 해석을 자동 생성
 *
 * @param starCount Record<TenStar, number> — 십성별 개수
 * @param excessThreshold 과다 기준 (기본 3)
 */
export declare function analyzeTenStarTexts(starCount: Record<string, number>, excessThreshold?: number): {
    excess: {
        star: string;
        count: number;
        short: string;
        text: string;
    }[];
    lack: {
        star: string;
        count: number;
        short: string;
        text: string;
    }[];
    dominant: {
        star: string;
        count: number;
        text: TenStarText;
    } | null;
};
//# sourceMappingURL=tenStarTexts.d.ts.map