import fs from "fs/promises"
import path from "path"

// 미세플라스틱 데이터 구조
const microplasticData = {
  regions: {
    all: {
      name: "전체 해역",
      timeRanges: {
        "1month": {
          risk: "높음",
          concentration: "2.4",
          species: 147,
          points: 89,
          riskChange: "+12%",
          concChange: "+8%",
          speciesChange: "+15%",
          pointsChange: "+5%",
        },
        "3months": {
          risk: "높음",
          concentration: "2.3",
          species: 142,
          points: 87,
          riskChange: "+10%",
          concChange: "+6%",
          speciesChange: "+12%",
          pointsChange: "+3%",
        },
        "1year": {
          risk: "높음",
          concentration: "2.4",
          species: 147,
          points: 89,
          riskChange: "+12%",
          concChange: "+8%",
          speciesChange: "+15%",
          pointsChange: "+5%",
        },
        "5years": {
          risk: "중간",
          concentration: "2.1",
          species: 134,
          points: 82,
          riskChange: "+18%",
          concChange: "+22%",
          speciesChange: "+28%",
          pointsChange: "+15%",
        },
      },
    },
    west: {
      name: "서해",
      timeRanges: {
        "1month": {
          risk: "매우높음",
          concentration: "3.2",
          species: 67,
          points: 23,
          riskChange: "+18%",
          concChange: "+15%",
          speciesChange: "+22%",
          pointsChange: "+8%",
        },
        "3months": {
          risk: "매우높음",
          concentration: "3.1",
          species: 65,
          points: 22,
          riskChange: "+16%",
          concChange: "+12%",
          speciesChange: "+18%",
          pointsChange: "+6%",
        },
        "1year": {
          risk: "매우높음",
          concentration: "3.1",
          species: 67,
          points: 23,
          riskChange: "+18%",
          concChange: "+15%",
          speciesChange: "+22%",
          pointsChange: "+8%",
        },
        "5years": {
          risk: "높음",
          concentration: "2.8",
          species: 58,
          points: 20,
          riskChange: "+25%",
          concChange: "+35%",
          speciesChange: "+45%",
          pointsChange: "+25%",
        },
      },
    },
    south: {
      name: "남해",
      timeRanges: {
        "1month": {
          risk: "중간",
          concentration: "2.4",
          species: 45,
          points: 28,
          riskChange: "+8%",
          concChange: "+5%",
          speciesChange: "+12%",
          pointsChange: "+3%",
        },
        "3months": {
          risk: "중간",
          concentration: "2.3",
          species: 43,
          points: 27,
          riskChange: "+6%",
          concChange: "+3%",
          speciesChange: "+8%",
          pointsChange: "+2%",
        },
        "1year": {
          risk: "중간",
          concentration: "2.3",
          species: 45,
          points: 28,
          riskChange: "+8%",
          concChange: "+5%",
          speciesChange: "+12%",
          pointsChange: "+3%",
        },
        "5years": {
          risk: "낮음",
          concentration: "2.0",
          species: 38,
          points: 24,
          riskChange: "+15%",
          concChange: "+18%",
          speciesChange: "+25%",
          pointsChange: "+12%",
        },
      },
    },
    east: {
      name: "동해",
      timeRanges: {
        "1month": {
          risk: "낮음",
          concentration: "1.9",
          species: 28,
          points: 18,
          riskChange: "+3%",
          concChange: "+2%",
          speciesChange: "+5%",
          pointsChange: "+1%",
        },
        "3months": {
          risk: "낮음",
          concentration: "1.8",
          species: 27,
          points: 18,
          riskChange: "+2%",
          concChange: "+1%",
          speciesChange: "+3%",
          pointsChange: "0%",
        },
        "1year": {
          risk: "낮음",
          concentration: "1.8",
          species: 28,
          points: 18,
          riskChange: "+3%",
          concChange: "+2%",
          speciesChange: "+5%",
          pointsChange: "+1%",
        },
        "5years": {
          risk: "매우낮음",
          concentration: "1.5",
          species: 22,
          points: 15,
          riskChange: "+8%",
          concChange: "+12%",
          speciesChange: "+15%",
          pointsChange: "+8%",
        },
      },
    },
    jeju: {
      name: "제주 근해",
      timeRanges: {
        "1month": {
          risk: "중간",
          concentration: "2.2",
          species: 32,
          points: 20,
          riskChange: "+6%",
          concChange: "+4%",
          speciesChange: "+8%",
          pointsChange: "+2%",
        },
        "3months": {
          risk: "중간",
          concentration: "2.1",
          species: 31,
          points: 20,
          riskChange: "+4%",
          concChange: "+2%",
          speciesChange: "+6%",
          pointsChange: "+1%",
        },
        "1year": {
          risk: "중간",
          concentration: "2.1",
          species: 32,
          points: 20,
          riskChange: "+6%",
          concChange: "+4%",
          speciesChange: "+8%",
          pointsChange: "+2%",
        },
        "5years": {
          risk: "낮음",
          concentration: "1.8",
          species: 26,
          points: 17,
          riskChange: "+12%",
          concChange: "+15%",
          speciesChange: "+18%",
          pointsChange: "+10%",
        },
      },
    },
  },
  species: [
    {
      id: 1,
      species: "고등어",
      impact: 85,
      previousPopulation: 12500,
      currentPopulation: 10800,
      populationChange: -13.6,
      trend: "악화",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: 2,
      species: "명태",
      impact: 78,
      previousPopulation: 8900,
      currentPopulation: 7650,
      populationChange: -14.0,
      trend: "악화",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: 3,
      species: "갈치",
      impact: 72,
      previousPopulation: 6200,
      currentPopulation: 6180,
      populationChange: -0.3,
      trend: "유지",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: 4,
      species: "오징어",
      impact: 68,
      previousPopulation: 4800,
      currentPopulation: 4320,
      populationChange: -10.0,
      trend: "악화",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: 5,
      species: "참조기",
      impact: 65,
      previousPopulation: 3400,
      currentPopulation: 3570,
      populationChange: +5.0,
      trend: "개선",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: 6,
      species: "멸치",
      impact: 62,
      previousPopulation: 15600,
      currentPopulation: 17940,
      populationChange: +15.0,
      trend: "개선",
      lastUpdated: new Date().toISOString(),
    },
  ],
  pollutionSources: {
    all: [
      { name: "플라스틱 포장재", percentage: 35 },
      { name: "어업용 도구", percentage: 28 },
      { name: "생활용품", percentage: 22 },
      { name: "산업폐기물", percentage: 15 },
    ],
    west: [
      { name: "산업폐기물", percentage: 42 },
      { name: "플라스틱 포장재", percentage: 31 },
      { name: "어업용 도구", percentage: 18 },
      { name: "생활용품", percentage: 9 },
    ],
    south: [
      { name: "어업용 도구", percentage: 38 },
      { name: "플라스틱 포장재", percentage: 29 },
      { name: "관광 폐기물", percentage: 21 },
      { name: "생활용품", percentage: 12 },
    ],
    east: [
      { name: "어업용 도구", percentage: 45 },
      { name: "플라스틱 포장재", percentage: 28 },
      { name: "생활용품", percentage: 18 },
      { name: "해상운송", percentage: 9 },
    ],
    jeju: [
      { name: "관광 폐기물", percentage: 36 },
      { name: "플라스틱 포장재", percentage: 32 },
      { name: "어업용 도구", percentage: 22 },
      { name: "생활용품", percentage: 10 },
    ],
  },
  chartData: [
    { month: "1월", concentration: 1.8, particles: 450, risk: 65 },
    { month: "2월", concentration: 2.1, particles: 520, risk: 72 },
    { month: "3월", concentration: 2.4, particles: 580, risk: 78 },
    { month: "4월", concentration: 2.8, particles: 650, risk: 85 },
    { month: "5월", concentration: 3.2, particles: 720, risk: 90 },
    { month: "6월", concentration: 2.9, particles: 680, risk: 87 },
    { month: "7월", concentration: 2.6, particles: 620, risk: 82 },
    { month: "8월", concentration: 2.3, particles: 560, risk: 75 },
    { month: "9월", concentration: 2.0, particles: 500, risk: 70 },
    { month: "10월", concentration: 2.2, particles: 530, risk: 73 },
    { month: "11월", concentration: 2.5, particles: 590, risk: 80 },
    { month: "12월", concentration: 2.7, particles: 630, risk: 83 },
  ],
  metadata: {
    version: "1.0.0",
    lastUpdated: new Date().toISOString(),
    totalRecords: 0,
  },
}

