/**
 * daewoon.ts - 대운(大運) 계산 모듈
 *
 * 대운 = 10년 단위 운의 흐름
 * 월주를 기준으로 순행/역행하며 간지를 나열
 *
 * 핵심 로직:
 *   ① 순행/역행 결정 (성별 + 년간 음양)
 *   ② 대운 시작 나이 계산 (생일 ↔ 이전/다음 절기 시간차)
 *   ③ 대운 간지 나열 (월주 기준)
 *   ④ 각 대운별 원국과의 상호작용 분석
 *
 * 충합형해 로직은 interactions.ts 공통 모듈 사용
 */
import { Pillar, StemInfo, BranchInfo } from './types';
import { HiddenStemEntry } from './hiddenStems';
import { StemCombination, BranchClash, BranchCombine, BranchPunishment, BranchHarm, InteractionResult, FortuneTenStar } from './interactions';
export type { StemCombination, BranchClash, BranchCombine, BranchPunishment, BranchHarm, InteractionResult, };
export type DaewoonTenStar = FortuneTenStar;
/** 순행/역행 */
export type Direction = 'forward' | 'backward';
/** 대운 시작 나이 상세 */
export interface DaewoonStartAge {
    years: number;
    months: number;
    totalMonths: number;
    daysBetween: number;
    description: string;
}
/** 개별 대운 정보 */
export interface DaewoonEntry {
    index: number;
    stemIndex: number;
    branchIndex: number;
    stem: StemInfo;
    branch: BranchInfo;
    ganjiChar: string;
    ganjiName: string;
    startAge: number;
    endAge: number;
    startYear: number;
    endYear: number;
    hiddenStems: HiddenStemEntry[];
    tenStar: FortuneTenStar;
    interactions: InteractionResult;
}
/** 대운 계산 결과 전체 */
export interface DaewoonResult {
    direction: Direction;
    directionReason: string;
    startAge: DaewoonStartAge;
    entries: DaewoonEntry[];
    meta: {
        count: number;
        prevTermName: string;
        prevTermDate: string;
        nextTermName: string;
        nextTermDate: string;
    };
}
/** 대운 계산 옵션 */
export interface DaewoonOptions {
    count?: number;
}
/**
 * 대운을 계산합니다.
 *
 * @param birthYear   양력 생년
 * @param birthMonth  양력 생월
 * @param birthDay    양력 생일
 * @param birthHour   시 (0~23)
 * @param birthMinute 분 (0~59)
 * @param gender      성별 ('male' | 'female')
 * @param yearPillar  년주 (순행/역행 판단에 사용)
 * @param monthPillar 월주 (대운 기준점)
 * @param dayPillar   일주 (십성 판단에 사용)
 * @param fourPillars 사주 4기둥 (충합형해 분석에 사용)
 * @param options     옵션 (대운 개수 등)
 */
export declare function calculateDaewoon(birthYear: number, birthMonth: number, birthDay: number, birthHour: number, birthMinute: number, gender: 'male' | 'female', yearPillar: Pillar, monthPillar: Pillar, dayPillar: Pillar, fourPillars: {
    year: Pillar;
    month: Pillar;
    day: Pillar;
    hour: Pillar | null;
}, options?: DaewoonOptions): DaewoonResult;
export declare function formatDaewoon(result: DaewoonResult): string;
//# sourceMappingURL=daewoon.d.ts.map