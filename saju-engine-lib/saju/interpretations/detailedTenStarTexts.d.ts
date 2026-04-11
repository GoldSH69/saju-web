/**
 * 십성 상세 분석 — C2
 *
 * blur 영역 ⑨에서 광고 후 제공되는 상세 해석을 생성합니다.
 *
 * 포함 내용:
 *   ① 위치별 십성 해석 (년간/월간/시간이 어디에 있느냐에 따라 의미 다름)
 *   ② 카테고리 종합 분석 (비겁/식상/재성/관성/인성 비율)
 *   ③ 십성 조합 패턴 (식상생재, 관인상생 등)
 *   ④ 인생 테마 종합
 */
import type { TenStarResult } from '../types';
export interface DetailedTenStarResult {
    /** 위치별 십성 해석 (년간/월간/시간) */
    positionAnalysis: {
        position: string;
        star: string;
        target: string;
        positionMeaning: string;
        interpretation: string;
    }[];
    /** 카테고리 종합 분석 */
    categoryAnalysis: {
        category: string;
        hanja: string;
        theme: string;
        count: number;
        percent: number;
        status: '과다' | '강함' | '보통' | '약함' | '없음';
        description: string;
    }[];
    /** 발견된 십성 조합 패턴 */
    patterns: {
        name: string;
        description: string;
    }[];
    /** 인생 테마 종합 */
    lifeTheme: string;
}
/**
 * 십성 상세 해석 생성
 *
 * @param tenStars buildTenStarAnalysis()의 반환값
 * @returns 상세 십성 분석 결과 (⑨ blur 영역용)
 */
export declare function generateDetailedTenStarAnalysis(tenStars: TenStarResult): DetailedTenStarResult;
//# sourceMappingURL=detailedTenStarTexts.d.ts.map