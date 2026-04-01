"use strict";
/**
 * interactions.ts - 충합형해(沖合刑害) 공통 모듈
 *
 * 천간합, 지지충, 육합, 삼합, 방합, 형, 해 데이터와 분석 로직
 * → daewoon.ts, fortune.ts에서 공통 사용
 *
 * 추가로 십성(十星) 판단 함수도 포함 (대운/세운/월운/일운 공통)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BRANCH_HARMS_DATA = exports.BRANCH_PUNISHMENTS_DATA = exports.BRANCH_DIRECTION_COMBINES_DATA = exports.BRANCH_THREE_COMBINES_DATA = exports.BRANCH_SIX_COMBINES_DATA = exports.BRANCH_CLASHES_DATA = exports.STEM_COMBINATIONS_DATA = void 0;
exports.getInteractionTenStar = getInteractionTenStar;
exports.analyzeInteractions = analyzeInteractions;
const constants_1 = require("./constants");
// ═══════════════════════════════════════════════════════════
// 충합형해 데이터 테이블
// ═══════════════════════════════════════════════════════════
/** 천간합 (5쌍) */
exports.STEM_COMBINATIONS_DATA = [
    { stems: [0, 5], element: 'earth' }, // 甲己 → 土
    { stems: [1, 6], element: 'metal' }, // 乙庚 → 金
    { stems: [2, 7], element: 'water' }, // 丙辛 → 水
    { stems: [3, 8], element: 'wood' }, // 丁壬 → 木
    { stems: [4, 9], element: 'fire' }, // 戊癸 → 火
];
/** 지지충 (6쌍) */
exports.BRANCH_CLASHES_DATA = [
    [0, 6], // 子午
    [1, 7], // 丑未
    [2, 8], // 寅申
    [3, 9], // 卯酉
    [4, 10], // 辰戌
    [5, 11], // 巳亥
];
/** 지지육합 (6쌍) */
exports.BRANCH_SIX_COMBINES_DATA = [
    { branches: [0, 1], element: 'earth' }, // 子丑 → 土
    { branches: [2, 11], element: 'wood' }, // 寅亥 → 木
    { branches: [3, 10], element: 'fire' }, // 卯戌 → 火
    { branches: [4, 9], element: 'metal' }, // 辰酉 → 金
    { branches: [5, 8], element: 'water' }, // 巳申 → 水
    { branches: [6, 7], element: 'fire' }, // 午未 → 火
];
/** 지지삼합 (4조) */
exports.BRANCH_THREE_COMBINES_DATA = [
    { branches: [8, 0, 4], element: 'water' }, // 申子辰 → 水
    { branches: [2, 6, 10], element: 'fire' }, // 寅午戌 → 火
    { branches: [5, 9, 1], element: 'metal' }, // 巳酉丑 → 金
    { branches: [11, 3, 7], element: 'wood' }, // 亥卯未 → 木
];
/** 지지방합 (4조) */
exports.BRANCH_DIRECTION_COMBINES_DATA = [
    { branches: [2, 3, 4], element: 'wood' }, // 寅卯辰 → 木
    { branches: [5, 6, 7], element: 'fire' }, // 巳午未 → 火
    { branches: [8, 9, 10], element: 'metal' }, // 申酉戌 → 金
    { branches: [11, 0, 1], element: 'water' }, // 亥子丑 → 水
];
/** 지지형 */
exports.BRANCH_PUNISHMENTS_DATA = [
    { branches: [2, 5, 8], type: 'ungrateful', typeName: '무은지형' }, // 寅巳申
    { branches: [1, 10, 7], type: 'rude_trio', typeName: '무례지형' }, // 丑戌未
    { branches: [0, 3], type: 'rude', typeName: '무례지형' }, // 子卯
    { branches: [4, 4], type: 'self', typeName: '자형' }, // 辰辰
    { branches: [6, 6], type: 'self', typeName: '자형' }, // 午午
    { branches: [9, 9], type: 'self', typeName: '자형' }, // 酉酉
    { branches: [11, 11], type: 'self', typeName: '자형' }, // 亥亥
];
/** 지지해 (6쌍) */
exports.BRANCH_HARMS_DATA = [
    [0, 7], // 子未
    [1, 6], // 丑午
    [2, 5], // 寅巳
    [3, 4], // 卯辰
    [8, 11], // 申亥
    [9, 10], // 酉戌
];
// ═══════════════════════════════════════════════════════════
// 십성 판단 함수 (공통)
// ═══════════════════════════════════════════════════════════
/**
 * 일간(me) 기준으로 대상 천간(target)의 십성을 판단합니다.
 *
 * @param dayStemIndex    일간 인덱스 (0~9)
 * @param targetStemIndex 대상 천간 인덱스 (0~9)
 * @returns { star, category }
 */
