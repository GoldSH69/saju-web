/** 오행 종류 */
export type FiveElement = '木' | '火' | '土' | '金' | '水';
/** 음양 */
export type YinYang = '양' | '음';
/** 오행 상세 정보 */
export interface ElementInfo {
    element: FiveElement;
    elementName: string;
    yinYang: YinYang;
}
/** 오행 분포 결과 */
export interface FiveElementCount {
    木: number;
    火: number;
    土: number;
    金: number;
    水: number;
}
/** 오행 분석 전체 결과 */
export interface FiveElementAnalysis {
    /** 표면 천간 4개의 오행 분포 */
    stemElements: FiveElementCount;
    /** 지지 4개의 오행 분포 */
    branchElements: FiveElementCount;
    /** 지장간 포함 전체 오행 분포 (가중치 없음, 단순 카운트) */
    totalElements: FiveElementCount;
    /** 지장간 포함 전체 오행 분포 (일수 가중치 적용) */
    weightedElements: FiveElementCount;
    /** 가장 강한 오행 */
    strongest: FiveElement;
    /** 가장 약한 오행 */
    weakest: FiveElement;
    /** 없는 오행 목록 */
    missing: FiveElement[];
    /** 일간의 오행 */
    dayStemElement: FiveElement;
    /** 일간의 음양 */
    dayStemYinYang: YinYang;
    /** 월령 오행 (월지의 대표 오행) */
    monthElement: FiveElement;
    /** 상세 내역 (디버그/표시용) */
    details: ElementDetail[];
}
/** 개별 글자의 오행 상세 */
export interface ElementDetail {
    position: string;
    char: string;
    element: FiveElement;
    yinYang: YinYang;
    isHidden: boolean;
    hiddenRole?: string;
    hiddenDays?: number;
}
/**
 * 천간의 오행 정보 반환
 */
export declare function getStemElement(stemChar: string): ElementInfo;
/**
 * 지지의 오행 정보 반환
 */
export declare function getBranchElement(branchChar: string): ElementInfo;
/**
 * 사주 전체 오행 분포 분석
 *
 * @param stemChars 천간 4개 [년간, 월간, 일간, 시간]
 * @param branchChars 지지 4개 [년지, 월지, 일지, 시지]
 * @returns 오행 분석 결과
 *
 * @example
 * analyzeFiveElements(
 *   ['甲', '丙', '戊', '庚'],  // 천간
 *   ['辰', '午', '子', '寅']   // 지지
 * )
 */
export declare function analyzeFiveElements(stemChars: string[], branchChars: string[]): FiveElementAnalysis;
/**
 * 오행 분포를 보기 좋게 출력 (디버그용)
 */
export declare function formatFiveElements(analysis: FiveElementAnalysis): string;
//# sourceMappingURL=fiveElements.d.ts.map