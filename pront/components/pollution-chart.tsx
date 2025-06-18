"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from "recharts"
import { Loader2 } from "lucide-react"

interface PollutionChartProps {
  region: string
  timeRange: string
}

interface ChartData {
  month: string
  concentration: number
  particles: number
  risk: number
}

export function PollutionChart({ region, timeRange }: PollutionChartProps) {
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/chart-data?region=${region}&timeRange=${timeRange}`)
        const data = await response.json()

        if (response.ok && data.success) {
          setChartData(data.chartData)
        } else {
          console.error("차트 데이터 로딩 실패:", data.error)
        }
      } catch (error) {
        console.error("차트 데이터 로딩 오류:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchChartData()
  }, [region, timeRange])

  const regionNames = {
    all: "전체 해역",
    west: "서해",
    south: "남해",
    east: "동해",
    jeju: "제주 근해",
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>미세플라스틱 농도 변화</CardTitle>
          <CardDescription>데이터를 불러오는 중...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>미세플라스틱 농도 변화</CardTitle>
        <CardDescription>
          {regionNames[region as keyof typeof regionNames]} 기준 연구 자료 기반 추정 농도 및 위험도 추이
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            concentration: {
              label: "농도 (mg/L)",
              color: "hsl(var(--chart-1))",
            },
            risk: {
              label: "위험도 (%)",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="concentration"
                stroke="var(--color-concentration)"
                fill="var(--color-concentration)"
                fillOpacity={0.3}
                name="농도 (mg/L)"
              />
              <Area
                type="monotone"
                dataKey="risk"
                stroke="var(--color-risk)"
                fill="var(--color-risk)"
                fillOpacity={0.3}
                name="위험도 (%)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