function getInteractionTenStar(dayStemIndex, targetStemIndex) {
    const me = constants_1.STEMS[dayStemIndex];
    const target = constants_1.STEMS[targetStemIndex];
    const sameYinYang = me.yinYang === target.yinYang;
    // 같은 오행
    if (me.element === target.element) {
        return sameYinYang
            ? { star: '비견', category: '비화' }
            : { star: '겁재', category: '비화' };
    }
    // 내가 생하는 오행
    if (constants_1.GENERATES[me.element] === target.element) {
        return sameYinYang
            ? { star: '식신', category: '식상' }
            : { star: '상관', category: '식상' };
    }
    // 내가 극하는 오행
    if (constants_1.OVERCOMES[me.element] === target.element) {
        return sameYinYang
            ? { star: '편재', category: '재성' }
            : { star: '정재', category: '재성' };
    }
    // 나를 생하는 오행
    if (constants_1.GENERATES[target.element] === me.element) {
        return sameYinYang
            ? { star: '편인', category: '인성' }
            : { star: '정인', category: '인성' };
    }
    // 나를 극하는 오행
    if (constants_1.OVERCOMES[target.element] === me.element) {
        return sameYinYang
            ? { star: '편관', category: '관성' }
            : { star: '정관', category: '관성' };
    }
    // fallback (이론상 도달 불가)
    return { star: '비견', category: '비화' };
}
// ═══════════════════════════════════════════════════════════
// 충합형해 분석 함수 (공통)
// ═══════════════════════════════════════════════════════════
/**
 * 특정 간지(운)와 원국 4주 사이의 충합형해를 분석합니다.
 *
 * @param targetStemIndex   운의 천간 인덱스
 * @param targetBranchIndex 운의 지지 인덱스
 * @param fourPillars       원국 4주
 * @param targetLabel       라벨 (예: '대운', '세운', '월운', '일운')
 * @returns InteractionResult
 */
