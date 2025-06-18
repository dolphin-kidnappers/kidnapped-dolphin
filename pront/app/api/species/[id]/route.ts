import { NextResponse } from "next/server"
import { readData, writeData } from "@/lib/data-utils"

// GET: 특정 어종 조회
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const data = await readData()

    const species = data.species.find((s: any) => s.id === id)
    if (!species) {
      return NextResponse.json(
        {
          success: false,
          error: "어종을 찾을 수 없습니다.",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: species,
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

// PUT: 어종 데이터 업데이트
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const updateData = await request.json()

    const data = await readData()
    const speciesIndex = data.species.findIndex((s: any) => s.id === id)

    if (speciesIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: "어종을 찾을 수 없습니다.",
        },
        { status: 404 },
      )
    }

    // 어종 데이터 업데이트
    data.species[speciesIndex] = {
      ...data.species[speciesIndex],
      ...updateData,
      lastUpdated: new Date().toISOString(),
    }

    await writeData(data)

    return NextResponse.json({
      success: true,
      message: "어종 데이터가 성공적으로 업데이트되었습니다.",
      data: data.species[speciesIndex],
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

// DELETE: 어종 삭제
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const data = await readData()

    const speciesIndex = data.species.findIndex((s: any) => s.id === id)
    if (speciesIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: "어종을 찾을 수 없습니다.",
        },
        { status: 404 },
      )
    }

    const deletedSpecies = data.species.splice(speciesIndex, 1)[0]
    await writeData(data)

    return NextResponse.json({
      success: true,
      message: "어종이 성공적으로 삭제되었습니다.",
      data: deletedSpecies,
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
