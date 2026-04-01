export type HiddenStemRole = 'yeogi' | 'junggi' | 'jeonggi';
export interface HiddenStemEntry {
    /** 천간 한자 (甲, 乙, ...) */
    char: string;
    /** 천간 인덱스 (0~9) */
    index: number;
    /** 역할: 여기/중기/정기 */
    role: HiddenStemRole;
    /** 역할 한글명 */
    roleName: string;
    /** 사령 일수 (30일 기준) */
    days: number;
}
export interface PillarHiddenStems {
    /** 지지 한자 */
    branch: string;
    /** 지장간 목록 (여기 → 중기 → 정기 순서) */
    stems: HiddenStemEntry[];
    /** 정기(본기) 천간 */
    mainStem: HiddenStemEntry;
}
/**
 * 특정 지지의 지장간 추출
 *
 * @param branchChar 지지 한자 (子, 丑, 寅, ...)
 * @returns 지장간 배열 (여기 → 중기 → 정기 순서)
 *
 * @example
 * getHiddenStems('寅')
 * // → [
 * //   { char: '戊', index: 4, role: 'yeogi',   roleName: '여기', days: 7  },
 * //   { char: '丙', index: 2, role: 'junggi',  roleName: '중기', days: 7  },
 * //   { char: '甲', index: 0, role: 'jeonggi', roleName: '정기', days: 16 },
 * // ]
 */
export declare function getHiddenStems(branchChar: string): HiddenStemEntry[];
/**
 * 특정 지지의 정기(본기) 천간만 반환
 *
 * @param branchChar 지지 한자
 * @returns 정기 천간 정보
 *
 * @example
 * getMainHiddenStem('寅')  // → { char: '甲', index: 0, ... }
 */
export declare function getMainHiddenStem(branchChar: string): HiddenStemEntry;
/**
 * 사주 4주(년월일시)의 지장간을 모두 추출
 *
 * @param branches 4개 지지 한자 배열 [년지, 월지, 일지, 시지]
 * @returns 각 주(柱)별 지장간 정보
 *
 * @example
 * extractAllHiddenStems(['辰', '午', '子', '寅'])
 */
export declare function extractAllHiddenStems(branches: string[]): PillarHiddenStems[];
/**
 * 사주 전체에서 모든 천간 추출 (천간 4개 + 지장간 전부)
 * → 오행 분포 계산의 입력값으로 사용
 *
 * @param stemChars 4개 천간 [년간, 월간, 일간, 시간]
 * @param branchChars 4개 지지 [년지, 월지, 일지, 시지]
 * @returns 모든 천간 정보 (표면 천간 + 지장간)
 */
export interface AllStemsResult {
    /** 표면 천간 4개 (년간, 월간, 일간, 시간) */
    surfaceStems: {
        char: string;
        index: number;
        position: string;
    }[];
    /** 지장간 전체 */
    hiddenStems: PillarHiddenStems[];
    /** 전체 천간 요약 (char → 총 등장 횟수) */
    stemCounts: Record<string, number>;
}
export declare function extractAllStems(stemChars: string[], branchChars: string[]): AllStemsResult;
/**
 * 지장간 데이터를 보기 좋게 출력 (디버그용)
 */
export declare function formatHiddenStems(branchChar: string): string;
/**
 * 12지지 전체 지장간 표 출력 (디버그용)
 */
export declare function printAllHiddenStems(): void;
//# sourceMappingURL=hiddenStems.d.ts.map