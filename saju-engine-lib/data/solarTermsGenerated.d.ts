/**
 * 절기 데이터 (자동 생성)
 *
 * 생성 도구: astronomy-engine
 * 생성 일시: 2026-03-27T04:23:03.654Z
 * 범위: 1920년 ~ 2050년
 *
 * 각 절기의 절입시각은 KST(한국 표준시, UTC+9) 기준
 *
 * ⚠️ 이 파일은 자동 생성됩니다. 직접 수정하지 마세요.
 *    수정이 필요하면 generateSolarTerms.ts를 실행하세요.
 */
export interface SolarTermData {
    /** 절기 인덱스 (0~23) */
    i: number;
    /** 한글명 */
    name: string;
    /** 한자명 */
    hanja: string;
    /** 절기(節) 여부 */
    isJeol: boolean;
    /** KST 월 */
    month: number;
    /** KST 일 */
    day: number;
    /** KST 시 */
    hour: number;
    /** KST 분 */
    minute: number;
}
/**
 * 연도별 절기 데이터
 * key: 연도 (양력)
 * value: 해당 연도의 24절기 배열 (소한→대한→입춘→...→동지 순서)
 */
export declare const SOLAR_TERMS_DATA: Record<number, SolarTermData[]>;
/**
 * 특정 연도의 입춘 절입시각 조회
 * 년주 계산에 사용
 */
export declare function getLichunForYear(year: number): {
    month: number;
    day: number;
    hour: number;
    minute: number;
} | null;
/**
 * 특정 연도의 12절기(節) 조회
 * 월주 계산에 사용
 */
export declare function getJeolTermsForYear(year: number): SolarTermData[] | null;
/**
 * 특정 날짜가 어떤 절기 월에 속하는지 판단
 * 반환값: 인월(1) ~ 축월(12) (음력 월 아님, 절기 월)
 *
 * 절기월 매핑:
 *   입춘~경칩 전 = 인월(1) → 지지: 寅
 *   경칩~청명 전 = 묘월(2) → 지지: 卯
 *   ...
 *   소한~입춘 전 = 축월(12) → 지지: 丑
 */
export declare function getJeolMonth(year: number, month: number, day: number, hour: number, minute: number): number | null;
/**
 * 데이터 범위 확인
 */
export declare function getSolarTermsRange(): {
    min: number;
    max: number;
};
/**
 * 특정 연도 데이터 존재 여부
 */
export declare function hasSolarTermsData(year: number): boolean;
//# sourceMappingURL=solarTermsGenerated.d.ts.map