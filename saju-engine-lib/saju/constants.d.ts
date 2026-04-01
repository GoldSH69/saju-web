import { StemInfo, BranchInfo } from './types';
/**
 * 천간 10개
 */
export declare const STEMS: StemInfo[];
/**
 * 지지 12개
 */
export declare const BRANCHES: BranchInfo[];
/**
 * 지장간 테이블
 * 각 지지(인덱스 0~11)에 대한 지장간 구성
 * stem: 천간 인덱스, type: 여기/중기/본기, weight: 비율
 */
export declare const HIDDEN_STEMS_TABLE: Record<number, {
    stemIndex: number;
    type: 'residual' | 'middle' | 'main';
    weight: number;
}[]>;
/**
 * 오행 상생 관계
 * key가 value를 생한다 (목생화, 화생토, 토생금, 금생수, 수생목)
 */
export declare const GENERATES: Record<string, string>;
/**
 * 오행 상극 관계
 * key가 value를 극한다 (목극토, 토극수, 수극화, 화극금, 금극목)
 */
export declare const OVERCOMES: Record<string, string>;
/**
 * 오행 한글 매핑
 */
export declare const ELEMENT_KO: Record<string, string>;
/**
 * 월간 시작 천간 (년간 그룹별)
 * 년간이 甲(0)또는 己(5) → 寅월 천간은 丙(2)부터
 * 년간이 乙(1)또는 庚(6) → 寅월 천간은 戊(4)부터
 * 년간이 丙(2)또는 辛(7) → 寅월 천간은 庚(6)부터
 * 년간이 丁(3)또는 壬(8) → 寅월 천간은 壬(8)부터
 * 년간이 戊(4)또는 癸(9) → 寅월 천간은 甲(0)부터
 */
export declare const MONTH_STEM_START: Record<number, number>;
/**
 * 시간 시작 천간 (일간 그룹별)
 * 일간이 甲(0)또는 己(5) → 子시 천간은 甲(0)부터
 * 일간이 乙(1)또는 庚(6) → 子시 천간은 丙(2)부터
 * 일간이 丙(2)또는 辛(7) → 子시 천간은 戊(4)부터
 * 일간이 丁(3)또는 壬(8) → 子시 천간은 庚(6)부터
 * 일간이 戊(4)또는 癸(9) → 子시 천간은 壬(8)부터
 */
export declare const HOUR_STEM_START: Record<number, number>;
//# sourceMappingURL=constants.d.ts.map