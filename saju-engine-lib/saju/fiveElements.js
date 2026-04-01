"use strict";
// src/saju/fiveElements.ts
// 오행(五行) 분포 계산 모듈
//
// 천간/지지/지장간의 오행 분포를 분석
// 신강/신약, 용신 판단의 기초 데이터
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStemElement = getStemElement;
exports.getBranchElement = getBranchElement;
exports.analyzeFiveElements = analyzeFiveElements;
exports.formatFiveElements = formatFiveElements;
const hiddenStems_1 = require("./hiddenStems");
// ============================================================
// 천간 → 오행/음양 매핑
// ============================================================
const STEM_ELEMENT_MAP = {
    '甲': { element: '木', elementName: '목', yinYang: '양' },
    '乙': { element: '木', elementName: '목', yinYang: '음' },
    '丙': { element: '火', elementName: '화', yinYang: '양' },
    '丁': { element: '火', elementName: '화', yinYang: '음' },
    '戊': { element: '土', elementName: '토', yinYang: '양' },
    '己': { element: '土', elementName: '토', yinYang: '음' },
    '庚': { element: '金', elementName: '금', yinYang: '양' },
    '辛': { element: '金', elementName: '금', yinYang: '음' },
    '壬': { element: '水', elementName: '수', yinYang: '양' },
    '癸': { element: '水', elementName: '수', yinYang: '음' },
};
// ============================================================
// 지지 → 오행/음양 매핑
// ============================================================
const BRANCH_ELEMENT_MAP = {
    '子': { element: '水', elementName: '수', yinYang: '양' },
    '丑': { element: '土', elementName: '토', yinYang: '음' },
    '寅': { element: '木', elementName: '목', yinYang: '양' },
    '卯': { element: '木', elementName: '목', yinYang: '음' },
    '辰': { element: '土', elementName: '토', yinYang: '양' },
    '巳': { element: '火', elementName: '화', yinYang: '양' },
    '午': { element: '火', elementName: '화', yinYang: '음' },
    '未': { element: '土', elementName: '토', yinYang: '음' },
    '申': { element: '金', elementName: '금', yinYang: '양' },
    '酉': { element: '金', elementName: '금', yinYang: '음' },
    '戌': { element: '土', elementName: '토', yinYang: '양' },
    '亥': { element: '水', elementName: '수', yinYang: '음' },
};
// ============================================================
// 공개 함수
// ============================================================
/**
 * 천간의 오행 정보 반환
 */
function getStemElement(stemChar) {
    const info = STEM_ELEMENT_MAP[stemChar];
    if (!info)
        throw new Error(`알 수 없는 천간: ${stemChar}`);
    return info;
}
/**
 * 지지의 오행 정보 반환
 */
function getBranchElement(branchChar) {
    const info = BRANCH_ELEMENT_MAP[branchChar];
    if (!info)
        throw new Error(`알 수 없는 지지: ${branchChar}`);
    return info;
}
/**
 * 빈 오행 카운트 생성
 */
