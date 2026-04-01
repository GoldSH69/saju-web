import { Pillar } from './types';
/**
 * 시주(時柱)를 계산합니다.
 *
 * @param adjustedHour    보정된 시간 (0~23)
 * @param adjustedMinute  보정된 분 (0~59)
 * @param dayStemIndex    일간 천간 인덱스 (0~9)
 * @param useNextDayStem  야자시 시 다음일 일간 사용 여부
 * @returns 시주 (천간 + 지지)
 */
export declare function calculateHourPillar(adjustedHour: number, adjustedMinute: number, dayStemIndex: number, useNextDayStem?: boolean): Pillar;
//# sourceMappingURL=hourPillar.d.ts.map