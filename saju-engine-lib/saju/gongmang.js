"use strict";
/**
 * 공망(空亡) 계산 모듈
 *
 * 60갑자의 순(旬)에서 빠지는 지지 2개를 공망으로 판단
 * - 년공망: 년주 기준 → 사회적/외부적 영향
 * - 일공망: 일주 기준 → 개인적/내면적 영향 (실전에서 더 중요)
 *
 * ┌────────┬──────────────────────────────┬──────────┐
 * │ 순(旬)  │ 간지 10개                     │ 공망 2개  │
 * ├────────┼──────────────────────────────┼──────────┤
 * │ 甲子旬  │ 甲子 乙丑 丙寅 丁卯 戊辰 … 癸酉 │ 戌, 亥   │
 * │ 甲戌旬  │ 甲戌 乙亥 丙子 丁丑 戊寅 … 癸未 │ 申, 酉   │
 * │ 甲申旬  │ 甲申 乙酉 丙戌 丁亥 戊子 … 癸巳 │ 午, 未   │
 * │ 甲午旬  │ 甲午 乙未 丙申 丁酉 戊戌 … 癸卯 │ 辰, 巳   │
 * │ 甲辰旬  │ 甲辰 乙巳 丙午 丁未 戊申 … 癸丑 │ 寅, 卯   │
 * │ 甲寅旬  │ 甲寅 乙卯 丙辰 丁巳 戊午 … 癸亥 │ 子, 丑   │
 * └────────┴──────────────────────────────┴──────────┘
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateGongmangPair = calculateGongmangPair;
exports.isGongmang = isGongmang;
exports.analyzeGongmang = analyzeGongmang;
exports.checkFortuneGongmang = checkFortuneGongmang;
const constants_1 = require("./constants");
// ─── 순(旬) 이름 매핑 ──────────────────────────────────
const SUN_NAMES = {
    0: '甲子旬', 2: '甲寅旬', 4: '甲辰旬',
    6: '甲午旬', 8: '甲申旬', 10: '甲戌旬',
};
const SUN_NAMES_KO = {
    0: '갑자순', 2: '갑인순', 4: '갑진순',
    6: '갑오순', 8: '갑신순', 10: '갑술순',
};
// ─── 해공(解空) 판단용 충/합 데이터 ────────────────────
/** 지지 충(冲) 상대: index → 충 상대 index (i+6)%12 */
function getClashPartner(branchIndex) {
    return (branchIndex + 6) % 12;
}
/** 지지 육합(六合) 상대 */
const SIX_COMBINE_PARTNER = {
    0: 1, 1: 0, // 子丑
    2: 11, 11: 2, // 寅亥
    3: 10, 10: 3, // 卯戌
    4: 9, 9: 4, // 辰酉
    5: 8, 8: 5, // 巳申
    6: 7, 7: 6, // 午未
};
// ─── 핵심 계산 함수 ────────────────────────────────────
/**
 * 주어진 기둥(천간+지지)의 공망 지지 2개를 계산
 *
 * 공식: startBranch = (branchIndex - stemIndex + 12) % 12
 *       공망1 = (startBranch + 10) % 12
 *       공망2 = (startBranch + 11) % 12
 *
 * @param stemIndex 천간 인덱스 (0~9)
 * @param branchIndex 지지 인덱스 (0~11)
 */
function calculateGongmangPair(stemIndex, branchIndex) {
    const startBranch = ((branchIndex - stemIndex) % 12 + 12) % 12;
    const gm1 = (startBranch + 10) % 12;
    const gm2 = (startBranch + 11) % 12;
    return {
        sunName: SUN_NAMES[startBranch] || '',
        sunNameKo: SUN_NAMES_KO[startBranch] || '',
        indices: [gm1, gm2],
        chars: [constants_1.BRANCHES[gm1].char, constants_1.BRANCHES[gm2].char],
        names: [constants_1.BRANCHES[gm1].name, constants_1.BRANCHES[gm2].name],
    };
}
/**
 * 특정 지지가 주어진 기둥의 공망인지 확인
 */
function isGongmang(stemIndex, branchIndex, targetBranchIndex) {
    const pair = calculateGongmangPair(stemIndex, branchIndex);
    return pair.indices[0] === targetBranchIndex || pair.indices[1] === targetBranchIndex;
}
/**
 * 원국 전체 공망 분석
 *
 * @param yearStemIndex 년주 천간 인덱스
 * @param yearBranchIndex 년주 지지 인덱스
 * @param monthBranchIndex 월주 지지 인덱스
 * @param dayStemIndex 일주 천간 인덱스
 * @param dayBranchIndex 일주 지지 인덱스
 * @param hourBranchIndex 시주 지지 인덱스 (null이면 시간 미상)
 */
