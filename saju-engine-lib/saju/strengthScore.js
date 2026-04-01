"use strict";
// src/saju/strengthScore.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateStrength = calculateStrength;
const constants_1 = require("./constants");
const hiddenStems_1 = require("./hiddenStems");
const tenStars_1 = require("./tenStars");
// ============================================================
// 가중치 정의
// ============================================================
/** 위치별 기본 가중치 */
const POSITION_WEIGHTS = {
    // 천간
    yearStem: 1.0,
    monthStem: 1.2, // 월간은 약간 높음
    hourStem: 1.0,
    // 지장간 - 정기
    yearMain: 1.2,
    monthMain: 2.5, // 월지 정기 = 득령, 최고 가중치
    dayMain: 1.8, // 일지 정기 = 득지, 높은 가중치
    hourMain: 1.2,
    // 지장간 - 중기
    yearMiddle: 0.6,
    monthMiddle: 1.0,
    dayMiddle: 0.8,
    hourMiddle: 0.6,
    // 지장간 - 여기
    yearResidual: 0.4,
    monthResidual: 0.6,
    dayResidual: 0.5,
    hourResidual: 0.4,
};
/** 지장간 role → 가중치 키 접미사 매핑 */
function getRoleWeightKey(role) {
    switch (role) {
        case 'jeonggi': return 'Main';
        case 'junggi': return 'Middle';
        case 'yeogi': return 'Residual';
        default: return 'Main';
    }
}
// ============================================================
// STEMS 룩업
// ============================================================
const STEM_MAP = new Map(constants_1.STEMS.map(s => [s.char, s]));
function getStemElement(char) {
    const info = STEM_MAP.get(char);
    if (!info)
        throw new Error(`유효하지 않은 천간: ${char}`);
    return info.element;
}
function getStemElementKo(char) {
    const info = STEM_MAP.get(char);
    if (!info)
        throw new Error(`유효하지 않은 천간: ${char}`);
    return info.elementKo;
}
function getStemName(char) {
    const info = STEM_MAP.get(char);
    return info ? info.name : char;
}
// ============================================================
// 돕는 세력 판단
// ============================================================
/**
 * 해당 십성 카테고리가 일간을 돕는지 판단
 * 비화(비견/겁재) + 인성(편인/정인) = 돕는 세력
 */
function isSupporting(category) {
    return category === '비화' || category === '인성';
}
// ============================================================
// 득령 판단
// ============================================================
/**
 * 월지 정기의 오행이 일간을 돕는지 판단
 */
