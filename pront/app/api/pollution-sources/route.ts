import { NextResponse } from "next/server"
import { readData } from "@/lib/data-utils"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const region = searchParams.get("region") || "all"

    const data = await readData()

    const pollutionSources = data.pollutionSources[region]
    if (!pollutionSources) {
      return NextResponse.json({ error: "지역을 찾을 수 없습니다." }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      region: region,
      sources: pollutionSources,
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
