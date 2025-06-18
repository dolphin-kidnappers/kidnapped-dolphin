import { NextResponse } from "next/server"
import { readData, writeData } from "@/lib/data-utils"

// GET: 어종 데이터 조회
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sortBy = searchParams.get("sortBy") || "impact"
    const order = searchParams.get("order") || "desc"
    const limit = Number.parseInt(searchParams.get("limit") || "0")

    const data = await readData()
    let species = [...data.species]

    // 정렬
    species.sort((a, b) => {
      const aVal = a[sortBy as keyof typeof a]
      const bVal = b[sortBy as keyof typeof b]

      if (typeof aVal === "number" && typeof bVal === "number") {
        return order === "desc" ? bVal - aVal : aVal - bVal
      }

      return order === "desc" ? String(bVal).localeCompare(String(aVal)) : String(aVal).localeCompare(String(bVal))
    })

    // 제한
    if (limit > 0) {
      species = species.slice(0, limit)
    }

    return NextResponse.json({
      success: true,
      species: species,
      total: data.species.length,
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

// POST: 새 어종 추가
export async function POST(request: Request) {
  try {
    const newSpecies = await request.json()

    // 필수 필드 검증
    const requiredFields = ["species", "impact", "previousPopulation", "currentPopulation", "populationChange", "trend"]
    for (const field of requiredFields) {
      if (!(field in newSpecies)) {
        return NextResponse.json(
          {
            success: false,
            error: `필수 필드가 누락되었습니다: ${field}`,
          },
          { status: 400 },
        )
      }
    }

    const data = await readData()

    // 중복 어종 확인
    const existingSpecies = data.species.find((s: any) => s.species === newSpecies.species)
    if (existingSpecies) {
      return NextResponse.json(
        {
          success: false,
          error: "이미 존재하는 어종입니다.",
        },
        { status: 409 },
      )
    }

    // ID 생성
    const maxId = Math.max(...data.species.map((s: any) => s.id || 0))
    const speciesWithId = {
      ...newSpecies,
      id: maxId + 1,
      lastUpdated: new Date().toISOString(),
    }

    // 새 어종 추가
    data.species.push(speciesWithId)
    await writeData(data)

    return NextResponse.json(
      {
        success: true,
        message: "새 어종이 성공적으로 추가되었습니다.",
        data: speciesWithId,
        timestamp: new Date().toISOString(),
      },
      { status: 201 },
    )
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
