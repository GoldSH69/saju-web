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
/**
 * 일간(me)을 기준으로 대상 천간(target)의 십성을 판단
 * @param me - 일간 한자 (예: '甲')
 * @param target - 대상 천간 한자 (예: '庚')
 */
export declare function getTenStar(me: string, target: string): TenStar;
/**
 * 십성의 카테고리를 반환
 */
export declare function getTenStarCategory(star: TenStar): TenStarCategory;
export declare function calculateTenStars(yearStem: string, monthStem: string, dayStem: string, hourStem: string | null, yearBranch: string, monthBranch: string, dayBranch: string, hourBranch: string | null): TenStarResult;
//# sourceMappingURL=tenStars.d.ts.map