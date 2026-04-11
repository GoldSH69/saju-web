/**
 * 공망(空亡) 계산 모듈
 *
 * 60갑자의 순(旬)에서 빠지는 지지 2개를 공망으로 판단
 * - 년공망: 년주 기준 → 사회적/외부적 영향
 * - 일공망: 일주 기준 → 개인적/내면적 영향 (실전에서 더 중요)
 *
 * ┌────────┬──────────────────────────────┬──────────┐
 * │ 순(旬)  │ 간지 10개                     │ 공망 2개  │
 * ├────────┼──────────────────────────────┼──────────┤
 * │ 甲子旬  │ 甲子 乙丑 丙寅 丁卯 戊辰 … 癸酉 │ 戌, 亥   │
 * │ 甲戌旬  │ 甲戌 乙亥 丙子 丁丑 戊寅 … 癸未 │ 申, 酉   │
 * │ 甲申旬  │ 甲申 乙酉 丙戌 丁亥 戊子 … 癸巳 │ 午, 未   │
 * │ 甲午旬  │ 甲午 乙未 丙申 丁酉 戊戌 … 癸卯 │ 辰, 巳   │
 * │ 甲辰旬  │ 甲辰 乙巳 丙午 丁未 戊申 … 癸丑 │ 寅, 卯   │
 * │ 甲寅旬  │ 甲寅 乙卯 丙辰 丁巳 戊午 … 癸亥 │ 子, 丑   │
 * └────────┴──────────────────────────────┴──────────┘
 */
/** 공망 쌍 정보 */
export interface GongmangPair {
    /** 소속 순(旬) 이름 (한자) */
    sunName: string;
    /** 소속 순(旬) 이름 (한글) */
    sunNameKo: string;
    /** 공망 지지 인덱스 [첫째, 둘째] */
    indices: [number, number];
    /** 공망 지지 한자 */
    chars: [string, string];
    /** 공망 지지 한글 */
    names: [string, string];
}
/** 원국 지지의 공망 상태 */
export interface BranchGongmangStatus {
    /** 해당 지지 한자 */
    branchChar: string;
    /** 해당 지지 한글 */
    branchName: string;
    /** 년공망 여부 */
    isYearGongmang: boolean;
    /** 일공망 여부 */
    isDayGongmang: boolean;
}
/** 해공(解空) 정보 */
export interface GongmangRelease {
    /** 공망 지지 인덱스 */
    gongmangBranchIndex: number;
    /** 공망 지지 한자 */
    gongmangBranchChar: string;
    /** 해공시키는 지지 인덱스 */
    releaseBranchIndex: number;
    /** 해공시키는 지지 한자 */
    releaseBranchChar: string;
    /** 해공 유형 ('충' | '합') */
    releaseType: '충' | '합';
}
/** 운세 공망 결과 */
export interface FortuneGongmangResult {
    /** 운세 지지가 년공망인지 */
    isYearGongmang: boolean;
    /** 운세 지지가 일공망인지 */
    isDayGongmang: boolean;
    /** 해공 정보 (원국 지지와의 충/합으로 풀리는지) */
    releases: GongmangRelease[];
    /** 해공 여부 */
    isReleased: boolean;
    /** 해석 텍스트 */
    description: string;
}
/** 전체 공망 분석 결과 */
export interface GongmangAnalysis {
    /** 년공망 */
    yearGongmang: GongmangPair;
    /** 일공망 */
    dayGongmang: GongmangPair;
    /** 원국 각 지지의 공망 상태 */
    branchStatus: {
        year: BranchGongmangStatus;
        month: BranchGongmangStatus;
        day: BranchGongmangStatus;
        hour: BranchGongmangStatus | null;
    };
    /** 요약 텍스트 배열 */
    summary: string[];
}
/**
 * 주어진 기둥(천간+지지)의 공망 지지 2개를 계산
 *
 * 공식: startBranch = (branchIndex - stemIndex + 12) % 12
 *       공망1 = (startBranch + 10) % 12
 *       공망2 = (startBranch + 11) % 12
 *
 * @param stemIndex 천간 인덱스 (0~9)
 * @param branchIndex 지지 인덱스 (0~11)
 */
export declare function calculateGongmangPair(stemIndex: number, branchIndex: number): GongmangPair;
/**
 * 특정 지지가 주어진 기둥의 공망인지 확인
 */
export declare function isGongmang(stemIndex: number, branchIndex: number, targetBranchIndex: number): boolean;
/**
 * 원국 전체 공망 분석
 *
 * @param yearStemIndex 년주 천간 인덱스
 * @param yearBranchIndex 년주 지지 인덱스
 * @param monthBranchIndex 월주 지지 인덱스
 * @param dayStemIndex 일주 천간 인덱스
 * @param dayBranchIndex 일주 지지 인덱스
 * @param hourBranchIndex 시주 지지 인덱스 (null이면 시간 미상)
 */
export declare function analyzeGongmang(yearStemIndex: number, yearBranchIndex: number, monthBranchIndex: number, dayStemIndex: number, dayBranchIndex: number, hourBranchIndex: number | null): GongmangAnalysis;
/**
 * 운세(세운/월운/일운)에서 공망 확인 + 해공 판단
 *
 * @param yearStemIndex 원국 년주 천간 인덱스
 * @param yearBranchIndex 원국 년주 지지 인덱스
 * @param dayStemIndex 원국 일주 천간 인덱스
 * @param dayBranchIndex 원국 일주 지지 인덱스
 * @param fortuneBranchIndex 운세(세운/월운/일운)의 지지 인덱스
 * @param chartBranchIndices 원국 지지 인덱스 배열 [년,월,일,시] (해공 판단용)
 */
export declare function checkFortuneGongmang(yearStemIndex: number, yearBranchIndex: number, dayStemIndex: number, dayBranchIndex: number, fortuneBranchIndex: number, chartBranchIndices: number[]): FortuneGongmangResult;
//# sourceMappingURL=gongmang.d.ts.map