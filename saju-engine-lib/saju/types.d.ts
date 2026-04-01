export interface StemInfo {
    index: number;
    char: string;
    name: string;
    element: string;
    elementKo: string;
    yinYang: string;
    yinYangKo: string;
}
export interface BranchInfo {
    index: number;
    char: string;
    name: string;
    element: string;
    elementKo: string;
    yinYang: string;
    yinYangKo: string;
    originalTimeRange: string;
    adjustedTimeRange: string;
}
export interface Pillar {
    heavenlyStem: StemInfo;
    earthlyBranch: BranchInfo;
}
export interface TimeAdjustmentResult {
    originalHour: number;
    originalMinute: number;
    adjustedHour: number;
    adjustedMinute: number;
    adjustmentType: 'standard30' | 'trueSolar' | 'none';
    adjustmentMinutes: number;
    description: string;
    dateChanged: boolean;
}
export interface StrengthDetail {
    position: string;
    stem: string;
    stemName: string;
    tenStar: string;
    category: string;
    isSupporting: boolean;
    weight: number;
    score: number;
}
export interface StrengthResult {
    dayStem: string;
    dayStemName: string;
    dayElement: string;
    dayElementKo: string;
    deukryeong: boolean;
    monthBranch: string;
    monthMainStem: string;
    monthMainElement: string;
    supportScore: number;
    restrainScore: number;
    totalScore: number;
    strength: string;
    strengthLevel: number;
    details: StrengthDetail[];
    summary: string;
}
export type StrengthFactor = StrengthDetail;
export type TenStar = '비견' | '겁재' | '식신' | '상관' | '편재' | '정재' | '편인' | '정인' | '편관' | '정관';
export type TenStarCategory = '비화' | '식상' | '재성' | '인성' | '관성';
export interface TenStarInfo {
    target: string;
    targetKorean: string;
    tenStar: TenStar;
    category: TenStarCategory;
    position: string;
}
export interface TenStarResult {
    dayStem: string;
    dayStemKorean: string;
    yearStem: TenStarInfo;
    monthStem: TenStarInfo;
    hourStem: TenStarInfo;
    yearBranchStars: TenStarInfo[];
    monthBranchStars: TenStarInfo[];
    dayBranchStars: TenStarInfo[];
    hourBranchStars: TenStarInfo[];
    allStars: TenStarInfo[];
    starCount: Record<TenStar, number>;
    categoryCount: Record<TenStarCategory, number>;
}
export interface HiddenStemEntry {
    char: string;
    index: number;
    role: string;
    roleName: string;
    days: number;
}
export interface FiveElementCount {
    wood: number;
    fire: number;
    earth: number;
    metal: number;
    water: number;
}
export interface FiveElementAnalysis {
    counts: FiveElementCount;
    dominant: string;
    weak: string;
    missing: string[];
    balance: string;
}
export type HiddenStemInfo = HiddenStemEntry;
//# sourceMappingURL=types.d.ts.map