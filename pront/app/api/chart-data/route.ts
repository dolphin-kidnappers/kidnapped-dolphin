import { NextResponse } from "next/server"
import { readData } from "@/lib/data-utils"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const region = searchParams.get("region") || "all"
    const timeRange = searchParams.get("timeRange") || "1year"

    const data = await readData()

    let chartData = data.chartData

    // 지역별로 데이터 조정
    if (region === "west") {
      chartData = chartData.map((item) => ({
        ...item,
        concentration: Number.parseFloat((item.concentration * 1.3).toFixed(1)),
        particles: Math.round(item.particles * 1.2),
        risk: Math.min(Math.round(item.risk * 1.1), 100),
      }))
    } else if (region === "east") {
      chartData = chartData.map((item) => ({
        ...item,
        concentration: Number.parseFloat((item.concentration * 0.7).toFixed(1)),
        particles: Math.round(item.particles * 0.8),
        risk: Math.round(item.risk * 0.8),
      }))
    } else if (region === "south") {
      chartData = chartData.map((item) => ({
        ...item,
        concentration: Number.parseFloat((item.concentration * 0.9).toFixed(1)),
        particles: Math.round(item.particles * 0.95),
        risk: Math.round(item.risk * 0.9),
      }))
    } else if (region === "jeju") {
      chartData = chartData.map((item) => ({
        ...item,
        concentration: Number.parseFloat((item.concentration * 0.85).toFixed(1)),
        particles: Math.round(item.particles * 0.9),
        risk: Math.round(item.risk * 0.85),
      }))
    }

    return NextResponse.json({
      success: true,
      region: region,
      timeRange: timeRange,
      chartData: chartData,
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
