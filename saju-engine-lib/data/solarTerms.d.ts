export interface SolarTermEntry {
    name: string;
    dateTime: string;
}
export interface YearSolarTerms {
    year: number;
    terms: SolarTermEntry[];
}
export declare const SOLAR_TERMS_DATA: YearSolarTerms[];
/**
 * 특정 연도의 절기 데이터 조회
 */
export declare function getSolarTermsForYear(year: number): YearSolarTerms | null;
/**
 * 특정 연도 + 절기명으로 절입시각 Date 반환
 * yearPillar.ts, monthPillar.ts에서 사용
 */
export declare function getSolarTermDateTime(year: number, termName: string): Date | null;
//# sourceMappingURL=solarTerms.d.ts.map