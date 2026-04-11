"use strict";
/**
 * 해석 템플릿 통합 모듈
 *
 * 9개 개별 템플릿을 통합하여 하나의 함수로 전체 해석을 생성합니다.
 *
 * 사용:
 *   import { generateInterpretation } from './interpretations'
 *   const interp = generateInterpretation(calculateResult)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDetailedTenStarAnalysis = exports.generateDetailedFiveElementAnalysis = exports.getYearlyFortuneText = exports.YEARLY_FORTUNE_TEXTS = exports.getMonthlyFortuneText = exports.MONTHLY_FORTUNE_TEXTS = exports.getDailyFortuneText = exports.DAILY_FORTUNE_TEXTS = exports.getStrengthText = exports.STRENGTH_TEXTS = exports.analyzeTenStarTexts = exports.getTenStarText = exports.TEN_STAR_TEXTS = exports.analyzeFiveElementTexts = exports.getFiveElementText = exports.FIVE_ELEMENT_TEXTS = exports.getDayStemText = exports.DAY_STEM_TEXTS = void 0;
exports.generateInterpretation = generateInterpretation;
exports.getShortDayStemInterpretation = getShortDayStemInterpretation;
exports.getShortStrengthInterpretation = getShortStrengthInterpretation;
exports.getShortDailyFortune = getShortDailyFortune;
exports.getShortMonthlyFortune = getShortMonthlyFortune;
exports.getShortYearlyFortune = getShortYearlyFortune;
// ─── 개별 모듈 re-export ────────────────────────────────
var dayStemTexts_1 = require("./dayStemTexts");
Object.defineProperty(exports, "DAY_STEM_TEXTS", { enumerable: true, get: function () { return dayStemTexts_1.DAY_STEM_TEXTS; } });
Object.defineProperty(exports, "getDayStemText", { enumerable: true, get: function () { return dayStemTexts_1.getDayStemText; } });
var fiveElementTexts_1 = require("./fiveElementTexts");
Object.defineProperty(exports, "FIVE_ELEMENT_TEXTS", { enumerable: true, get: function () { return fiveElementTexts_1.FIVE_ELEMENT_TEXTS; } });
Object.defineProperty(exports, "getFiveElementText", { enumerable: true, get: function () { return fiveElementTexts_1.getFiveElementText; } });
Object.defineProperty(exports, "analyzeFiveElementTexts", { enumerable: true, get: function () { return fiveElementTexts_1.analyzeFiveElementTexts; } });
var tenStarTexts_1 = require("./tenStarTexts");
Object.defineProperty(exports, "TEN_STAR_TEXTS", { enumerable: true, get: function () { return tenStarTexts_1.TEN_STAR_TEXTS; } });
Object.defineProperty(exports, "getTenStarText", { enumerable: true, get: function () { return tenStarTexts_1.getTenStarText; } });
Object.defineProperty(exports, "analyzeTenStarTexts", { enumerable: true, get: function () { return tenStarTexts_1.analyzeTenStarTexts; } });
var strengthTexts_1 = require("./strengthTexts");
Object.defineProperty(exports, "STRENGTH_TEXTS", { enumerable: true, get: function () { return strengthTexts_1.STRENGTH_TEXTS; } });
Object.defineProperty(exports, "getStrengthText", { enumerable: true, get: function () { return strengthTexts_1.getStrengthText; } });
var dailyFortuneTexts_1 = require("./dailyFortuneTexts");
Object.defineProperty(exports, "DAILY_FORTUNE_TEXTS", { enumerable: true, get: function () { return dailyFortuneTexts_1.DAILY_FORTUNE_TEXTS; } });
Object.defineProperty(exports, "getDailyFortuneText", { enumerable: true, get: function () { return dailyFortuneTexts_1.getDailyFortuneText; } });
var monthlyFortuneTexts_1 = require("./monthlyFortuneTexts");
Object.defineProperty(exports, "MONTHLY_FORTUNE_TEXTS", { enumerable: true, get: function () { return monthlyFortuneTexts_1.MONTHLY_FORTUNE_TEXTS; } });
Object.defineProperty(exports, "getMonthlyFortuneText", { enumerable: true, get: function () { return monthlyFortuneTexts_1.getMonthlyFortuneText; } });
var yearlyFortuneTexts_1 = require("./yearlyFortuneTexts");
Object.defineProperty(exports, "YEARLY_FORTUNE_TEXTS", { enumerable: true, get: function () { return yearlyFortuneTexts_1.YEARLY_FORTUNE_TEXTS; } });
Object.defineProperty(exports, "getYearlyFortuneText", { enumerable: true, get: function () { return yearlyFortuneTexts_1.getYearlyFortuneText; } });
// ─── C2 상세 분석 모듈 re-export ────────────────────────
var detailedFiveElementTexts_1 = require("./detailedFiveElementTexts");
Object.defineProperty(exports, "generateDetailedFiveElementAnalysis", { enumerable: true, get: function () { return detailedFiveElementTexts_1.generateDetailedFiveElementAnalysis; } });
var detailedTenStarTexts_1 = require("./detailedTenStarTexts");
Object.defineProperty(exports, "generateDetailedTenStarAnalysis", { enumerable: true, get: function () { return detailedTenStarTexts_1.generateDetailedTenStarAnalysis; } });
// ─── 통합 해석 생성 함수 ────────────────────────────────
const dayStemTexts_2 = require("./dayStemTexts");
const fiveElementTexts_2 = require("./fiveElementTexts");
const tenStarTexts_2 = require("./tenStarTexts");
const strengthTexts_2 = require("./strengthTexts");
const dailyFortuneTexts_2 = require("./dailyFortuneTexts");
const monthlyFortuneTexts_2 = require("./monthlyFortuneTexts");
const yearlyFortuneTexts_2 = require("./yearlyFortuneTexts");
const detailedFiveElementTexts_2 = require("./detailedFiveElementTexts");
const detailedTenStarTexts_2 = require("./detailedTenStarTexts");
/**
 * 사주 계산 결과에서 전체 해석을 한번에 생성
 *
 * @param result calculateSaju()의 반환값 (또는 API 응답)
 * @returns InterpretationResult
 */
