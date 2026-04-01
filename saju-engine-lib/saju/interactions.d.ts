/**
 * interactions.ts - 충합형해(沖合刑害) 공통 모듈
 *
 * 천간합, 지지충, 육합, 삼합, 방합, 형, 해 데이터와 분석 로직
 * → daewoon.ts, fortune.ts에서 공통 사용
 *
 * 추가로 십성(十星) 판단 함수도 포함 (대운/세운/월운/일운 공통)
 */
import { Pillar, TenStar, TenStarCategory } from './types';
/** 천간합 정보 */
export interface StemCombination {
    stem1: string;
    stem2: string;
    resultElement: string;
    resultElementKo: string;
}
/** 지지충 정보 */
export interface BranchClash {
    branch1: string;
    branch2: string;
    type: string;
}
/** 지지합 정보 */
export interface BranchCombine {
    branch1: string;
    branch2: string;
    type: string;
    resultElement: string;
    resultElementKo: string;
}
/** 지지형 정보 */
export interface BranchPunishment {
    branch1: string;
    branch2: string;
    type: string;
    typeName: string;
}
/** 지지해 정보 */
export interface BranchHarm {
    branch1: string;
    branch2: string;
}
/** 충합형해 분석 결과 */
export interface InteractionResult {
    stemCombinations: StemCombination[];
    branchClashes: BranchClash[];
    branchCombines: BranchCombine[];
    branchPunishments: BranchPunishment[];
    branchHarms: BranchHarm[];
    summary: string[];
}
/** 운(대운/세운/월운/일운) 공통 십성 정보 */
export interface FortuneTenStar {
    stemStar: TenStar;
    stemCategory: TenStarCategory;
    branchMainStar: TenStar;
    branchMainCategory: TenStarCategory;
}
/** 천간합 (5쌍) */
export declare const STEM_COMBINATIONS_DATA: {
    stems: [number, number];
    element: string;
}[];
/** 지지충 (6쌍) */
export declare const BRANCH_CLASHES_DATA: [number, number][];
/** 지지육합 (6쌍) */
export declare const BRANCH_SIX_COMBINES_DATA: {
    branches: [number, number];
    element: string;
}[];
/** 지지삼합 (4조) */
export declare const BRANCH_THREE_COMBINES_DATA: {
    branches: [number, number, number];
    element: string;
}[];
/** 지지방합 (4조) */
export declare const BRANCH_DIRECTION_COMBINES_DATA: {
    branches: [number, number, number];
    element: string;
}[];
/** 지지형 */
export declare const BRANCH_PUNISHMENTS_DATA: {
    branches: number[];
    type: string;
    typeName: string;
}[];
/** 지지해 (6쌍) */
export declare const BRANCH_HARMS_DATA: [number, number][];
/**
 * 일간(me) 기준으로 대상 천간(target)의 십성을 판단합니다.
 *
 * @param dayStemIndex    일간 인덱스 (0~9)
 * @param targetStemIndex 대상 천간 인덱스 (0~9)
 * @returns { star, category }
 */
export declare function getInteractionTenStar(dayStemIndex: number, targetStemIndex: number): {
    star: TenStar;
    category: TenStarCategory;
};
/**
 * 특정 간지(운)와 원국 4주 사이의 충합형해를 분석합니다.
 *
 * @param targetStemIndex   운의 천간 인덱스
 * @param targetBranchIndex 운의 지지 인덱스
 * @param fourPillars       원국 4주
 * @param targetLabel       라벨 (예: '대운', '세운', '월운', '일운')
 * @returns InteractionResult
 */
export declare function analyzeInteractions(targetStemIndex: number, targetBranchIndex: number, fourPillars: {
    year: Pillar;
    month: Pillar;
    day: Pillar;
    hour: Pillar | null;
}, targetLabel?: string): InteractionResult;
//# sourceMappingURL=interactions.d.ts.map