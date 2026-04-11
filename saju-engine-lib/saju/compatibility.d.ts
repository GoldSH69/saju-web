/**
 * compatibility.ts - 궁합(宮合) 분석 모듈
 *
 * 두 사람의 사주 계산 결과(CalculateResult)를 받아 궁합을 분석합니다.
 *
 * 5가지 항목 (총 100점):
 *   ① 일간 오행 궁합 (25점) - 상생/상극/비화 + 음양 조화
 *   ② 용신 보완 (20점) - 상대가 내 부족 오행을 채워주는지
 *   ③ 십성 궁합 (20점) - 상대 일간이 내 기준 어떤 십성인지
 *   ④ 일지 궁합 (25점) - 배우자궁 충/합/형/해
 *   ⑤ 오행 균형 보완 (10점) - 두 사주 합쳤을 때 균형도
 */
import { CalculateResult } from './calculate';
/** 궁합 등급 */
export type CompatibilityGrade = '천생연분' | '좋은 궁합' | '보통' | '노력 필요' | '주의 필요';
/** 개별 항목 결과 */
export interface CompatibilityItem {
    category: string;
    score: number;
    maxScore: number;
    grade: string;
    description: string;
    details: string[];
    /** 광고 후 상세 해석 (blur 영역) */
    detailedAnalysis: {
        interpretation: string;
        relationship: string;
        advice: string;
        keywords: string[];
    };
}
/** 궁합 종합 결과 */
export interface CompatibilityResult {
    /** 두 사람 기본 정보 */
    person1: {
        name?: string;
        dayStem: string;
        dayStemName: string;
        dayElement: string;
        dayElementKo: string;
        yinYang: string;
    };
    person2: {
        name?: string;
        dayStem: string;
        dayStemName: string;
        dayElement: string;
        dayElementKo: string;
        yinYang: string;
    };
    /** 5개 항목별 결과 */
    items: {
        dayElement: CompatibilityItem;
        yongsinComplement: CompatibilityItem;
        tenStar: CompatibilityItem;
        dayBranch: CompatibilityItem;
        elementBalance: CompatibilityItem;
    };
    /** 종합 */
    totalScore: number;
    grade: CompatibilityGrade;
    summary: string;
    advice: string[];
    /** 메타 */
    meta: {
        calculatedAt: string;
        engineVersion: string;
    };
}
/**
 * 두 사람의 사주 결과를 받아 궁합을 분석합니다.
 *
 * @param person1 첫 번째 사람의 calculateSaju() 결과
 * @param person2 두 번째 사람의 calculateSaju() 결과
 * @param name1   첫 번째 사람 이름 (선택)
 * @param name2   두 번째 사람 이름 (선택)
 */
export declare function analyzeCompatibility(person1: CalculateResult, person2: CalculateResult, name1?: string, name2?: string): CompatibilityResult;
//# sourceMappingURL=compatibility.d.ts.map