function emptyCount() {
    return { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
}
/**
 * 사주 전체 오행 분포 분석
 *
 * @param stemChars 천간 4개 [년간, 월간, 일간, 시간]
 * @param branchChars 지지 4개 [년지, 월지, 일지, 시지]
 * @returns 오행 분석 결과
 *
 * @example
 * analyzeFiveElements(
 *   ['甲', '丙', '戊', '庚'],  // 천간
 *   ['辰', '午', '子', '寅']   // 지지
 * )
 */
function analyzeFiveElements(stemChars, branchChars) {
    const positions = ['년간', '월간', '일간', '시간'];
    const branchPositions = ['년지', '월지', '일지', '시지'];
    const stemElements = emptyCount();
    const branchElements = emptyCount();
    const totalElements = emptyCount();
    const weightedElements = emptyCount();
    const details = [];
    // ──────────── 1. 표면 천간 분석 ────────────
    for (let i = 0; i < stemChars.length; i++) {
        const info = getStemElement(stemChars[i]);
        stemElements[info.element]++;
        totalElements[info.element]++;
        // 표면 천간 가중치: 1.0 (30일 기준으로 환산하지 않음)
        weightedElements[info.element] += 30;
        details.push({
            position: positions[i],
            char: stemChars[i],
            element: info.element,
            yinYang: info.yinYang,
            isHidden: false,
        });
    }
    // ──────────── 2. 지지 오행 분석 ────────────
    for (let i = 0; i < branchChars.length; i++) {
        const info = getBranchElement(branchChars[i]);
        branchElements[info.element]++;
        details.push({
            position: branchPositions[i],
            char: branchChars[i],
            element: info.element,
            yinYang: info.yinYang,
            isHidden: false,
        });
    }
    // ──────────── 3. 지장간 분석 ────────────
    for (let i = 0; i < branchChars.length; i++) {
        const hiddenStems = (0, hiddenStems_1.getHiddenStems)(branchChars[i]);
        for (const hidden of hiddenStems) {
            const info = getStemElement(hidden.char);
            totalElements[info.element]++;
            weightedElements[info.element] += hidden.days;
            details.push({
                position: `${branchPositions[i]}→${hidden.roleName}`,
                char: hidden.char,
                element: info.element,
                yinYang: info.yinYang,
                isHidden: true,
                hiddenRole: hidden.roleName,
                hiddenDays: hidden.days,
            });
        }
    }
    // ──────────── 4. 분석 ────────────
    const ALL_ELEMENTS = ['木', '火', '土', '金', '水'];
    // 가장 강한/약한 오행 (가중치 기준)
    let strongest = '木';
    let weakest = '木';
    let maxVal = -1;
    let minVal = Infinity;
    for (const el of ALL_ELEMENTS) {
        if (weightedElements[el] > maxVal) {
            maxVal = weightedElements[el];
            strongest = el;
        }
        if (weightedElements[el] < minVal) {
            minVal = weightedElements[el];
            weakest = el;
        }
    }
    // 없는 오행
    const missing = ALL_ELEMENTS.filter(el => totalElements[el] === 0);
    // 일간 오행
    const dayStemInfo = getStemElement(stemChars[2]);
    return {
        stemElements,
        branchElements,
        totalElements,
        weightedElements,
        strongest,
        weakest,
        missing,
        dayStemElement: dayStemInfo.element,
        dayStemYinYang: dayStemInfo.yinYang,
        details,
    };
}
/**
 * 오행 분포를 보기 좋게 출력 (디버그용)
 */
function formatFiveElements(analysis) {
    const lines = [];
    const ELEMENT_NAMES = {
        '木': '목(木)', '火': '화(火)', '土': '토(土)', '金': '금(金)', '水': '수(水)',
    };
    lines.push('┌──────────────────────────────────────┐');
    lines.push('│          오행(五行) 분포 분석          │');
    lines.push('├──────────────────────────────────────┤');
    // 표면 천간
    lines.push('│ [표면 천간]                           │');
    for (const el of ['木', '火', '土', '金', '水']) {
        const count = analysis.stemElements[el];
        const bar = '■'.repeat(count) + '□'.repeat(4 - count);
        lines.push(`│   ${ELEMENT_NAMES[el]}: ${bar} ${count}개`.padEnd(39) + '│');
    }
    lines.push('├──────────────────────────────────────┤');
    // 전체 (지장간 포함)
    lines.push('│ [전체 - 지장간 포함]                   │');
    for (const el of ['木', '火', '土', '金', '水']) {
        const count = analysis.totalElements[el];
        const weight = analysis.weightedElements[el];
        lines.push(`│   ${ELEMENT_NAMES[el]}: ${String(count).padStart(2)}개 (가중치: ${String(weight).padStart(3)})`.padEnd(39) + '│');
    }
    lines.push('├──────────────────────────────────────┤');
    // 요약
    lines.push(`│ 일간: ${analysis.dayStemYinYang}${ELEMENT_NAMES[analysis.dayStemElement]}`.padEnd(39) + '│');
    lines.push(`│ 최강: ${ELEMENT_NAMES[analysis.strongest]}`.padEnd(39) + '│');
    lines.push(`│ 최약: ${ELEMENT_NAMES[analysis.weakest]}`.padEnd(39) + '│');
    if (analysis.missing.length > 0) {
        const missingStr = analysis.missing.map(el => ELEMENT_NAMES[el]).join(', ');
        lines.push(`│ 부재: ${missingStr}`.padEnd(39) + '│');
    }
    else {
        lines.push('│ 부재: 없음 (오행 균형)'.padEnd(39) + '│');
    }
    lines.push('└──────────────────────────────────────┘');
    return lines.join('\n');
}
//# sourceMappingURL=fiveElements.js.map