"use strict";
/**
 * fortune.ts - 세운(歲運) / 월운(月運) / 일운(日運) 계산 모듈
 *
 * 세운: 특정 연도의 간지 → 원국과의 상호작용
 * 월운: 특정 월의 간지 → 원국과의 상호작용
 * 일운: 특정 일의 간지 → 원국과의 상호작용
 *
 * 충합형해 로직은 interactions.ts 공통 모듈 사용
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateYearlyFortune = calculateYearlyFortune;
exports.calculateYearlyFortuneRange = calculateYearlyFortuneRange;
exports.calculateMonthlyFortune = calculateMonthlyFortune;
exports.calculateMonthlyFortuneRange = calculateMonthlyFortuneRange;
exports.calculateDailyFortune = calculateDailyFortune;
exports.calculateDailyFortuneRange = calculateDailyFortuneRange;
exports.formatYearlyFortune = formatYearlyFortune;
exports.formatMonthlyFortune = formatMonthlyFortune;
exports.formatDailyFortune = formatDailyFortune;
exports.formatYearlyFortuneRange = formatYearlyFortuneRange;
exports.formatMonthlyFortuneRange = formatMonthlyFortuneRange;
const constants_1 = require("./constants");
const monthPillar_1 = require("./monthPillar");
const hiddenStems_1 = require("./hiddenStems");
const interactions_1 = require("./interactions");
// ─── 일주 계산 (내부용) ──────────────────────────────────
function calculateDayPillarInternal(year, month, day) {
    const baseDate = new Date('2024-01-01T00:00:00+09:00');
    const targetDate = new Date(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T00:00:00+09:00`);
    const diffDays = Math.round((targetDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
    let idx = diffDays % 60;
    if (idx < 0)
        idx += 60;
    return { stemIndex: idx % 10, branchIndex: idx % 12 };
}
// ─── FortuneEntry 생성 헬퍼 ──────────────────────────────
function makeFortuneEntry(stemIndex, branchIndex, dayStemIndex, fourPillars, label) {
    const stem = constants_1.STEMS[stemIndex];
    const branch = constants_1.BRANCHES[branchIndex];
    const hiddenStemsData = (0, hiddenStems_1.getHiddenStems)(branch.char);
    // 십성 (공통 모듈 사용)
    const stemStar = (0, interactions_1.getInteractionTenStar)(dayStemIndex, stemIndex);
    const branchMainHS = hiddenStemsData.find(h => h.role === 'jeonggi');
    const branchMainStar = branchMainHS
        ? (0, interactions_1.getInteractionTenStar)(dayStemIndex, branchMainHS.index)
        : stemStar;
    // 충합형해 (공통 모듈 사용)
    const interactions = (0, interactions_1.analyzeInteractions)(stemIndex, branchIndex, fourPillars, label);
    return {
        stemIndex,
        branchIndex,
        stem,
        branch,
        ganjiChar: `${stem.char}${branch.char}`,
        ganjiName: `${stem.name}${branch.name}`,
        hiddenStems: hiddenStemsData,
        tenStar: {
            stemStar: stemStar.star,
            stemCategory: stemStar.category,
            branchMainStar: branchMainStar.star,
            branchMainCategory: branchMainStar.category,
        },
        interactions,
    };
}
// ─── 세운(歲運) 계산 ─────────────────────────────────────
/**
 * 특정 연도의 세운을 계산합니다.
 */
function calculateYearlyFortune(targetYear, dayStemIndex, fourPillars) {
    let stemIndex = (targetYear - 4) % 10;
    if (stemIndex < 0)
        stemIndex += 10;
    let branchIndex = (targetYear - 4) % 12;
    if (branchIndex < 0)
        branchIndex += 12;
    const fortune = makeFortuneEntry(stemIndex, branchIndex, dayStemIndex, fourPillars, '세운');
    return {
        targetYear,
        fortune,
    };
}
/**
 * 기간 세운을 계산합니다 (여러 해).
 */
function calculateYearlyFortuneRange(startYear, endYear, dayStemIndex, fourPillars) {
    const fortunes = [];
    for (let y = startYear; y <= endYear; y++) {
        fortunes.push(calculateYearlyFortune(y, dayStemIndex, fourPillars));
    }
    return { startYear, endYear, fortunes };
}
// ─── 월운(月運) 계산 ─────────────────────────────────────
/**
 * 특정 연월의 월운을 계산합니다.
 */
function calculateMonthlyFortune(targetYear, targetMonth, dayStemIndex, fourPillars) {
    let yearStemIndex = (targetYear - 4) % 10;
    if (yearStemIndex < 0)
        yearStemIndex += 10;
    const monthResult = (0, monthPillar_1.calculateMonthPillar)(targetYear, targetMonth, 15, 12, 0, yearStemIndex);
    const stemIndex = monthResult.pillar.heavenlyStem.index;
    const branchIndex = monthResult.pillar.earthlyBranch.index;
    const fortune = makeFortuneEntry(stemIndex, branchIndex, dayStemIndex, fourPillars, '월운');
    return {
        targetYear,
        targetMonth,
        fortune,
        solarTermName: monthResult.solarTermName,
        solarTermDateTime: monthResult.solarTermDateTime,
    };
}
/**
 * 특정 연도의 12개월 월운을 계산합니다.
 */
