import { NextResponse } from "next/server"
import { readData } from "@/lib/data-utils"
import fs from "fs/promises"
import path from "path"

// GET: 전체 데이터 및 통계 조회 (관리자용)
export async function GET() {
  try {
    const data = await readData()

    // 통계 계산
    const stats = {
      regions: Object.keys(data.regions).length,
      species: data.species.length,
      pollutionSources: Object.keys(data.pollutionSources).length,
      chartDataPoints: data.chartData.length,
      totalRecords: data.metadata.totalRecords,
      lastUpdated: data.metadata.lastUpdated,
      version: data.metadata.version,
    }

    // 최근 업데이트된 어종 (상위 5개)
    const recentSpecies = data.species
      .sort((a: any, b: any) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
      .slice(0, 5)

    // 위험도별 지역 분포
    const riskDistribution: { [key: string]: number } = {}
    Object.values(data.regions).forEach((region: any) => {
      Object.values(region.timeRanges).forEach((timeRange: any) => {
        const risk = timeRange.risk
        riskDistribution[risk] = (riskDistribution[risk] || 0) + 1
      })
    })

    return NextResponse.json({
      success: true,
      stats,
      recentSpecies,
      riskDistribution,
      systemInfo: {
        runtime: "Next.js API Routes",
        environment: process.env.NODE_ENV || "development",
        timestamp: new Date().toISOString(),
      },
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

// POST: 데이터 백업
export async function POST() {
  try {
    const data = await readData()
    const backupDir = path.join(process.cwd(), "data", "backups")

    // 백업 디렉토리 생성
    await fs.mkdir(backupDir, { recursive: true })

    // 백업 파일명 (타임스탬프 포함)
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    const backupPath = path.join(backupDir, `backup-${timestamp}.json`)

    // 백업 생성
    await fs.writeFile(backupPath, JSON.stringify(data, null, 2))

    return NextResponse.json({
      success: true,
      message: "데이터 백업이 성공적으로 생성되었습니다.",
      backupFile: `backup-${timestamp}.json`,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("백업 오류:", error)
    return NextResponse.json(
      {
        success: false,
        error: "백업 생성 중 오류가 발생했습니다.",
      },
      { status: 500 },
    )
  }
}
