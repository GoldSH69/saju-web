import { Pillar } from './types';
/**
 * 그레고리력 날짜 → 율리우스 적일(JDN) 변환
 */
export declare function getJulianDayNumber(year: number, month: number, day: number): number;
/**
 * 일주(日柱)를 계산합니다.
 *
 * 검증된 기준점:
 * - 2024-01-01 = 甲子(갑자) = 인덱스 0
 * - 1900-02-01 = 乙巳(을사) = 인덱스 41
 */
export declare function calculateDayPillar(year: number, month: number, day: number): Pillar;
/**
 * 60갑자 인덱스만 반환 (테스트/디버깅용)
 */
export declare function getDayGanzhiIndex(year: number, month: number, day: number): number;
//# sourceMappingURL=dayPillar.d.ts.map