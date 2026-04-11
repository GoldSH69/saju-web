/**
 * 해석 템플릿 통합 모듈
 *
 * 9개 개별 템플릿을 통합하여 하나의 함수로 전체 해석을 생성합니다.
 *
 * 사용:
 *   import { generateInterpretation } from './interpretations'
 *   const interp = generateInterpretation(calculateResult)
 */
export { DAY_STEM_TEXTS, getDayStemText } from './dayStemTexts';
export type { DayStemText } from './dayStemTexts';
export { FIVE_ELEMENT_TEXTS, getFiveElementText, analyzeFiveElementTexts } from './fiveElementTexts';
export type { FiveElementText } from './fiveElementTexts';
export { TEN_STAR_TEXTS, getTenStarText, analyzeTenStarTexts } from './tenStarTexts';
export type { TenStarText } from './tenStarTexts';
export { STRENGTH_TEXTS, getStrengthText } from './strengthTexts';
export type { StrengthText } from './strengthTexts';
export { DAILY_FORTUNE_TEXTS, getDailyFortuneText } from './dailyFortuneTexts';
export type { DailyFortuneText } from './dailyFortuneTexts';
export { MONTHLY_FORTUNE_TEXTS, getMonthlyFortuneText } from './monthlyFortuneTexts';
export type { MonthlyFortuneText } from './monthlyFortuneTexts';
export { YEARLY_FORTUNE_TEXTS, getYearlyFortuneText } from './yearlyFortuneTexts';
export type { YearlyFortuneText } from './yearlyFortuneTexts';
export { generateDetailedFiveElementAnalysis } from './detailedFiveElementTexts';
export type { DetailedFiveElementResult } from './detailedFiveElementTexts';
export { generateDetailedTenStarAnalysis } from './detailedTenStarTexts';
export type { DetailedTenStarResult } from './detailedTenStarTexts';
import type { DetailedFiveElementResult } from './detailedFiveElementTexts';
import type { DetailedTenStarResult } from './detailedTenStarTexts';
export interface InterpretationResult {
    /** 일간 성격 해석 */
    dayStem: {
        char: string;
        name: string;
        symbol: string;
        short: string;
        detail: string;
        keywords: string[];
    } | null;
    /** 오행 과다/부족 해석 */
    fiveElements: {
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
    /** 십성 분포 해석 */
    tenStars: {
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
            short: string;
            detail: string;
            keywords: string[];
        } | null;
    };
    /** 신강/신약 해석 */
    strength: {
        result: string;
        symbol: string;
        short: string;
        detail: string;
        career: string;
        relationship: string;
        wealth: string;
        health: string;
        advice: string;
        keywords: string[];
    } | null;
    /** 오늘의 운세 (일운 천간 십성 기반) */
    dailyFortune: {
        star: string;
        theme: string;
        rating: number;
        ratingEmoji: string;
        short: string;
        detail: string;
        advice: string;
        lucky: {
            color: string;
            direction: string;
            number: string;
            time: string;
        };
        caution: string;
    } | null;
    /** 이번달 운세 (월운 천간 십성 기반) */
    monthlyFortune: {
        star: string;
        theme: string;
        rating: number;
        ratingEmoji: string;
        short: string;
        detail: string;
        advice: string;
        focus: {
            career: string;
            relationship: string;
            health: string;
            wealth: string;
        };
        caution: string;
    } | null;
    /** 올해의 운세 (세운 천간 십성 기반) */
    yearlyFortune: {
        star: string;
        theme: string;
        rating: number;
        ratingEmoji: string;
        short: string;
        detail: string;
        advice: string;
        outlook: {
            career: string;
            relationship: string;
            health: string;
            wealth: string;
        };
        keywords: [string, string, string];
        caution: string;
    } | null;
    /** C2: 가중치 기반 오행 상세 분석 (⑧ blur 영역) */
    detailedFiveElements: DetailedFiveElementResult | null;
    /** C2: 위치별 십성 상세 분석 (⑨ blur 영역) */
    detailedTenStars: DetailedTenStarResult | null;
}
/**
 * 사주 계산 결과에서 전체 해석을 한번에 생성
 *
 * @param result calculateSaju()의 반환값 (또는 API 응답)
 * @returns InterpretationResult
 */
export declare function generateInterpretation(result: any): InterpretationResult;
/**
 * 일간 한자로 성격 해석 조회 (short만)
 */
export declare function getShortDayStemInterpretation(dayStemChar: string): string;
/**
 * 신강/신약 결과로 해석 조회 (short만)
 */
export declare function getShortStrengthInterpretation(strengthResult: string): string;
/**
 * 십성으로 오늘의 운세 조회 (short만)
 */
export declare function getShortDailyFortune(stemStar: string): string;
/**
 * 십성으로 이번달 운세 조회 (short만)
 */
export declare function getShortMonthlyFortune(stemStar: string): string;
/**
 * 십성으로 올해 운세 조회 (short만)
 */
export declare function getShortYearlyFortune(stemStar: string): string;
//# sourceMappingURL=index.d.ts.map