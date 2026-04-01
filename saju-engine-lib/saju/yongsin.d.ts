/**
 * yongsin.ts - 용신(用神) 판단 모듈
 *
 * 용신 = 사주의 균형을 맞추기 위해 가장 필요한 오행
 *
 * 5신 체계:
 *   용신(用神) - 가장 필요한 오행
 *   희신(喜神) - 용신을 돕는 오행
 *   기신(忌神) - 용신을 방해하는 오행
 *   구신(仇神) - 기신을 돕는 오행
 *   한신(閑神) - 크게 영향 없는 오행
 *
 * 판단 방법:
 *   ① 억부용신 - 신강/신약에 따라 필요한 오행
 *   ② 조후용신 - 계절(생월)에 따라 필요한 오행
 *   ③ combined - 억부 + 조후 종합 판단 (기본값)
 */
export type FiveElement = 'wood' | 'fire' | 'earth' | 'metal' | 'water';
export type YongsinMethod = 'eokbu' | 'johu' | 'combined';
export type DetailLevel = 'simple' | 'full';
export interface YongsinOptions {
    method?: YongsinMethod;
    includeSpecialPattern?: boolean;
    detailLevel?: DetailLevel;
}
export type SinRole = '용신' | '희신' | '기신' | '구신' | '한신';
export interface ElementRole {
    element: FiveElement;
    elementKo: string;
    role: SinRole;
    reason: string;
    score: number;
}
export type PatternType = 'normal' | 'jonggang' | 'jongjae' | 'jongsal' | 'jonga';
export interface SpecialPatternResult {
    isSpecial: boolean;
    patternType: PatternType;
    patternName: string;
    description: string;
}
interface CombinedScore {
    element: FiveElement;
    eokbuScore: number;
    johuScore: number;
    totalScore: number;
}
export interface YongsinResult {
    /** 최종 용신 오행 */
    yongsin: FiveElement;
    yongsinKo: string;
    /** 5신 배정 */
    fiveSin: ElementRole[];
    /** 억부용신 결과 */
    eokbu: {
        yongsin: FiveElement;
        yongsinKo: string;
        heeshin: FiveElement;
        gishin: FiveElement;
        reason: string;
    };
    /** 조후용신 결과 */
    johu: {
        primary: FiveElement;
        primaryKo: string;
        secondary: FiveElement;
        secondaryKo: string;
        season: string;
        reason: string;
    };
    /** 종합 점수 (combined 모드일 때) */
    combinedScores?: CombinedScore[];
    /** 특수격국 (옵션 활성화 시) */
    specialPattern?: SpecialPatternResult;
    /** 판단 방법 */
    method: YongsinMethod;
    /** 종합 판단 근거 */
    reason: string;
    /** 실용 가이드 */
    guide: {
        favorableElements: string[];
        unfavorableElements: string[];
        favorableColors: string[];
        favorableDirections: string[];
        favorableSeasons: string[];
    };
}
/**
 * 용신을 계산합니다.
 *
 * @param dayStemIndex     일간 인덱스 (0~9)
 * @param monthBranchIndex 월지 인덱스 (0~11) - 조후용신에 사용
 * @param strengthResult   신강/신약 판단 결과
 * @param strengthLevel    신강/신약 점수 (-100~100)
 * @param helpScore        돕는 세력 점수
 * @param restrainScore    억제 세력 점수
 * @param options          옵션
 */
export declare function calculateYongsin(dayStemIndex: number, monthBranchIndex: number, strengthResult: 'strong' | 'weak' | 'neutral', strengthLevel: number, helpScore: number, restrainScore: number, options?: YongsinOptions): YongsinResult;
export declare function formatYongsin(result: YongsinResult): string;
export {};
//# sourceMappingURL=yongsin.d.ts.map