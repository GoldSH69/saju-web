"use strict";
/**
 * saju-engine 진입점
 * 모든 공개 API를 여기서 re-export
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeCompatibility = exports.DAILY_FORTUNE_TEXTS = exports.STRENGTH_TEXTS = exports.TEN_STAR_TEXTS = exports.FIVE_ELEMENT_TEXTS = exports.DAY_STEM_TEXTS = exports.getShortDailyFortune = exports.getShortStrengthInterpretation = exports.getShortDayStemInterpretation = exports.getDailyFortuneText = exports.getStrengthText = exports.analyzeTenStarTexts = exports.getTenStarText = exports.analyzeFiveElementTexts = exports.getFiveElementText = exports.getDayStemText = exports.generateInterpretation = exports.checkFortuneGwiin = exports.analyzeGwiin = exports.isGwiin = exports.getGwiinBranches = exports.checkFortuneGongmang = exports.analyzeGongmang = exports.isGongmang = exports.calculateGongmangPair = exports.analyzeInteractions = exports.calculateYongsin = exports.calculateDailyFortune = exports.calculateMonthlyFortune = exports.calculateYearlyFortune = exports.calculateDaewoon = exports.calculateStrength = exports.getTenStarCategory = exports.getTenStar = exports.analyzeFiveElements = exports.getHiddenStems = exports.calculateMonthPillar = exports.calculateYearPillar = exports.calculateHourPillar = exports.getJulianDayNumber = exports.getHourBranchIndex = exports.adjustTime = exports.ELEMENT_KO = exports.BRANCHES = exports.STEMS = exports.toResultJson = exports.formatSajuResult = exports.calculateSaju = void 0;
// ─── 핵심 계산 함수 ─────────────────────────────────────
var calculate_1 = require("./saju/calculate");
Object.defineProperty(exports, "calculateSaju", { enumerable: true, get: function () { return calculate_1.calculateSaju; } });
Object.defineProperty(exports, "formatSajuResult", { enumerable: true, get: function () { return calculate_1.formatSajuResult; } });
Object.defineProperty(exports, "toResultJson", { enumerable: true, get: function () { return calculate_1.toResultJson; } });
// ─── 상수 (필요 시 프론트에서 참조) ─────────────────────
var constants_1 = require("./saju/constants");
Object.defineProperty(exports, "STEMS", { enumerable: true, get: function () { return constants_1.STEMS; } });
Object.defineProperty(exports, "BRANCHES", { enumerable: true, get: function () { return constants_1.BRANCHES; } });
Object.defineProperty(exports, "ELEMENT_KO", { enumerable: true, get: function () { return constants_1.ELEMENT_KO; } });
// ─── 개별 모듈 (고급 사용) ──────────────────────────────
var timeAdjustment_1 = require("./saju/timeAdjustment");
Object.defineProperty(exports, "adjustTime", { enumerable: true, get: function () { return timeAdjustment_1.adjustTime; } });
var hourBranch_1 = require("./saju/hourBranch");
Object.defineProperty(exports, "getHourBranchIndex", { enumerable: true, get: function () { return hourBranch_1.getHourBranchIndex; } });
var dayPillar_1 = require("./saju/dayPillar");
Object.defineProperty(exports, "getJulianDayNumber", { enumerable: true, get: function () { return dayPillar_1.getJulianDayNumber; } });
var hourPillar_1 = require("./saju/hourPillar");
Object.defineProperty(exports, "calculateHourPillar", { enumerable: true, get: function () { return hourPillar_1.calculateHourPillar; } });
var yearPillar_1 = require("./saju/yearPillar");
Object.defineProperty(exports, "calculateYearPillar", { enumerable: true, get: function () { return yearPillar_1.calculateYearPillar; } });
var monthPillar_1 = require("./saju/monthPillar");
Object.defineProperty(exports, "calculateMonthPillar", { enumerable: true, get: function () { return monthPillar_1.calculateMonthPillar; } });
var hiddenStems_1 = require("./saju/hiddenStems");
Object.defineProperty(exports, "getHiddenStems", { enumerable: true, get: function () { return hiddenStems_1.getHiddenStems; } });
var fiveElements_1 = require("./saju/fiveElements");
Object.defineProperty(exports, "analyzeFiveElements", { enumerable: true, get: function () { return fiveElements_1.analyzeFiveElements; } });
var tenStars_1 = require("./saju/tenStars");
Object.defineProperty(exports, "getTenStar", { enumerable: true, get: function () { return tenStars_1.getTenStar; } });
Object.defineProperty(exports, "getTenStarCategory", { enumerable: true, get: function () { return tenStars_1.getTenStarCategory; } });
var strengthScore_1 = require("./saju/strengthScore");
Object.defineProperty(exports, "calculateStrength", { enumerable: true, get: function () { return strengthScore_1.calculateStrength; } });
var daewoon_1 = require("./saju/daewoon");
Object.defineProperty(exports, "calculateDaewoon", { enumerable: true, get: function () { return daewoon_1.calculateDaewoon; } });
var fortune_1 = require("./saju/fortune");
Object.defineProperty(exports, "calculateYearlyFortune", { enumerable: true, get: function () { return fortune_1.calculateYearlyFortune; } });
Object.defineProperty(exports, "calculateMonthlyFortune", { enumerable: true, get: function () { return fortune_1.calculateMonthlyFortune; } });
Object.defineProperty(exports, "calculateDailyFortune", { enumerable: true, get: function () { return fortune_1.calculateDailyFortune; } });
var yongsin_1 = require("./saju/yongsin");
Object.defineProperty(exports, "calculateYongsin", { enumerable: true, get: function () { return yongsin_1.calculateYongsin; } });
var interactions_1 = require("./saju/interactions");
Object.defineProperty(exports, "analyzeInteractions", { enumerable: true, get: function () { return interactions_1.analyzeInteractions; } });
// ─── 공망(空亡) ─────────────────────────────────────────
var gongmang_1 = require("./saju/gongmang");
Object.defineProperty(exports, "calculateGongmangPair", { enumerable: true, get: function () { return gongmang_1.calculateGongmangPair; } });
Object.defineProperty(exports, "isGongmang", { enumerable: true, get: function () { return gongmang_1.isGongmang; } });
Object.defineProperty(exports, "analyzeGongmang", { enumerable: true, get: function () { return gongmang_1.analyzeGongmang; } });
Object.defineProperty(exports, "checkFortuneGongmang", { enumerable: true, get: function () { return gongmang_1.checkFortuneGongmang; } });
// ─── 천을귀인(天乙貴人) ─────────────────────────────────
var gwiin_1 = require("./saju/gwiin");
Object.defineProperty(exports, "getGwiinBranches", { enumerable: true, get: function () { return gwiin_1.getGwiinBranches; } });
Object.defineProperty(exports, "isGwiin", { enumerable: true, get: function () { return gwiin_1.isGwiin; } });
Object.defineProperty(exports, "analyzeGwiin", { enumerable: true, get: function () { return gwiin_1.analyzeGwiin; } });
Object.defineProperty(exports, "checkFortuneGwiin", { enumerable: true, get: function () { return gwiin_1.checkFortuneGwiin; } });
// ─── 해석 템플릿 ────────────────────────────────────────
var interpretations_1 = require("./saju/interpretations");
Object.defineProperty(exports, "generateInterpretation", { enumerable: true, get: function () { return interpretations_1.generateInterpretation; } });
Object.defineProperty(exports, "getDayStemText", { enumerable: true, get: function () { return interpretations_1.getDayStemText; } });
Object.defineProperty(exports, "getFiveElementText", { enumerable: true, get: function () { return interpretations_1.getFiveElementText; } });
Object.defineProperty(exports, "analyzeFiveElementTexts", { enumerable: true, get: function () { return interpretations_1.analyzeFiveElementTexts; } });
Object.defineProperty(exports, "getTenStarText", { enumerable: true, get: function () { return interpretations_1.getTenStarText; } });
Object.defineProperty(exports, "analyzeTenStarTexts", { enumerable: true, get: function () { return interpretations_1.analyzeTenStarTexts; } });
Object.defineProperty(exports, "getStrengthText", { enumerable: true, get: function () { return interpretations_1.getStrengthText; } });
Object.defineProperty(exports, "getDailyFortuneText", { enumerable: true, get: function () { return interpretations_1.getDailyFortuneText; } });
Object.defineProperty(exports, "getShortDayStemInterpretation", { enumerable: true, get: function () { return interpretations_1.getShortDayStemInterpretation; } });
Object.defineProperty(exports, "getShortStrengthInterpretation", { enumerable: true, get: function () { return interpretations_1.getShortStrengthInterpretation; } });
Object.defineProperty(exports, "getShortDailyFortune", { enumerable: true, get: function () { return interpretations_1.getShortDailyFortune; } });
Object.defineProperty(exports, "DAY_STEM_TEXTS", { enumerable: true, get: function () { return interpretations_1.DAY_STEM_TEXTS; } });
Object.defineProperty(exports, "FIVE_ELEMENT_TEXTS", { enumerable: true, get: function () { return interpretations_1.FIVE_ELEMENT_TEXTS; } });
Object.defineProperty(exports, "TEN_STAR_TEXTS", { enumerable: true, get: function () { return interpretations_1.TEN_STAR_TEXTS; } });
Object.defineProperty(exports, "STRENGTH_TEXTS", { enumerable: true, get: function () { return interpretations_1.STRENGTH_TEXTS; } });
Object.defineProperty(exports, "DAILY_FORTUNE_TEXTS", { enumerable: true, get: function () { return interpretations_1.DAILY_FORTUNE_TEXTS; } });
// ─── 궁합(宮合) ─────────────────────────────────────────
var compatibility_1 = require("./saju/compatibility");
Object.defineProperty(exports, "analyzeCompatibility", { enumerable: true, get: function () { return compatibility_1.analyzeCompatibility; } });
//# sourceMappingURL=index.js.map