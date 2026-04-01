/**
 * fortune.ts - 세운(歲運) / 월운(月運) / 일운(日運) 계산 모듈
 *
 * 세운: 특정 연도의 간지 → 원국과의 상호작용
 * 월운: 특정 월의 간지 → 원국과의 상호작용
 * 일운: 특정 일의 간지 → 원국과의 상호작용
 *
 * 충합형해 로직은 interactions.ts 공통 모듈 사용
 */
import { Pillar, StemInfo, BranchInfo } from './types';
import { HiddenStemEntry } from './hiddenStems';
import { InteractionResult, FortuneTenStar } from './interactions';
export type { InteractionResult, FortuneTenStar };
export type DaewoonTenStar = FortuneTenStar;
/** 공통 운세 항목 */
export interface FortuneEntry {
    stemIndex: number;
    branchIndex: number;
    stem: StemInfo;
    branch: BranchInfo;
    ganjiChar: string;
    ganjiName: string;
    hiddenStems: HiddenStemEntry[];
    tenStar: FortuneTenStar;
    interactions: InteractionResult;
}
/** 세운 결과 */
export interface YearlyFortuneResult {
    targetYear: number;
    fortune: FortuneEntry;
    currentDaewoon?: {
        ganjiChar: string;
        startAge: number;
        endAge: number;
    };
}
/** 월운 결과 */
export interface MonthlyFortuneResult {
    targetYear: number;
    targetMonth: number;
    fortune: FortuneEntry;
    solarTermName: string;
    solarTermDateTime: string;
}
/** 일운 결과 */
export interface DailyFortuneResult {
    targetYear: number;
    targetMonth: number;
    targetDay: number;
    fortune: FortuneEntry;
}
/** 기간 세운 (여러 해) */
export interface YearlyFortuneRangeResult {
    startYear: number;
    endYear: number;
    fortunes: YearlyFortuneResult[];
}
/** 기간 월운 (여러 달) */
export interface MonthlyFortuneRangeResult {
    targetYear: number;
    fortunes: MonthlyFortuneResult[];
}
/**
 * 특정 연도의 세운을 계산합니다.
 */
export declare function calculateYearlyFortune(targetYear: number, dayStemIndex: number, fourPillars: {
    year: Pillar;
    month: Pillar;
    day: Pillar;
    hour: Pillar | null;
}): YearlyFortuneResult;
/**
 * 기간 세운을 계산합니다 (여러 해).
 */
export declare function calculateYearlyFortuneRange(startYear: number, endYear: number, dayStemIndex: number, fourPillars: {
    year: Pillar;
    month: Pillar;
    day: Pillar;
    hour: Pillar | null;
}): YearlyFortuneRangeResult;
/**
 * 특정 연월의 월운을 계산합니다.
 */
export declare function calculateMonthlyFortune(targetYear: number, targetMonth: number, dayStemIndex: number, fourPillars: {
    year: Pillar;
    month: Pillar;
    day: Pillar;
    hour: Pillar | null;
}): MonthlyFortuneResult;
/**
 * 특정 연도의 12개월 월운을 계산합니다.
 */
export declare function calculateMonthlyFortuneRange(targetYear: number, dayStemIndex: number, fourPillars: {
    year: Pillar;
    month: Pillar;
    day: Pillar;
    hour: Pillar | null;
}): MonthlyFortuneRangeResult;
/**
 * 특정 날짜의 일운을 계산합니다.
 */
export declare function calculateDailyFortune(targetYear: number, targetMonth: number, targetDay: number, dayStemIndex: number, fourPillars: {
    year: Pillar;
    month: Pillar;
    day: Pillar;
    hour: Pillar | null;
}): DailyFortuneResult;
/**
 * 특정 기간의 일운을 계산합니다 (날짜 범위).
 */
export declare function calculateDailyFortuneRange(startYear: number, startMonth: number, startDay: number, days: number, dayStemIndex: number, fourPillars: {
    year: Pillar;
    month: Pillar;
    day: Pillar;
    hour: Pillar | null;
}): DailyFortuneResult[];
export declare function formatYearlyFortune(result: YearlyFortuneResult): string;
export declare function formatMonthlyFortune(result: MonthlyFortuneResult): string;
export declare function formatDailyFortune(result: DailyFortuneResult): string;
/** 세운 범위 표 출력 */
export declare function formatYearlyFortuneRange(result: YearlyFortuneRangeResult, dayStemChar: string): string;
/** 월운 범위 표 출력 */
export declare function formatMonthlyFortuneRange(result: MonthlyFortuneRangeResult, dayStemChar: string): string;
//# sourceMappingURL=fortune.d.ts.map