"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, Droplets, Fish, Globe, Loader2 } from "lucide-react"
import { PollutionChart } from "@/components/pollution-chart"
import { RegionalMap } from "@/components/regional-map"
import { SpeciesImpact } from "@/components/species-impact"
import { TrendAnalysis } from "@/components/trend-analysis"
import { RiskAssessment } from "@/components/risk-assessment"
import { DataDisclaimer } from "@/components/data-disclaimer"

interface RegionData {
  risk: string
  concentration: string
  species: number
  points: number
  riskChange: string
  concChange: string
  speciesChange: string
  pointsChange: string
}

interface PollutionSource {
  name: string
  percentage: number
}

export default function MicroplasticDashboard() {
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [timeRange, setTimeRange] = useState("1year")
  const [currentData, setCurrentData] = useState<RegionData | null>(null)
  const [pollutionSources, setPollutionSources] = useState<PollutionSource[]>([])
  const [loading, setLoading] = useState(true)
  const [currentRegionName, setCurrentRegionName] = useState("전체 해역")
  const [error, setError] = useState<string | null>(null)

  // API에서 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        // 지역 데이터 가져오기
        const regionResponse = await fetch(`/api/regions?region=${selectedRegion}&timeRange=${timeRange}`)
        const regionData = await regionResponse.json()

        if (regionResponse.ok && regionData.success) {
          setCurrentData(regionData.data)
          setCurrentRegionName(regionData.regionName)
        } else {
          console.error("지역 데이터 로딩 실패:", regionData.error)
          setError("지역 데이터를 불러올 수 없습니다.")
        }

        // 오염원 데이터 가져오기
        const sourcesResponse = await fetch(`/api/pollution-sources?region=${selectedRegion}`)
        const sourcesData = await sourcesResponse.json()

        if (sourcesResponse.ok && sourcesData.success) {
          setPollutionSources(sourcesData.sources)
        } else {
          console.error("오염원 데이터 로딩 실패:", sourcesData.error)
        }
      } catch (error) {
        console.error("데이터 로딩 오류:", error)
        setError("데이터를 불러오는 중 오류가 발생했습니다.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedRegion, timeRange])

  const overallStats = useMemo(() => {
    if (!currentData) return []

    return [
      {
        title: "전체 위험도",
        value: currentData.risk,
        change: currentData.riskChange,
        icon: AlertTriangle,
        color: currentData.risk.includes("높음")
          ? "text-red-600"
          : currentData.risk.includes("중간")
            ? "text-orange-600"
            : "text-green-600",
        bgColor: currentData.risk.includes("높음")
          ? "bg-red-50"
          : currentData.risk.includes("중간")
            ? "bg-orange-50"
            : "bg-green-50",
      },
      {
        title: "평균 농도",
        value: `${currentData.concentration} mg/L`,
        change: currentData.concChange,
        icon: Droplets,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
      },
      {
        title: "영향받는 종",
        value: `${currentData.species}종`,
        change: currentData.speciesChange,
        icon: Fish,
        color: "text-green-600",
        bgColor: "bg-green-50",
      },
      {
        title: "모니터링 지점",
        value: `${currentData.points}개소`,
        change: currentData.pointsChange,
        icon: Globe,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
      },
    ]
  }, [currentData])

  // 기간별 표시 텍스트
  const timeRangeText = {
    "1month": "최근 1개월",
    "3months": "최근 3개월",
    "1year": "최근 1년",
    "5years": "최근 5년",
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">데이터를 불러오는 중...</p>
          <p className="text-sm text-gray-500 mt-2">최초 실행 시 데이터를 자동으로 생성합니다.</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 mx-auto mb-4 text-red-600" />
          <p className="text-red-600 font-semibold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">해양생태계 미세플라스틱 오염 위험도 분석</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            실제 연구기관 데이터를 기반으로 한 해양 미세플라스틱 오염 현황과 생태계 영향 분석 시뮬레이션
          </p>
          <div className="text-sm text-gray-500">
            현재 보기: <span className="font-semibold text-blue-600">{currentRegionName}</span> ·{" "}
            <span className="font-semibold text-blue-600">
              {timeRangeText[timeRange as keyof typeof timeRangeText]}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="지역 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 해역</SelectItem>
              <SelectItem value="west">서해</SelectItem>
              <SelectItem value="south">남해</SelectItem>
              <SelectItem value="east">동해</SelectItem>
              <SelectItem value="jeju">제주 근해</SelectItem>
            </SelectContent>
          </Select>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="기간 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">최근 1개월</SelectItem>
              <SelectItem value="3months">최근 3개월</SelectItem>
              <SelectItem value="1year">최근 1년</SelectItem>
              <SelectItem value="5years">최근 5년</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {overallStats.map((stat, index) => (
            <Card key={index} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className={`text-sm ${stat.change.startsWith("+") ? "text-red-600" : "text-green-600"}`}>
                      {stat.change} 전월 대비
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">종합 현황</TabsTrigger>
            <TabsTrigger value="regional">지역별 분석</TabsTrigger>
            <TabsTrigger value="species">생물종 영향</TabsTrigger>
            <TabsTrigger value="trends">추세 분석</TabsTrigger>
            <TabsTrigger value="risk">위험도 평가</TabsTrigger>
            <TabsTrigger value="info">데이터 정보</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PollutionChart region={selectedRegion} timeRange={timeRange} />
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    주요 오염원 ({currentRegionName})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {pollutionSources.map((source, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span>{source.name}</span>
                        <Badge
                          variant={
                            source.percentage >= 35 ? "destructive" : source.percentage >= 25 ? "default" : "secondary"
                          }
                        >
                          {source.percentage}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="regional">
            <RegionalMap selectedRegion={selectedRegion} />
          </TabsContent>

          <TabsContent value="species">
            <SpeciesImpact timeRange={timeRange} />
          </TabsContent>

          <TabsContent value="trends">
            <TrendAnalysis region={selectedRegion} />
          </TabsContent>

          <TabsContent value="risk">
            <RiskAssessment region={selectedRegion} />
          </TabsContent>

          <TabsContent value="info">
            <DataDisclaimer />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <Card className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-semibold mb-2">데이터 출처 및 특성</h3>
            <p className="text-blue-100 mb-2">
              해양수산부, 국립수산과학원, KIOST 등 실제 연구기관의 공개 자료를 기반으로 한 과학적 시뮬레이션입니다.
            </p>
            <p className="text-sm text-blue-200">
              ⚠️ 표시된 수치는 연구 결과 기반 추정값이며, 실시간 측정값이 아닙니다.
            </p>
            <p className="text-sm text-blue-200 mt-2">마지막 업데이트: {new Date().toLocaleDateString("ko-KR")}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