function analyzeGongmang(yearStemIndex, yearBranchIndex, monthBranchIndex, dayStemIndex, dayBranchIndex, hourBranchIndex) {
    const yearGongmang = calculateGongmangPair(yearStemIndex, yearBranchIndex);
    const dayGongmang = calculateGongmangPair(dayStemIndex, dayBranchIndex);
    function checkStatus(targetBranchIndex) {
        return {
            branchChar: constants_1.BRANCHES[targetBranchIndex].char,
            branchName: constants_1.BRANCHES[targetBranchIndex].name,
            isYearGongmang: yearGongmang.indices.includes(targetBranchIndex),
            isDayGongmang: dayGongmang.indices.includes(targetBranchIndex),
        };
    }
    const branchStatus = {
        year: checkStatus(yearBranchIndex),
        month: checkStatus(monthBranchIndex),
        day: checkStatus(dayBranchIndex),
        hour: hourBranchIndex !== null ? checkStatus(hourBranchIndex) : null,
    };
    // 요약 생성
    const summary = [];
    summary.push(`년공망(${yearGongmang.sunName}): ${yearGongmang.chars[0]}(${yearGongmang.names[0]}), ${yearGongmang.chars[1]}(${yearGongmang.names[1]})`);
    summary.push(`일공망(${dayGongmang.sunName}): ${dayGongmang.chars[0]}(${dayGongmang.names[0]}), ${dayGongmang.chars[1]}(${dayGongmang.names[1]})`);
    const positions = ['년지', '월지', '일지', '시지'];
    const statuses = [
        branchStatus.year,
        branchStatus.month,
        branchStatus.day,
        branchStatus.hour,
    ];
    for (let i = 0; i < statuses.length; i++) {
        const s = statuses[i];
        if (!s)
            continue;
        if (s.isDayGongmang) {
            summary.push(`${positions[i]} ${s.branchChar}(${s.branchName})가 일공망에 해당합니다.`);
        }
        if (s.isYearGongmang && !s.isDayGongmang) {
            summary.push(`${positions[i]} ${s.branchChar}(${s.branchName})가 년공망에 해당합니다.`);
        }
    }
    return { yearGongmang, dayGongmang, branchStatus, summary };
}
/**
 * 운세(세운/월운/일운)에서 공망 확인 + 해공 판단
 *
 * @param yearStemIndex 원국 년주 천간 인덱스
 * @param yearBranchIndex 원국 년주 지지 인덱스
 * @param dayStemIndex 원국 일주 천간 인덱스
 * @param dayBranchIndex 원국 일주 지지 인덱스
 * @param fortuneBranchIndex 운세(세운/월운/일운)의 지지 인덱스
 * @param chartBranchIndices 원국 지지 인덱스 배열 [년,월,일,시] (해공 판단용)
 */
function checkFortuneGongmang(yearStemIndex, yearBranchIndex, dayStemIndex, dayBranchIndex, fortuneBranchIndex, chartBranchIndices) {
    const isYearGm = isGongmang(yearStemIndex, yearBranchIndex, fortuneBranchIndex);
    const isDayGm = isGongmang(dayStemIndex, dayBranchIndex, fortuneBranchIndex);
    // 해공 판단: 원국 지지와 운세 지지 사이에 충/합이 있으면 공망이 풀림
    const releases = [];
    if (isYearGm || isDayGm) {
        for (const chartBranch of chartBranchIndices) {
            // 충으로 해공
            if (getClashPartner(fortuneBranchIndex) === chartBranch) {
                releases.push({
                    gongmangBranchIndex: fortuneBranchIndex,
                    gongmangBranchChar: constants_1.BRANCHES[fortuneBranchIndex].char,
                    releaseBranchIndex: chartBranch,
                    releaseBranchChar: constants_1.BRANCHES[chartBranch].char,
                    releaseType: '충',
                });
            }
            // 육합으로 해공
            if (SIX_COMBINE_PARTNER[fortuneBranchIndex] === chartBranch) {
                releases.push({
                    gongmangBranchIndex: fortuneBranchIndex,
                    gongmangBranchChar: constants_1.BRANCHES[fortuneBranchIndex].char,
                    releaseBranchIndex: chartBranch,
                    releaseBranchChar: constants_1.BRANCHES[chartBranch].char,
                    releaseType: '합',
                });
            }
        }
    }
    const isReleased = releases.length > 0;
    const fortuneBranch = constants_1.BRANCHES[fortuneBranchIndex];
    // 해석 텍스트 생성
    let description = '';
    if (!isYearGm && !isDayGm) {
        description = ''; // 공망 아님 → 설명 없음
    }
    else if (isReleased) {
        const releaseText = releases
            .map(r => `${r.releaseBranchChar}와 ${r.releaseType}`)
            .join(', ');
        if (isDayGm) {
            description =
                `${fortuneBranch.char}(${fortuneBranch.name})는 일공망이나, ` +
                    `원국 ${releaseText}으로 해공(解空)됩니다. ` +
                    `비어있던 자리가 채워지며 새로운 변화와 기회가 열립니다.`;
        }
        else {
            description =
                `${fortuneBranch.char}(${fortuneBranch.name})는 년공망이나, ` +
                    `원국 ${releaseText}으로 해공(解空)됩니다. ` +
                    `사회적 활동에서 새로운 전환점이 될 수 있습니다.`;
        }
    }
    else if (isDayGm && isYearGm) {
        description =
            `${fortuneBranch.char}(${fortuneBranch.name})는 년공망이자 일공망입니다. ` +
                `기대한 만큼의 결과가 나오기 어려울 수 있으니 신중하게 접근하세요. ` +
                `큰 투자나 중요한 결정은 충분히 검토한 후 진행하는 것이 좋습니다.`;
    }
    else if (isDayGm) {
        description =
            `${fortuneBranch.char}(${fortuneBranch.name})는 일공망에 해당합니다. ` +
                `개인적인 일에서 기대와 현실의 차이가 있을 수 있습니다. ` +
                `과도한 기대보다는 현실적인 목표를 세우세요.`;
    }
    else {
        description =
            `${fortuneBranch.char}(${fortuneBranch.name})는 년공망에 해당합니다. ` +
                `사회적·대외적 활동에서 허한 기운이 있을 수 있습니다. ` +
                `내실을 다지는 데 집중하는 것이 유리합니다.`;
    }
    return {
        isYearGongmang: isYearGm,
        isDayGongmang: isDayGm,
        releases,
        isReleased,
        description,
    };
}
//# sourceMappingURL=gongmang.js.map