/**
 * 신강/신약/중화 해석 템플릿
 *
 * 일간의 힘(강약)에 따른 성격적 특성과 인생 방향을 해석합니다.
 * strengthScore.ts의 결과(신강/신약/중화)를 기반으로 조회합니다.
 *
 * 사용: strength.result ('신강' | '신약' | '중화') 로 조회
 */
export interface StrengthText {
    /** 판단 결과 한글 */
    result: string;
    /** 영문 키 */
    key: string;
    /** 상징 */
    symbol: string;
    /** 짧은 해석 (무료 - 1~2줄) */
    short: string;
    /** 상세 해석 (광고/유료) */
    detail: string;
    /** 직업 적성 */
    career: string;
    /** 대인관계 */
    relationship: string;
    /** 재물운 */
    wealth: string;
    /** 건강 */
    health: string;
    /** 핵심 조언 */
    advice: string;
    /** 키워드 태그 */
    keywords: string[];
}
export declare const STRENGTH_TEXTS: Record<string, StrengthText>;
/**
 * 신강/신약/중화 한글명으로 해석 조회
 */
export declare function getStrengthText(result: string): StrengthText | null;
//# sourceMappingURL=strengthTexts.d.ts.map