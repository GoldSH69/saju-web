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
 * 특정 연도의 절기 데이터를 조회합니다.
 */
export declare function getSolarTermsForYear(year: number): YearSolarTerms | undefined;
/**
 * 특정 연도의 특정 절기 시각을 조회합니다.
 */
export declare function getSolarTermDateTime(year: number, termName: string): Date | null;
//# sourceMappingURL=solarTerms_backup.d.ts.map