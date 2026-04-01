import { TenStar, TenStarCategory } from './tenStars';
export interface StrengthDetail {
    position: string;
    stem: string;
    stemName: string;
    tenStar: TenStar;
    category: TenStarCategory;
    isSupporting: boolean;
    weight: number;
    score: number;
}
export interface StrengthResult {
    /** 일간 정보 */
    dayStem: string;
    dayStemName: string;
    dayElement: string;
    dayElementKo: string;
    /** 득령 판단 */
    deukryeong: boolean;
    monthBranch: string;
    monthMainStem: string;
    monthMainElement: string;
    /** 점수 */
    supportScore: number;
    restrainScore: number;
    totalScore: number;
    /** 판정 */
    strength: '신강' | '신약' | '중화';
    strengthLevel: number;
    /** 상세 내역 */
    details: StrengthDetail[];
    /** 요약 */
    summary: string;
}
export declare function calculateStrength(yearStem: string, monthStem: string, dayStem: string, hourStem: string | null, yearBranch: string, monthBranch: string, dayBranch: string, hourBranch: string | null): StrengthResult;
//# sourceMappingURL=strengthScore.d.ts.map