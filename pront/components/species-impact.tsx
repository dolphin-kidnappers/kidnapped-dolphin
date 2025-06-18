"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Fish, AlertTriangle, TrendingUp, TrendingDown, Minus, Loader2 } from "lucide-react"

interface SpeciesImpactProps {
  timeRange: string
}

interface Species {
  id: number
  species: string
  impact: number
  previousPopulation: number
  currentPopulation: number
  populationChange: number
  trend: string
}

export function SpeciesImpact({ timeRange }: SpeciesImpactProps) {
  const [speciesData, setSpeciesData] = useState<Species[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSpeciesData = async () => {
      setLoading(true)
      try {
        const response = await fetch("/api/species?sortBy=impact&order=desc")
        const data = await response.json()

        if (response.ok && data.success) {
          setSpeciesData(data.species)
        } else {
          console.error("어종 데이터 로딩 실패:", data.error)
        }
      } catch (error) {
        console.error("어종 데이터 로딩 오류:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSpeciesData()
  }, [timeRange])

  const marineLifeCategories = [
    {
      category: "어류",
      affected: 89,
      total: 156,
      severity: "높음",
      examples: ["고등어", "명태", "갈치"],
    },
    {
      category: "갑각류",
      affected: 34,
      total: 67,
      severity: "중간",
      examples: ["게", "새우", "바닷가재"],
    },
    {
      category: "연체동물",
      affected: 24,
      total: 45,
      severity: "높음",
      examples: ["오징어", "문어", "조개"],
    },
  ]

  const getPopulationIcon = (change: number) => {
    if (change > 0) return TrendingUp
    if (change < 0) return TrendingDown
    return Minus
  }

  const getPopulationColor = (change: number) => {
    if (change > 0) return "text-green-600"
    if (change < 0) return "text-red-600"
    return "text-gray-600"
  }

  const getPopulationBadge = (change: number) => {
    if (change > 0) return "secondary"
    if (change < 0) return "destructive"
    return "outline"
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Fish className="h-5 w-5 text-blue-500" />
              주요 어종별 영향도 (연구 기반 추정)
            </CardTitle>
            <CardDescription>연구 기반 추정 데이터를 불러오는 중...</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[200px]">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Fish className="h-5 w-5 text-blue-500" />
              주요 어종별 영향도 (연구 기반 추정)
            </CardTitle>
            <CardDescription>미세플라스틱이 주요 어종에 미치는 영향 정도 (0-100점)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {speciesData.map((species, index) => {
                const PopulationIcon = getPopulationIcon(species.populationChange)
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{species.species}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900">{species.impact}점</span>
                        <Badge variant={getPopulationBadge(species.populationChange)} className="text-xs">
                          {species.populationChange > 0 ? "+" : ""}
                          {species.populationChange.toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${
                          species.impact >= 80 ? "bg-red-500" : species.impact >= 70 ? "bg-orange-500" : "bg-yellow-500"
                        }`}
                        style={{ width: `${species.impact}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-1">
                        <PopulationIcon className={`h-3 w-3 ${getPopulationColor(species.populationChange)}`} />
                        <span className={getPopulationColor(species.populationChange)}>
                          {species.previousPopulation.toLocaleString()} → {species.currentPopulation.toLocaleString()}
                          마리
                        </span>
                      </div>
                      <span className="text-gray-500">추세: {species.trend}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>생물군별 영향 현황</CardTitle>
            <CardDescription>분류군별 영향받는 종의 수와 심각도</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {marineLifeCategories.map((category, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{category.category}</h3>
                  <Badge variant={category.severity === "높음" ? "destructive" : "default"}>{category.severity}</Badge>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>
                    영향받는 종: {category.affected}/{category.total}
                  </span>
                  <span>{Math.round((category.affected / category.total) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${category.severity === "높음" ? "bg-red-500" : "bg-yellow-500"}`}
                    style={{ width: `${(category.affected / category.total) * 100}%` }}
                  ></div>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-gray-500">주요 종: {category.examples.join(", ")}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            생태계 영향 상세 분석
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <h3 className="font-semibold text-red-700">섭식 영향</h3>
              <p className="text-2xl font-bold text-red-600">73%</p>
              <p className="text-sm text-red-600">소화기관 손상</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <h3 className="font-semibold text-orange-700">번식 영향</h3>
              <p className="text-2xl font-bold text-orange-600">58%</p>
              <p className="text-sm text-orange-600">생식능력 저하</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold text-yellow-700">성장 영향</h3>
              <p className="text-2xl font-bold text-yellow-600">45%</p>
              <p className="text-sm text-yellow-600">성장률 감소</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-700">행동 영향</h3>
              <p className="text-2xl font-bold text-blue-600">62%</p>
              <p className="text-sm text-blue-600">행동 패턴 변화</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