function analyzeInteractions(targetStemIndex, targetBranchIndex, fourPillars, targetLabel = '운') {
    const stemCombinations = [];
    const branchClashes = [];
    const branchCombines = [];
    const branchPunishments = [];
    const branchHarms = [];
    const summary = [];
    // 원국의 천간/지지 인덱스 수집
    const pillarNames = ['년주', '월주', '일주', '시주'];
    const pillars = [fourPillars.year, fourPillars.month, fourPillars.day];
    if (fourPillars.hour)
        pillars.push(fourPillars.hour);
    const origStems = [];
    const origBranches = [];
    pillars.forEach((p, i) => {
        origStems.push({ index: p.heavenlyStem.index, name: pillarNames[i] });
        origBranches.push({ index: p.earthlyBranch.index, name: pillarNames[i] });
    });
    // ① 천간합 검사
    for (const combo of exports.STEM_COMBINATIONS_DATA) {
        for (const orig of origStems) {
            if ((targetStemIndex === combo.stems[0] && orig.index === combo.stems[1]) ||
                (targetStemIndex === combo.stems[1] && orig.index === combo.stems[0])) {
                stemCombinations.push({
                    stem1: constants_1.STEMS[targetStemIndex].char,
                    stem2: constants_1.STEMS[orig.index].char,
                    resultElement: combo.element,
                    resultElementKo: constants_1.ELEMENT_KO[combo.element] || combo.element,
                });
                summary.push(`천간합: ${targetLabel} ${constants_1.STEMS[targetStemIndex].char} + ${orig.name} ${constants_1.STEMS[orig.index].char} → ${constants_1.ELEMENT_KO[combo.element]}`);
            }
        }
    }
    // ② 지지충 검사
    for (const clash of exports.BRANCH_CLASHES_DATA) {
        for (const orig of origBranches) {
            if ((targetBranchIndex === clash[0] && orig.index === clash[1]) ||
                (targetBranchIndex === clash[1] && orig.index === clash[0])) {
                branchClashes.push({
                    branch1: constants_1.BRANCHES[targetBranchIndex].char,
                    branch2: constants_1.BRANCHES[orig.index].char,
                    type: 'clash',
                });
                summary.push(`지지충: ${targetLabel} ${constants_1.BRANCHES[targetBranchIndex].char} ↔ ${orig.name} ${constants_1.BRANCHES[orig.index].char}`);
            }
        }
    }
    // ③ 지지육합 검사
    for (const combine of exports.BRANCH_SIX_COMBINES_DATA) {
        for (const orig of origBranches) {
            if ((targetBranchIndex === combine.branches[0] && orig.index === combine.branches[1]) ||
                (targetBranchIndex === combine.branches[1] && orig.index === combine.branches[0])) {
                branchCombines.push({
                    branch1: constants_1.BRANCHES[targetBranchIndex].char,
                    branch2: constants_1.BRANCHES[orig.index].char,
                    type: 'six',
                    resultElement: combine.element,
                    resultElementKo: constants_1.ELEMENT_KO[combine.element] || combine.element,
                });
                summary.push(`육합: ${targetLabel} ${constants_1.BRANCHES[targetBranchIndex].char} + ${orig.name} ${constants_1.BRANCHES[orig.index].char} → ${constants_1.ELEMENT_KO[combine.element]}`);
            }
        }
    }
    // ④ 지지삼합 검사 (반합 포함)
    const allBranches = [targetBranchIndex, ...origBranches.map(o => o.index)];
    for (const trio of exports.BRANCH_THREE_COMBINES_DATA) {
        const matchCount = trio.branches.filter(b => allBranches.includes(b)).length;
        const targetInTrio = trio.branches.includes(targetBranchIndex);
        if (matchCount >= 3 && targetInTrio) {
            branchCombines.push({
                branch1: constants_1.BRANCHES[targetBranchIndex].char,
                branch2: trio.branches.map(b => constants_1.BRANCHES[b].char).join(''),
                type: 'three',
                resultElement: trio.element,
                resultElementKo: constants_1.ELEMENT_KO[trio.element] || trio.element,
            });
            summary.push(`삼합: ${trio.branches.map(b => constants_1.BRANCHES[b].char).join('')} → ${constants_1.ELEMENT_KO[trio.element]}`);
        }
        else if (matchCount === 2 && targetInTrio) {
            const matched = trio.branches.filter(b => allBranches.includes(b));
            branchCombines.push({
                branch1: constants_1.BRANCHES[targetBranchIndex].char,
                branch2: matched.map(b => constants_1.BRANCHES[b].char).join(''),
                type: 'three',
                resultElement: trio.element,
                resultElementKo: constants_1.ELEMENT_KO[trio.element] || trio.element,
            });
            summary.push(`반합: ${matched.map(b => constants_1.BRANCHES[b].char).join('')} → ${constants_1.ELEMENT_KO[trio.element]} (반합)`);
        }
    }
    // ⑤ 지지방합 검사
    for (const dir of exports.BRANCH_DIRECTION_COMBINES_DATA) {
        const matchCount = dir.branches.filter(b => allBranches.includes(b)).length;
        const targetInDir = dir.branches.includes(targetBranchIndex);
        if (matchCount >= 3 && targetInDir) {
            branchCombines.push({
                branch1: constants_1.BRANCHES[targetBranchIndex].char,
                branch2: dir.branches.map(b => constants_1.BRANCHES[b].char).join(''),
                type: 'direction',
                resultElement: dir.element,
                resultElementKo: constants_1.ELEMENT_KO[dir.element] || dir.element,
            });
            summary.push(`방합: ${dir.branches.map(b => constants_1.BRANCHES[b].char).join('')} → ${constants_1.ELEMENT_KO[dir.element]}`);
        }
    }
    // ⑥ 지지형 검사
    for (const pun of exports.BRANCH_PUNISHMENTS_DATA) {
        for (const orig of origBranches) {
            if (pun.type === 'self') {
                // 자형: 같은 지지끼리
                if (targetBranchIndex === pun.branches[0] && orig.index === pun.branches[0]) {
                    branchPunishments.push({
                        branch1: constants_1.BRANCHES[targetBranchIndex].char,
                        branch2: constants_1.BRANCHES[orig.index].char,
                        type: pun.type,
                        typeName: pun.typeName,
                    });
                    summary.push(`자형: ${targetLabel} ${constants_1.BRANCHES[targetBranchIndex].char} ↔ ${orig.name} ${constants_1.BRANCHES[orig.index].char}`);
                }
            }
            else if (pun.branches.length === 2) {
                // 子卯 형
                if ((targetBranchIndex === pun.branches[0] && orig.index === pun.branches[1]) ||
                    (targetBranchIndex === pun.branches[1] && orig.index === pun.branches[0])) {
                    branchPunishments.push({
                        branch1: constants_1.BRANCHES[targetBranchIndex].char,
                        branch2: constants_1.BRANCHES[orig.index].char,
                        type: pun.type,
                        typeName: pun.typeName,
                    });
                    summary.push(`${pun.typeName}: ${targetLabel} ${constants_1.BRANCHES[targetBranchIndex].char} ↔ ${orig.name} ${constants_1.BRANCHES[orig.index].char}`);
                }
            }
            else if (pun.branches.length === 3) {
                // 삼형살: 대상 지지가 삼형 중 하나이고, 원국에 나머지가 있는 경우
                if (pun.branches.includes(targetBranchIndex)) {
                    const others = pun.branches.filter(b => b !== targetBranchIndex);
                    for (const other of others) {
                        if (origBranches.some(o => o.index === other)) {
                            const origName = origBranches.find(o => o.index === other)?.name || '';
                            branchPunishments.push({
                                branch1: constants_1.BRANCHES[targetBranchIndex].char,
                                branch2: constants_1.BRANCHES[other].char,
                                type: pun.type,
                                typeName: pun.typeName,
                            });
                            summary.push(`${pun.typeName}: ${targetLabel} ${constants_1.BRANCHES[targetBranchIndex].char} ↔ ${origName} ${constants_1.BRANCHES[other].char}`);
                        }
                    }
                }
            }
        }
    }
    // ⑦ 지지해 검사
    for (const harm of exports.BRANCH_HARMS_DATA) {
        for (const orig of origBranches) {
            if ((targetBranchIndex === harm[0] && orig.index === harm[1]) ||
                (targetBranchIndex === harm[1] && orig.index === harm[0])) {
                branchHarms.push({
                    branch1: constants_1.BRANCHES[targetBranchIndex].char,
                    branch2: constants_1.BRANCHES[orig.index].char,
                });
                summary.push(`지지해: ${targetLabel} ${constants_1.BRANCHES[targetBranchIndex].char} ↔ ${orig.name} ${constants_1.BRANCHES[orig.index].char}`);
            }
        }
    }
    return {
        stemCombinations,
        branchClashes,
        branchCombines,
        branchPunishments,
        branchHarms,
        summary,
    };
}
//# sourceMappingURL=interactions.js.map