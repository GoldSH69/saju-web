/**
 * 24절기 정의
 * 태양 황경(Sun Ecliptic Longitude) 기준
 *
 * 절기(節氣) = 월의 시작을 결정하는 12절기
 * 중기(中氣) = 월의 중간 (월주 계산에는 직접 사용하지 않음)
 *
 * 월주 계산에는 12절기(isJeol=true)만 사용
 * 24절기 전체를 생성해두면 향후 확장에 유리
 */
export interface SolarTermDef {
    index: number;
    name: string;
    hanja: string;
    longitude: number;
    isJeol: boolean;
    month: number;
}
/**
 * 24절기 배열 (태양 황경 순서)
 *
 * 춘분(0°)부터 시작하는 천문학적 순서가 아니라,
 * 전통적인 소한(1월)부터 시작하는 역법 순서 사용
 *
 * 태양 황경:
 *   춘분 = 0°, 이후 15°씩 증가
 *   소한 = 285°
 */
export declare const SOLAR_TERM_DEFS: SolarTermDef[];
/**
 * 월주 계산용 12절기만 추출
 */
export declare const JEOL_TERMS: SolarTermDef[];
//# sourceMappingURL=solarTermDefs.d.ts.map