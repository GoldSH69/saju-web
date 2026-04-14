/**
 * astronomy-engine 기반 절기 시각 계산기
 *
 * 태양 황경이 특정 각도가 되는 정확한 시각을 계산
 * UTC → KST(+9시간) 변환 포함
 *
 * 사용법:
 *   npx ts-node src/data/generateSolarTerms.ts
 */
export interface SolarTermEntry {
    year: number;
    termIndex: number;
    name: string;
    hanja: string;
    isJeol: boolean;
    month: number;
    longitude: number;
    utcDatetime: string;
    kstDatetime: string;
    kstYear: number;
    kstMonth: number;
    kstDay: number;
    kstHour: number;
    kstMinute: number;
}
export interface YearSolarTerms {
    year: number;
    terms: SolarTermEntry[];
}
/**
 * 지정 범위의 모든 연도 절기 데이터 생성
 */
export declare function generateAllSolarTerms(startYear: number, endYear: number): Map<number, SolarTermEntry[]>;
//# sourceMappingURL=generateSolarTerms.d.ts.map