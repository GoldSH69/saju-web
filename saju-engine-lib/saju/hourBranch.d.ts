import { BranchInfo } from './types';
/**
 * 보정된 시간으로 시지(時支) 인덱스를 반환합니다.
 *
 * 이미 보정이 완료된 시간이 들어옵니다.
 * 보정된 시간에 전통적 정시(正時) 경계를 적용합니다.
 *
 * 子시: 23:00 ~ 01:00
 * 丑시: 01:00 ~ 03:00
 * 寅시: 03:00 ~ 05:00
 * 卯시: 05:00 ~ 07:00
 * 辰시: 07:00 ~ 09:00
 * 巳시: 09:00 ~ 11:00
 * 午시: 11:00 ~ 13:00
 * 未시: 13:00 ~ 15:00
 * 申시: 15:00 ~ 17:00
 * 酉시: 17:00 ~ 19:00
 * 戌시: 19:00 ~ 21:00
 * 亥시: 21:00 ~ 23:00
 */
export declare function getHourBranchIndex(adjustedHour: number, adjustedMinute: number): number;
/**
 * 보정된 시간으로 시지 정보 객체를 반환합니다.
 */
export declare function getHourBranch(adjustedHour: number, adjustedMinute: number): BranchInfo;
//# sourceMappingURL=hourBranch.d.ts.map