"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ComposedChart, Bar } from "recharts"
import { TrendingUp, TrendingDown } from "lucide-react"

interface TrendAnalysisProps {
  region: string
}

export function TrendAnalysis({ region }: TrendAnalysisProps) {
  const trendData = [
    { year: "2019", pollution: 1.2, incidents: 15, cleanup: 8 },
    { year: "2020", pollution: 1.5, incidents: 23, cleanup: 12 },
    { year: "2021", pollution: 1.8, incidents: 31, cleanup: 18 },
    { year: "2022", pollution: 2.1, incidents: 42, cleanup: 25 },
    { year: "2023", pollution: 2.4, incidents: 38, cleanup: 32 },
    { year: "2024", pollution: 2.2, incidents: 35, cleanup: 28 },
  ]

  const predictions = [
    { year: "2025", pollution: 2.0, confidence: 85 },
    { year: "2026", pollution: 1.8, confidence: 78 },
    { year: "2027", pollution: 1.6, confidence: 72 },
    { year: "2028", pollution: 1.4, confidence: 65 },
    { year: "2029", pollution: 1.2, confidence: 58 },
    { year: "2030", pollution: 1.0, confidence: 52 },
  ]

  const trendIndicators = [
    {
      title: "오염도 증가율",
      value: "+15.2%",
      trend: "up",
      description: "연평균 증가율",
      icon: TrendingUp,
      color: "text-red-600",
    },
    {
      title: "정화 효율성",
      value: "+28.5%",
      trend: "up",
      description: "정화 활동 증가",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "사고 발생률",
      value: "-8.3%",
      trend: "down",
      description: "최근 감소 추세",
      icon: TrendingDown,
      color: "text-green-600",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {trendIndicators.map((indicator, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{indicator.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{indicator.value}</p>
                  <p className="text-sm text-gray-500">{indicator.description}</p>
                </div>
                <div className={`p-3 rounded-full bg-gray-50`}>
                  <indicator.icon className={`h-6 w-6 ${indicator.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>과거 5년간 추세</CardTitle>
            <CardDescription>오염도, 사고 발생, 정화 활동 추이</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                pollution: {
                  label: "오염도 (mg/L)",
                  color: "hsl(var(--chart-1))",
                },
                incidents: {
                  label: "사고 건수",
                  color: "hsl(var(--chart-2))",
                },
                cleanup: {
                  label: "정화 활동",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="pollution"
                    stroke="var(--color-pollution)"
                    strokeWidth={3}
                    name="오염도 (mg/L)"
                  />
                  <Bar dataKey="incidents" fill="var(--color-incidents)" name="사고 건수" />
                  <Bar dataKey="cleanup" fill="var(--color-cleanup)" name="정화 활동" />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>미래 예측 (2025-2030)</CardTitle>
            <CardDescription>AI 모델 기반 오염도 예측 및 신뢰도</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                pollution: {
                  label: "예측 오염도",
                  color: "hsl(var(--chart-1))",
                },
                confidence: {
                  label: "신뢰도 (%)",
                  color: "hsl(var(--chart-4))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={predictions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="pollution"
                    stroke="var(--color-pollution)"
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    name="예측 오염도 (mg/L)"
                  />
                  <Bar dataKey="confidence" fill="var(--color-confidence)" name="신뢰도 (%)" />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>주요 변화 요인</CardTitle>
          <CardDescription>오염도 변화에 영향을 미치는 주요 요인들</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3 text-red-600">오염 증가 요인</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm">플라스틱 사용량 증가 (35%)</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm">해상 운송량 증가 (28%)</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm">연안 개발 확대 (22%)</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm">폐기물 관리 부족 (15%)</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-green-600">개선 요인</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">정화 기술 발전 (40%)</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">환경 규제 강화 (30%)</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">대체재 개발 (20%)</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">시민 의식 향상 (10%)</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
