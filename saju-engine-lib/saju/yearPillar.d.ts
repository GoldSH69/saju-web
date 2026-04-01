import { Pillar } from './types';
/**
 * 년주(年柱)를 계산합니다.
 *
 * @param year   양력 연도
 * @param month  양력 월
 * @param day    양력 일
 * @param hour   시 (0~23, 절입시각 비교용)
 * @param minute 분 (0~59)
 * @returns 년주 (천간 + 지지)
 */
export declare function calculateYearPillar(year: number, month: number, day: number, hour?: number, minute?: number): Pillar;
//# sourceMappingURL=yearPillar.d.ts.map