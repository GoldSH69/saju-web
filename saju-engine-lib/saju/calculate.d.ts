/**
 * calculate.ts - 사주 전체 통합 계산 엔트리 함수
 *
 * 양력 생년월일시 입력 → 4주 + 지장간 + 오행 + 십성 + 신강/신약 + 용신 + 대운 통합 계산
 * 모든 모듈을 연결하는 최종 엔트리
 */
import { Pillar, TenStarResult, TimeAdjustmentResult } from './types';
import { HiddenStemEntry } from './hiddenStems';
import { DaewoonResult } from './daewoon';
import { YearlyFortuneResult, MonthlyFortuneResult, DailyFortuneResult } from './fortune';
import { YongsinResult, YongsinMethod } from './yongsin';
import { GongmangAnalysis } from './gongmang';
import { GwiinAnalysis } from './gwiin';
export interface CalculateInput {
    year: number;
    month: number;
    day: number;
    hour?: number | null;
    minute?: number | null;
    gender?: 'male' | 'female';
    timeOption?: 'standard30' | 'trueSolar' | 'none';
    daewoonCount?: number;
    yongsinMethod?: YongsinMethod;
    includeSpecialPattern?: boolean;
    fortuneTargetYear?: number;
    fortuneTargetMonth?: number;
    fortuneTargetDay?: number;
}
export interface HiddenStemsResult {
    year: HiddenStemEntry[];
    month: HiddenStemEntry[];
    day: HiddenStemEntry[];
    hour: HiddenStemEntry[] | null;
}
export interface FortuneResult {
    yearly?: YearlyFortuneResult;
    monthly?: MonthlyFortuneResult;
    daily?: DailyFortuneResult;
}
export interface CalculateResult {
    input: {
        year: number;
        month: number;
        day: number;
        hour: number | null;
        minute: number | null;
        gender: 'male' | 'female';
        timeOption: 'standard30' | 'trueSolar' | 'none';
        birthTimeUnknown: boolean;
    };
    adjustedTime: TimeAdjustmentResult | null;
    effectiveDate: {
        year: number;
        month: number;
        day: number;
    };
    fourPillars: {
        year: Pillar;
        month: Pillar;
        day: Pillar;
        hour: Pillar | null;
    };
    dayStem: {
        char: string;
        name: string;
        element: string;
        elementKo: string;
        yinYang: string;
        yinYangKo: string;
    };
    hiddenStems: HiddenStemsResult;
    fiveElements: any;
    tenStars: TenStarResult;
    strength: any;
    yongsin: YongsinResult;
    daewoon: DaewoonResult | null;
    fortune: FortuneResult | null;
    gongmang: GongmangAnalysis | null;
    gwiin: GwiinAnalysis | null;
    monthSolarTerm: {
        name: string;
        dateTime: string;
    };
    meta: {
        calculatedAt: string;
        engineVersion: string;
        warnings: string[];
    };
}
export declare function calculateSaju(input: CalculateInput): CalculateResult;
export declare function formatSajuResult(result: CalculateResult): string;
export declare function toResultJson(result: CalculateResult): object;
//# sourceMappingURL=calculate.d.ts.map