function checkDeukryeong(dayStem, monthBranch) {
    const hidden = (0, hiddenStems_1.getHiddenStems)(monthBranch);
    const mainEntry = hidden.find(h => h.role === 'jeonggi');
    if (!mainEntry) {
        return { deukryeong: false, mainStem: '', mainElement: '' };
    }
    const mainStem = mainEntry.char;
    const mainElement = getStemElement(mainStem);
    const dayElement = getStemElement(dayStem);
    // 같은 오행이거나, 월지 정기가 일간을 생하면 득령
    const sameElement = mainElement === dayElement;
    const generates = constants_1.GENERATES[mainElement] === dayElement;
    return {
        deukryeong: sameElement || generates,
        mainStem,
        mainElement
    };
}
// ============================================================
// 메인 함수: 신강/신약 계산
// ============================================================
function calculateStrength(yearStem, monthStem, dayStem, hourStem, yearBranch, monthBranch, dayBranch, hourBranch) {
    const details = [];
    const dayElement = getStemElement(dayStem);
    // === 1. 천간 평가 (일간 제외) ===
    function evaluateStem(stemChar, positionName, weightKey) {
        const tenStar = (0, tenStars_1.getTenStar)(dayStem, stemChar);
        const category = (0, tenStars_1.getTenStarCategory)(tenStar);
        const supporting = isSupporting(category);
        const weight = POSITION_WEIGHTS[weightKey];
        const score = supporting ? weight : -weight;
        details.push({
            position: positionName,
            stem: stemChar,
            stemName: getStemName(stemChar),
            tenStar,
            category,
            isSupporting: supporting,
            weight,
            score
        });
    }
    evaluateStem(yearStem, '년간', 'yearStem');
    evaluateStem(monthStem, '월간', 'monthStem');
    if (hourStem) {
        evaluateStem(hourStem, '시간', 'hourStem');
    }
    // === 2. 지장간 평가 ===
    function evaluateBranchHidden(branchChar, pillarPrefix) {
        const hidden = (0, hiddenStems_1.getHiddenStems)(branchChar);
        for (const h of hidden) {
            const roleKey = getRoleWeightKey(h.role);
            const weightKey = `${pillarPrefix}${roleKey}`;
            const weight = POSITION_WEIGHTS[weightKey] || 0.5;
            const tenStar = (0, tenStars_1.getTenStar)(dayStem, h.char);
            const category = (0, tenStars_1.getTenStarCategory)(tenStar);
            const supporting = isSupporting(category);
            const score = supporting ? weight : -weight;
            details.push({
                position: `${pillarPrefix === 'year' ? '년' : pillarPrefix === 'month' ? '월' : pillarPrefix === 'day' ? '일' : '시'}지(${branchChar}) ${h.roleName}`,
                stem: h.char,
                stemName: getStemName(h.char),
                tenStar,
                category,
                isSupporting: supporting,
                weight,
                score
            });
        }
    }
    evaluateBranchHidden(yearBranch, 'year');
    evaluateBranchHidden(monthBranch, 'month');
    evaluateBranchHidden(dayBranch, 'day');
    if (hourBranch) {
        evaluateBranchHidden(hourBranch, 'hour');
    }
    // === 3. 점수 집계 ===
    let supportScore = 0;
    let restrainScore = 0;
    for (const d of details) {
        if (d.isSupporting) {
            supportScore += d.weight;
        }
        else {
            restrainScore += d.weight;
        }
    }
    const totalScore = supportScore - restrainScore;
    // === 4. 득령 판단 ===
    const deukryeongResult = checkDeukryeong(dayStem, monthBranch);
    // === 5. 신강/신약 판정 ===
    // 총점 기준 + 득령 여부를 종합
    const totalWeight = supportScore + restrainScore;
    const ratio = totalWeight > 0 ? supportScore / totalWeight : 0.5;
    // -100 ~ +100 스케일로 변환
    const strengthLevel = Math.round((ratio - 0.5) * 200);
    let strength;
    if (strengthLevel > 15) {
        strength = '신강';
    }
    else if (strengthLevel < -15) {
        strength = '신약';
    }
    else {
        strength = '중화';
    }
    // === 6. 요약 생성 ===
    const summary = generateSummary(dayStem, strength, deukryeongResult.deukryeong, ratio, supportScore, restrainScore);
    return {
        dayStem,
        dayStemName: getStemName(dayStem),
        dayElement,
        dayElementKo: getStemElementKo(dayStem),
        deukryeong: deukryeongResult.deukryeong,
        monthBranch,
        monthMainStem: deukryeongResult.mainStem,
        monthMainElement: deukryeongResult.mainElement,
        supportScore: Math.round(supportScore * 100) / 100,
        restrainScore: Math.round(restrainScore * 100) / 100,
        totalScore: Math.round(totalScore * 100) / 100,
        strength,
        strengthLevel,
        details,
        summary
    };
}
// ============================================================
// 요약 텍스트 생성
// ============================================================
function generateSummary(dayStem, strength, deukryeong, ratio, supportScore, restrainScore) {
    const name = getStemName(dayStem);
    const elementKo = getStemElementKo(dayStem);
    const pct = Math.round(ratio * 100);
    let desc = `일간 ${dayStem}(${name}, ${elementKo})은 `;
    if (deukryeong) {
        desc += '월지의 기운을 얻어(득령) ';
    }
    else {
        desc += '월지의 기운을 얻지 못해(실령) ';
    }
    desc += `${strength}합니다. `;
    desc += `(돕는 힘 ${supportScore.toFixed(1)} : 약화 힘 ${restrainScore.toFixed(1)}, `;
    desc += `비율 ${pct}%)`;
    return desc;
}
//# sourceMappingURL=strengthScore.js.map