/**
 * 오행 상세 분석 (가중치 기반) — C2
 *
 * C1에서 구축한 가중치 데이터(weightedElements, monthElement 등)를 활용하여
 * blur 영역 ⑧에서 광고 후 제공되는 상세 해석을 생성합니다.
 *
 * 포함 내용:
 *   ① 가중치 점수 순위표
 *   ② 최강/최약 오행 해석
 *   ③ 월령(출생 계절) 분석
 *   ④ 균형 진단 (0~100점)
 *   ⑤ 보충 추천 (색상, 방향, 음식, 활동)
 *   ⑥ 위치별 오행 배치 해석 (천간 4개)
 */
import type { FiveElementAnalysis, FiveElement } from '../fiveElements';
export interface DetailedFiveElementResult {
    /** 가중치 점수 순위 (높은 점수 순) */
    scoreRanking: {
        element: FiveElement;
        ko: string;
        score: number;
        percent: number;
        rank: number;
        status: '과다' | '강함' | '보통' | '약함' | '결핍';
    }[];
    /** 최강 오행 해석 */
    strongestText: string;
    /** 최약 오행 해석 */
    weakestText: string;
    /** 월령(출생 계절) 분석 */
    monthAnalysis: {
        element: FiveElement;
        ko: string;
        season: string;
        description: string;
        relation: string;
    };
    /** 균형 진단 */
    balance: {
        type: '균형' | '약간 편중' | '편중' | '심한 편중';
        score: number;
        description: string;
    };
    /** 보충 추천 (가장 약한 오행 기준) */
    supplement: {
        element: FiveElement;
        ko: string;
        color: string;
        direction: string;
        taste: string;
        activity: string;
        description: string;
    };
    /** 위치별 오행 배치 해석 (천간 4개) */
    positionAnalysis: {
        position: string;
        label: string;
        char: string;
        element: FiveElement;
        elementKo: string;
        meaning: string;
        interpretation: string;
    }[];
}
/**
 * C1 가중치 데이터 기반 오행 상세 해석 생성
 *
 * @param fiveElements analyzeFiveElements()의 반환값
 * @returns 상세 오행 분석 결과 (⑧ blur 영역용)
 */
export declare function generateDetailedFiveElementAnalysis(fiveElements: FiveElementAnalysis): DetailedFiveElementResult;
//# sourceMappingURL=detailedFiveElementTexts.d.ts.map