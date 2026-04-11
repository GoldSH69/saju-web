/**
 * 오행(五行) 과다/부족 해석 템플릿
 *
 * 사주 원국의 오행 분포에서 가장 많은 오행(과다)과 가장 적은/없는 오행(부족)을
 * 기반으로 성격적 특성과 조언을 제공합니다.
 *
 * 과다: 해당 오행이 3개 이상이면 과다로 판단
 * 부족: 해당 오행이 0개이면 부족(결핍)으로 판단
 */
export interface FiveElementText {
    /** 오행 영문 */
    element: string;
    /** 오행 한글 */
    elementKo: string;
    /** 과다 - 짧은 해석 (무료) */
    excessShort: string;
    /** 과다 - 상세 해석 (광고/유료) */
    excessDetail: string;
    /** 부족 - 짧은 해석 (무료) */
    lackShort: string;
    /** 부족 - 상세 해석 (광고/유료) */
    lackDetail: string;
    /** 과다 키워드 */
    excessKeywords: string[];
    /** 부족 키워드 */
    lackKeywords: string[];
}
export declare const FIVE_ELEMENT_TEXTS: Record<string, FiveElementText>;
/**
 * 오행 영문 키로 해석 조회
 */
export declare function getFiveElementText(element: string): FiveElementText | null;
/**
 * 오행 분포에서 과다/부족 해석을 자동 생성
 *
 * @param counts { wood: n, fire: n, earth: n, metal: n, water: n }
 * @param excessThreshold 과다 기준 (기본 3)
 */
export declare function analyzeFiveElementTexts(counts: Record<string, number>, excessThreshold?: number): {
    excess: {
        element: string;
        elementKo: string;
        count: number;
        short: string;
        detail: string;
    }[];
    lack: {
        element: string;
        elementKo: string;
        count: number;
        short: string;
        detail: string;
    }[];
};
//# sourceMappingURL=fiveElementTexts.d.ts.map