function calculateMonthlyFortuneRange(targetYear, dayStemIndex, fourPillars) {
    const fortunes = [];
    for (let m = 1; m <= 12; m++) {
        fortunes.push(calculateMonthlyFortune(targetYear, m, dayStemIndex, fourPillars));
    }
    return { targetYear, fortunes };
}
// ─── 일운(日運) 계산 ─────────────────────────────────────
/**
 * 특정 날짜의 일운을 계산합니다.
 */
function calculateDailyFortune(targetYear, targetMonth, targetDay, dayStemIndex, fourPillars) {
    const dayResult = calculateDayPillarInternal(targetYear, targetMonth, targetDay);
    const fortune = makeFortuneEntry(dayResult.stemIndex, dayResult.branchIndex, dayStemIndex, fourPillars, '일운');
    return {
        targetYear,
        targetMonth,
        targetDay,
        fortune,
    };
}
/**
 * 특정 기간의 일운을 계산합니다 (날짜 범위).
 */
function calculateDailyFortuneRange(startYear, startMonth, startDay, days, dayStemIndex, fourPillars) {
    const results = [];
    const startDate = new Date(startYear, startMonth - 1, startDay);
    for (let i = 0; i < days; i++) {
        const d = new Date(startDate);
        d.setDate(d.getDate() + i);
        results.push(calculateDailyFortune(d.getFullYear(), d.getMonth() + 1, d.getDate(), dayStemIndex, fourPillars));
    }
    return results;
}
// ─── 포맷 출력 함수들 ────────────────────────────────────
function formatYearlyFortune(result) {
    const f = result.fortune;
    const stars = `천간:${f.tenStar.stemStar} 지지:${f.tenStar.branchMainStar}`;
    const inter = f.interactions.summary.length > 0
        ? f.interactions.summary.join(', ')
        : '없음';
    return `${result.targetYear}년 세운: ${f.ganjiChar}(${f.ganjiName}) [${stars}] | 충합형해: ${inter}`;
}
function formatMonthlyFortune(result) {
    const f = result.fortune;
    const stars = `천간:${f.tenStar.stemStar} 지지:${f.tenStar.branchMainStar}`;
    const inter = f.interactions.summary.length > 0
        ? f.interactions.summary.join(', ')
        : '없음';
    return `${result.targetYear}년 ${result.targetMonth}월 월운: ${f.ganjiChar}(${f.ganjiName}) [${stars}] [${result.solarTermName}] | 충합형해: ${inter}`;
}
function formatDailyFortune(result) {
    const f = result.fortune;
    const stars = `천간:${f.tenStar.stemStar} 지지:${f.tenStar.branchMainStar}`;
    const inter = f.interactions.summary.length > 0
        ? f.interactions.summary.join(', ')
        : '없음';
    return `${result.targetYear}-${String(result.targetMonth).padStart(2, '0')}-${String(result.targetDay).padStart(2, '0')} 일운: ${f.ganjiChar}(${f.ganjiName}) [${stars}] | 충합형해: ${inter}`;
}
/** 세운 범위 표 출력 */
function formatYearlyFortuneRange(result, dayStemChar) {
    const lines = [];
    lines.push('═══════════════════════════════════════════════════');
    lines.push(`  세운(歲運) 분석 — 일간: ${dayStemChar}`);
    lines.push('═══════════════════════════════════════════════════');
    lines.push('  연도   │ 간지  │ 십성(천간/지지)  │ 충합형해');
    lines.push('  ───────┼───────┼─────────────────┼──────────');
    for (const yr of result.fortunes) {
        const f = yr.fortune;
        const stars = `${f.tenStar.stemStar}/${f.tenStar.branchMainStar}`;
        const inter = f.interactions.summary.length > 0
            ? f.interactions.summary[0]
            : '-';
        lines.push(`  ${yr.targetYear}  │ ${f.ganjiChar}   │ ${stars.padEnd(15)} │ ${inter}`);
    }
    lines.push('═══════════════════════════════════════════════════');
    return lines.join('\n');
}
/** 월운 범위 표 출력 */
function formatMonthlyFortuneRange(result, dayStemChar) {
    const lines = [];
    lines.push('═══════════════════════════════════════════════════');
    lines.push(`  ${result.targetYear}년 월운(月運) 분석 — 일간: ${dayStemChar}`);
    lines.push('═══════════════════════════════════════════════════');
    lines.push('  월  │ 절기   │ 간지  │ 십성(천간/지지)  │ 충합형해');
    lines.push('  ────┼────────┼───────┼─────────────────┼──────────');
    for (const mr of result.fortunes) {
        const f = mr.fortune;
        const stars = `${f.tenStar.stemStar}/${f.tenStar.branchMainStar}`;
        const inter = f.interactions.summary.length > 0
            ? f.interactions.summary[0]
            : '-';
        lines.push(`  ${String(mr.targetMonth).padStart(2)}월 │ ${mr.solarTermName.padEnd(6)} │ ${f.ganjiChar}   │ ${stars.padEnd(15)} │ ${inter}`);
    }
    lines.push('═══════════════════════════════════════════════════');
    return lines.join('\n');
}
//# sourceMappingURL=fortune.js.map