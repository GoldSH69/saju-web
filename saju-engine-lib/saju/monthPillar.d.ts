import { Pillar } from './types';
/**
 * 월주(月柱)를 계산합니다.
 *
 * @param year       양력 연도
 * @param month      양력 월
 * @param day        양력 일
 * @param hour       시 (0~23)
 * @param minute     분 (0~59)
 * @param yearStemIndex  년주 천간 인덱스 (월간 계산에 필요)
 * @returns 월주 (천간 + 지지) + 사용된 절기 정보
 */
export declare function calculateMonthPillar(year: number, month: number, day: number, hour: number, minute: number, yearStemIndex: number): {
    pillar: Pillar;
    solarTermName: string;
    solarTermDateTime: string;
};
//# sourceMappingURL=monthPillar.d.ts.map