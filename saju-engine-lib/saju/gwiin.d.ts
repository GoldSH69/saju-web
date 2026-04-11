/**
 * 천을귀인(天乙貴人) 계산 모듈
 *
 * 천을귀인은 사주에서 가장 중요한 길신(吉神)으로,
 * 위기 시 도움을 주는 귀인, 좋은 인연, 보이지 않는 도움을 의미합니다.
 *
 * 일간(日干) 기준으로 천을귀인 지지 2개가 정해지며,
 * 원국 4기둥 지지 + 대운/세운 지지에서 확인합니다.
 *
 * ┌────────┬─────────────────────┐
 * │ 일간    │ 천을귀인 지지        │
 * ├────────┼─────────────────────┤
 * │ 甲(갑)  │ 丑(축), 未(미)       │
 * │ 乙(을)  │ 子(자), 申(신)       │
 * │ 丙(병)  │ 酉(유), 亥(해)       │
 * │ 丁(정)  │ 酉(유), 亥(해)       │
 * │ 戊(무)  │ 丑(축), 未(미)       │
 * │ 己(기)  │ 子(자), 申(신)       │
 * │ 庚(경)  │ 丑(축), 未(미)       │
 * │ 辛(신)  │ 寅(인), 午(오)       │
 * │ 壬(임)  │ 卯(묘), 巳(사)       │
 * │ 癸(계)  │ 卯(묘), 巳(사)       │
 * └────────┴─────────────────────┘
 *
 * 위치별 의미:
 * - 년지: 조상/사회적 귀인 → 가문, 사회적 배경에서 도움
 * - 월지: 부모/직장 귀인 → 부모, 직장 상사/동료에서 도움
 * - 일지: 배우자 귀인 → 배우자가 귀인 역할
 * - 시지: 자녀/말년 귀인 → 자녀, 후배, 말년에 도움
 */
/** 천을귀인 지지 쌍 정보 */
export interface GwiinPair {
    /** 귀인 지지 인덱스 [첫째, 둘째] */
    indices: [number, number];
    /** 귀인 지지 한자 */
    chars: [string, string];
    /** 귀인 지지 한글 */
    names: [string, string];
    /** 귀인 지지 오행 한글 */
    elements: [string, string];
}
/** 원국 지지의 귀인 상태 */
export interface BranchGwiinStatus {
    /** 위치 ('year' | 'month' | 'day' | 'hour') */
    position: string;
    /** 위치 한글 ('년지' | '월지' | '일지' | '시지') */
    positionLabel: string;
    /** 해당 지지 한자 */
    branchChar: string;
    /** 해당 지지 한글 */
    branchName: string;
    /** 천을귀인 해당 여부 */
    isGwiin: boolean;
    /** 귀인일 때 의미 키워드 */
    keyword: string;
    /** 귀인일 때 설명 */
    description: string;
}
/** 운세(대운/세운) 귀인 확인 결과 */
export interface FortuneGwiinResult {
    /** 운세 지지가 천을귀인인지 */
    isGwiin: boolean;
    /** 운세 지지 한자 */
    fortuneBranchChar: string;
    /** 운세 지지 한글 */
    fortuneBranchName: string;
    /** 해석 텍스트 */
    description: string;
}
/** 전체 천을귀인 분석 결과 */
export interface GwiinAnalysis {
    /** 일간 정보 */
    dayStem: {
        char: string;
        name: string;
        index: number;
    };
    /** 천을귀인 지지 쌍 */
    gwiinPair: GwiinPair;
    /** 원국 각 지지의 귀인 상태 */
    branchStatus: {
        year: BranchGwiinStatus;
        month: BranchGwiinStatus;
        day: BranchGwiinStatus;
        hour: BranchGwiinStatus | null;
    };
    /** 원국에서 귀인이 있는 위치 수 */
    gwiinCount: number;
    /** 귀인이 있는 위치 목록 */
    gwiinPositions: string[];
    /** 요약 텍스트 배열 */
    summary: string[];
}
/**
 * 일간 기준 천을귀인 지지 2개를 반환
 *
 * @param dayStemIndex 일간(천간) 인덱스 (0~9)
 * @returns GwiinPair
 */
export declare function getGwiinBranches(dayStemIndex: number): GwiinPair;
/**
 * 특정 지지가 천을귀인인지 확인
 *
 * @param dayStemIndex 일간(천간) 인덱스 (0~9)
 * @param targetBranchIndex 확인할 지지 인덱스 (0~11)
 * @returns boolean
 */
export declare function isGwiin(dayStemIndex: number, targetBranchIndex: number): boolean;
/**
 * 원국 전체 천을귀인 분석
 *
 * @param dayStemIndex 일간(천간) 인덱스
 * @param yearBranchIndex 년지 인덱스
 * @param monthBranchIndex 월지 인덱스
 * @param dayBranchIndex 일지 인덱스
 * @param hourBranchIndex 시지 인덱스 (null이면 시간 미상)
 */
export declare function analyzeGwiin(dayStemIndex: number, yearBranchIndex: number, monthBranchIndex: number, dayBranchIndex: number, hourBranchIndex: number | null): GwiinAnalysis;
/**
 * 운세(대운/세운/월운/일운) 지지가 천을귀인인지 확인
 *
 * @param dayStemIndex 일간(천간) 인덱스
 * @param fortuneBranchIndex 운세의 지지 인덱스
 */
export declare function checkFortuneGwiin(dayStemIndex: number, fortuneBranchIndex: number): FortuneGwiinResult;
//# sourceMappingURL=gwiin.d.ts.map