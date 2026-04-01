import { TimeAdjustmentResult } from './types';
/**
 * 시간 보정을 적용합니다.
 *
 * 한국 표준시는 동경 135도 기준이지만,
 * 실제 한반도(서울)는 동경 127.5도에 위치하여
 * 약 30분의 시차가 발생합니다.
 *
 * 기본 정책: 30분을 빼서 실제 태양시에 가깝게 보정
 */
export declare function adjustTime(hour: number, minute: number, adjustmentType: 'standard30' | 'trueSolar' | 'none', year?: number, month?: number, day?: number): TimeAdjustmentResult;
//# sourceMappingURL=timeAdjustment.d.ts.map