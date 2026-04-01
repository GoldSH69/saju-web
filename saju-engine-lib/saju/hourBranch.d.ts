import { BranchInfo } from './types';
/**
 * 보정된 시간을 기준으로 시지(時支) 인덱스를 반환합니다.
 *
 * 보정된 시간에 전통적 정시(正時) 경계를 적용합니다.
 * 子시: 23:00~01:00
 * 丑시: 01:00~03:00
 * 寅시: 03:00~05:00
 * ...
 *
 * 사용자가 30분 보정을 적용했다면,
 * 이미 보정이 완료된 시간이 들어옵니다.
 */
export declare function getHourBranchIndex(adjustedHour: number, adjustedMinute: number): number;
/**
 * 보정된 시간을 기준으로 시지 정보를 반환합니다.
 */
export declare function getHourBranch(adjustedHour: number, adjustedMinute: number): BranchInfo;
//# sourceMappingURL=hourBranch.d.ts.map