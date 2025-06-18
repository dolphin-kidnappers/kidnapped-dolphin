import fs from "fs/promises"
import path from "path"

// 기본 데이터 구조
const DEFAULT_DATA = {
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
    autoGenerated: true,
  },
}

// 총 레코드 수 계산
DEFAULT_DATA.metadata.totalRecords =
  Object.keys(DEFAULT_DATA.regions).length * 4 + // 지역 × 기간
  DEFAULT_DATA.species.length +
  Object.keys(DEFAULT_DATA.pollutionSources).length +
  DEFAULT_DATA.chartData.length

// 데이터 파일 경로
const DATA_PATH = path.join(process.cwd(), "data", "microplastic-data.json")

// 데이터 읽기 (파일이 없으면 자동 생성)
export async function readData() {
  try {
    const fileContent = await fs.readFile(DATA_PATH, "utf-8")
    return JSON.parse(fileContent)
  } catch (error: any) {
    if (error.code === "ENOENT") {
      console.log("📁 데이터 파일이 없습니다. 기본 데이터를 생성합니다...")
      await initializeData()
      return DEFAULT_DATA
    }
    console.error("데이터 읽기 오류:", error)
    throw new Error("데이터를 읽을 수 없습니다.")
  }
}

// 데이터 쓰기
export async function writeData(data: any) {
  try {
    // data 디렉토리 생성
    const dataDir = path.dirname(DATA_PATH)
    await fs.mkdir(dataDir, { recursive: true })

    // 메타데이터 업데이트
    data.metadata.lastUpdated = new Date().toISOString()
    await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error("데이터 쓰기 오류:", error)
    throw new Error("데이터를 저장할 수 없습니다.")
  }
}

// 데이터 초기화
export async function initializeData() {
  try {
    await writeData(DEFAULT_DATA)
    console.log("✅ 기본 데이터가 자동으로 생성되었습니다!")
    return DEFAULT_DATA
  } catch (error) {
    console.error("❌ 데이터 초기화 실패:", error)
    throw error
  }
}

// 파일 존재 여부 확인
export async function dataFileExists() {
  try {
    await fs.access(DATA_PATH)
    return true
  } catch {
    return false
  }
}
