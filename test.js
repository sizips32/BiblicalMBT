function calcMBTI(scores) {
    if (scores.length !== 24) return '?';
    
    // 각 차원별 점수 계산
    // E-I: 1점이 I형, 5점이 E형
    const ei = scores.slice(0, 6).reduce((acc, cur) => acc + (6 - cur), 0);
    // S-N: 1점이 S형, 5점이 N형
    const sn = scores.slice(6, 12).reduce((acc, cur) => acc + (6 - cur), 0);
    // T-F: 1점이 T형, 5점이 F형
    const tf = scores.slice(12, 18).reduce((acc, cur) => acc + (6 - cur), 0);
    // J-P: 1점이 J형, 5점이 P형
    const jp = scores.slice(18, 24).reduce((acc, cur) => acc + (6 - cur), 0);
    
    // 평균 점수 계산 (1-5 척도)
    const avgEI = ei / 6;
    const avgSN = sn / 6;
    const avgTF = tf / 6;
    const avgJP = jp / 6;
    
    // 3점 기준으로 판단 (3점 이상이면 해당 특성, 미만이면 반대 특성)
    return `${avgEI >= 3 ? 'E' : 'I'}${avgSN >= 3 ? 'N' : 'S'}${avgTF >= 3 ? 'T' : 'F'}${avgJP >= 3 ? 'J' : 'P'}`;
}

// 테스트 데이터
const testScores1 = [1,1,1,1,1,1,1,1,1,1,1,1,5,5,5,5,5,5,5,5,5,5,5,5]; // INTJ 유형으로 예상
const testScores2 = [5,5,5,5,5,5,5,5,5,5,5,5,1,1,1,1,1,1,1,1,1,1,1,1]; // ESTP 유형으로 예상

console.log('Test 1 (INTJ):', calcMBTI(testScores1));
console.log('Test 2 (ESTP):', calcMBTI(testScores2));
