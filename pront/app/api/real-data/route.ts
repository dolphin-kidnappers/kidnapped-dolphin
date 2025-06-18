import { NextResponse } from "next/server"
import { fetchComprehensiveOceanData, validateOceanData, convertToLegacyFormat } from "@/lib/real-data-api"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const forceRefresh = searchParams.get("refresh") === "true"

    console.log("🔄 실제 해양 데이터 요청 시작...")

    // 실제 데이터 수집
    const realData = await fetchComprehensiveOceanData()

    // 데이터 유효성 검증
    if (!validateOceanData(realData)) {
      return NextResponse.json(
        {
          success: false,
          error: "유효한 실제 데이터를 가져올 수 없습니다.",
          fallback: true,
        },
        { status: 503 },
      )
    }

    // 기존 형식으로 변환
    const convertedData = convertToLegacyFormat(realData)

    return NextResponse.json({
      success: true,
      message: "실제 해양 데이터를 성공적으로 가져왔습니다.",
      data: convertedData,
      rawData: realData,
      statistics: {
        oceanStations: realData.oceanObservations.length,
        qualityMeasurements: realData.waterQuality.length,
        microplasticSamples: realData.microplasticResearch.length,
        dataSources: realData.dataSources.length,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("실제 데이터 API 오류:", error)

    return NextResponse.json(
      {
        success: false,
        error: "실제 데이터 수집 중 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : "Unknown error",
        fallback: true,
      },
      { status: 500 },
    )
  }
}

// POST: 실제 데이터 강제 새로고침
export async function POST(request: Request) {
  try {
    console.log("🔄 실제 데이터 강제 새로고침...")

    const realData = await fetchComprehensiveOceanData()

    return NextResponse.json({
      success: true,
      message: "실제 데이터가 성공적으로 새로고침되었습니다.",
      data: realData,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("데이터 새로고침 오류:", error)

    return NextResponse.json(
      {
        success: false,
        error: "데이터 새로고침 중 오류가 발생했습니다.",
      },
      { status: 500 },
    )
  }
}
