/**
 * 일간(日干) 성격 해석 템플릿
 *
 * 일간은 "나 자신"을 의미합니다.
 * 10개 천간 각각의 성격 특성을 짧은 해석 + 상세 해석으로 제공합니다.
 *
 * 사용: dayStem.char (甲~癸) 로 조회
 */
export interface DayStemText {
    /** 천간 한자 */
    char: string;
    /** 천간 한글 */
    name: string;
    /** 오행 한글 */
    elementKo: string;
    /** 음양 한글 */
    yinYangKo: string;
    /** 상징 키워드 */
    symbol: string;
    /** 짧은 해석 (무료 - 1~2줄) */
    short: string;
    /** 상세 해석 (광고/유료 - 성격 + 장단점 + 조언) */
    detail: string;
    /** 키워드 태그 */
    keywords: string[];
}
export declare const DAY_STEM_TEXTS: Record<string, DayStemText>;
/**
 * 일간 한자로 해석 조회
 */
export declare function getDayStemText(dayStemChar: string): DayStemText | null;
//# sourceMappingURL=dayStemTexts.d.ts.map