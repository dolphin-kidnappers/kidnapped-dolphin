import { NextResponse } from "next/server"
import { readData, writeData } from "@/lib/data-utils"

// GET: 지역별 데이터 조회
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const region = searchParams.get("region") || "all"
    const timeRange = searchParams.get("timeRange") || "1year"

    const data = await readData()

    const regionData = data.regions[region]
    if (!regionData) {
      return NextResponse.json({ error: "지역을 찾을 수 없습니다." }, { status: 404 })
    }

    const timeRangeData = regionData.timeRanges[timeRange]
    if (!timeRangeData) {
      return NextResponse.json({ error: "기간을 찾을 수 없습니다." }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      region: region,
      regionName: regionData.name,
      timeRange: timeRange,
      data: timeRangeData,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("API 오류:", error)
    return NextResponse.json(
      {
        success: false,
        error: "서버 오류가 발생했습니다.",
      },
      { status: 500 },
    )
  }
}

// PUT: 지역 데이터 업데이트
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const region = searchParams.get("region")
    const timeRange = searchParams.get("timeRange")

    if (!region || !timeRange) {
      return NextResponse.json(
        {
          success: false,
          error: "지역과 기간을 모두 지정해야 합니다.",
        },
        { status: 400 },
      )
    }

    const updateData = await request.json()
    const data = await readData()

    if (!data.regions[region]) {
      return NextResponse.json(
        {
          success: false,
          error: "지역을 찾을 수 없습니다.",
        },
        { status: 404 },
      )
    }

    if (!data.regions[region].timeRanges[timeRange]) {
      return NextResponse.json(
        {
          success: false,
          error: "기간을 찾을 수 없습니다.",
        },
        { status: 404 },
      )
    }

    // 데이터 업데이트
    data.regions[region].timeRanges[timeRange] = {
      ...data.regions[region].timeRanges[timeRange],
      ...updateData,
    }

    await writeData(data)

    return NextResponse.json({
      success: true,
      message: "데이터가 성공적으로 업데이트되었습니다.",
      data: data.regions[region].timeRanges[timeRange],
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("API 오류:", error)
    return NextResponse.json(
      {
        success: false,
        error: "서버 오류가 발생했습니다.",
      },
      { status: 500 },
    )
  }
}