// 총 레코드 수 계산
microplasticData.metadata.totalRecords =
  Object.keys(microplasticData.regions).length * 4 + // 지역 × 기간
  microplasticData.species.length +
  Object.keys(microplasticData.pollutionSources).length +
  microplasticData.chartData.length

async function initializeData() {
  try {
    // data 디렉토리 생성
    const dataDir = path.join(process.cwd(), "data")
    await fs.mkdir(dataDir, { recursive: true })

    // 데이터 파일들 생성
    await fs.writeFile(path.join(dataDir, "microplastic-data.json"), JSON.stringify(microplasticData, null, 2))

    console.log("✅ 미세플라스틱 데이터 초기화 완료!")
    console.log("📁 데이터 위치: /data/microplastic-data.json")
    console.log("📊 포함된 데이터:")
    console.log(`   - 지역별 오염 현황: ${Object.keys(microplasticData.regions).length}개 지역 × 4개 기간`)
    console.log(`   - 어종별 영향도: ${microplasticData.species.length}개 어종`)
    console.log(`   - 오염원 분석: ${Object.keys(microplasticData.pollutionSources).length}개 지역`)
    console.log(`   - 월별 차트 데이터: ${microplasticData.chartData.length}개월`)
    console.log(`   - 총 레코드 수: ${microplasticData.metadata.totalRecords}개`)
    console.log(`   - 버전: ${microplasticData.metadata.version}`)
  } catch (error) {
    console.error("❌ 데이터 초기화 실패:", error)
  }
}

// 스크립트 실행
initializeData()