function generateInterpretation(result) {
    // ① 일간 성격
    let dayStem = null;
    const dayStemChar = result.dayStem?.char
        || result.fourPillars?.day?.heavenlyStem?.char
        || null;
    if (dayStemChar) {
        const text = (0, dayStemTexts_2.getDayStemText)(dayStemChar);
        if (text) {
            dayStem = {
                char: text.char,
                name: text.name,
                symbol: text.symbol,
                short: text.short,
                detail: text.detail,
                keywords: text.keywords,
            };
        }
    }
    // ② 오행 과다/부족
    let fiveElements = { excess: [], lack: [] };
    const counts = result.fiveElements?.counts
        || extractFiveElementCounts(result);
    if (counts) {
        fiveElements = (0, fiveElementTexts_2.analyzeFiveElementTexts)(counts);
    }
    // ③ 십성 분포
    let tenStars = { excess: [], lack: [], dominant: null };
    const starCount = result.tenStars?.starCount;
    if (starCount) {
        const analyzed = (0, tenStarTexts_2.analyzeTenStarTexts)(starCount);
        tenStars = {
            excess: analyzed.excess,
            lack: analyzed.lack,
            dominant: analyzed.dominant ? {
                star: analyzed.dominant.star,
                count: analyzed.dominant.count,
                short: analyzed.dominant.text.short,
                detail: analyzed.dominant.text.detail,
                keywords: analyzed.dominant.text.keywords,
            } : null,
        };
    }
    // ④ 신강/신약
    let strength = null;
    const strengthResult = result.strength?.result
        || result.strength?.strength
        || null;
    if (strengthResult) {
        const text = (0, strengthTexts_2.getStrengthText)(strengthResult);
        if (text) {
            strength = {
                result: text.result,
                symbol: text.symbol,
                short: text.short,
                detail: text.detail,
                career: text.career,
                relationship: text.relationship,
                wealth: text.wealth,
                health: text.health,
                advice: text.advice,
                keywords: text.keywords,
            };
        }
    }
    // ⑤ 오늘의 운세
    let dailyFortune = null;
    const dailyStemStar = result.fortune?.daily?.fortune?.tenStar?.stemStar
        || null;
    if (dailyStemStar) {
        const text = (0, dailyFortuneTexts_2.getDailyFortuneText)(dailyStemStar);
        if (text) {
            dailyFortune = {
                star: text.star,
                theme: text.theme,
                rating: text.rating,
                ratingEmoji: text.ratingEmoji,
                short: text.short,
                detail: text.detail,
                advice: text.advice,
                lucky: text.lucky,
                caution: text.caution,
            };
        }
    }
    // ⑥ 이번달 운세
    let monthlyFortune = null;
    const monthlyStemStar = result.fortune?.monthly?.fortune?.tenStar?.stemStar
        || null;
    if (monthlyStemStar) {
        const text = (0, monthlyFortuneTexts_2.getMonthlyFortuneText)(monthlyStemStar);
        if (text) {
            monthlyFortune = {
                star: text.star,
                theme: text.theme,
                rating: text.rating,
                ratingEmoji: text.ratingEmoji,
                short: text.short,
                detail: text.detail,
                advice: text.advice,
                focus: text.focus,
                caution: text.caution,
            };
        }
    }
    // ⑦ 올해의 운세
    let yearlyFortune = null;
    const yearlyStemStar = result.fortune?.yearly?.fortune?.tenStar?.stemStar
        || null;
    if (yearlyStemStar) {
        const text = (0, yearlyFortuneTexts_2.getYearlyFortuneText)(yearlyStemStar);
        if (text) {
            yearlyFortune = {
                star: text.star,
                theme: text.theme,
                rating: text.rating,
                ratingEmoji: text.ratingEmoji,
                short: text.short,
                detail: text.detail,
                advice: text.advice,
                outlook: text.outlook,
                keywords: text.keywords,
                caution: text.caution,
            };
        }
    }
    // ⑧ C2: 가중치 기반 오행 상세 분석
    let detailedFiveElements = null;
    if (result.fiveElements?.weightedElements && result.fiveElements?.details) {
        try {
            detailedFiveElements = (0, detailedFiveElementTexts_2.generateDetailedFiveElementAnalysis)(result.fiveElements);
        }
        catch {
            // 상세 분석 실패 시 무시 (기본 해석은 유지)
        }
    }
    // ⑨ C2: 위치별 십성 상세 분석
    let detailedTenStars = null;
    if (result.tenStars?.categoryCount && result.tenStars?.yearStem) {
        try {
            detailedTenStars = (0, detailedTenStarTexts_2.generateDetailedTenStarAnalysis)(result.tenStars);
        }
        catch {
            // 상세 분석 실패 시 무시
        }
    }
    return {
        dayStem,
        fiveElements,
        tenStars,
        strength,
        dailyFortune,
        monthlyFortune,
        yearlyFortune,
        detailedFiveElements,
        detailedTenStars,
    };
}
// ─── 헬퍼: 기둥에서 오행 카운트 추출 ────────────────────
function extractFiveElementCounts(result) {
    const counts = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
    const fp = result.fourPillars;
    if (!fp)
        return null;
    const pillars = [fp.year, fp.month, fp.day, fp.hour];
    for (const p of pillars) {
        if (!p)
            continue;
        const stemEl = p.heavenlyStem?.element;
        const branchEl = p.earthlyBranch?.element;
        if (stemEl && counts[stemEl] !== undefined)
            counts[stemEl]++;
        if (branchEl && counts[branchEl] !== undefined)
            counts[branchEl]++;
    }
    return counts;
}
// ─── 개별 조회 헬퍼 (API에서 편리하게 사용) ─────────────
/**
 * 일간 한자로 성격 해석 조회 (short만)
 */
function getShortDayStemInterpretation(dayStemChar) {
    const text = (0, dayStemTexts_2.getDayStemText)(dayStemChar);
    return text?.short || '';
}
/**
 * 신강/신약 결과로 해석 조회 (short만)
 */
function getShortStrengthInterpretation(strengthResult) {
    const text = (0, strengthTexts_2.getStrengthText)(strengthResult);
    return text?.short || '';
}
/**
 * 십성으로 오늘의 운세 조회 (short만)
 */
function getShortDailyFortune(stemStar) {
    const text = (0, dailyFortuneTexts_2.getDailyFortuneText)(stemStar);
    return text?.short || '';
}
/**
 * 십성으로 이번달 운세 조회 (short만)
 */
function getShortMonthlyFortune(stemStar) {
    const text = (0, monthlyFortuneTexts_2.getMonthlyFortuneText)(stemStar);
    return text?.short || '';
}
/**
 * 십성으로 올해 운세 조회 (short만)
 */
function getShortYearlyFortune(stemStar) {
    const text = (0, yearlyFortuneTexts_2.getYearlyFortuneText)(stemStar);
    return text?.short || '';
}
//# sourceMappingURL=index.js.map