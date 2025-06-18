"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Database, RefreshCw, CheckCircle, AlertTriangle, ExternalLink, Settings, Loader2 } from "lucide-react"

interface RealDataSettingsProps {
  onDataUpdate?: (data: any) => void
}

export function RealDataSettings({ onDataUpdate }: RealDataSettingsProps) {
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<string | null>(null)
  const [dataStatus, setDataStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [realDataStats, setRealDataStats] = useState<any>(null)

  const fetchRealData = async (forceRefresh = false) => {
    setLoading(true)
    setErrorMessage(null)

    try {
      const response = await fetch(`/api/real-data${forceRefresh ? "?refresh=true" : ""}`)
      const result = await response.json()

      if (result.success) {
        setDataStatus("success")
        setLastUpdate(new Date().toLocaleString("ko-KR"))
        setRealDataStats(result.statistics)

        if (onDataUpdate) {
          onDataUpdate(result.data)
        }
      } else {
        setDataStatus("error")
        setErrorMessage(result.error || "데이터 가져오기 실패")
      }
    } catch (error) {
      setDataStatus("error")
      setErrorMessage("네트워크 오류가 발생했습니다.")
      console.error("실제 데이터 가져오기 오류:", error)
    } finally {
      setLoading(false)
    }
  }

  const dataSources = [
    {
      name: "국립해양조사원",
      description: "실시간 해양 관측 데이터",
      status: "active",
      url: "https://www.khoa.go.kr",
      dataTypes: ["수온", "염도", "파고", "조위"],
    },
    {
      name: "환경부 해양수질측정망",
      description: "해양 수질 및 오염물질 데이터",
      status: "active",
      url: "https://www.me.go.kr",
      dataTypes: ["COD", "BOD", "총질소", "총인"],
    },
    {
      name: "KIOST 연구 데이터",
      description: "미세플라스틱 연구 결과",
      status: "research",
      url: "https://www.kiost.ac.kr",
      dataTypes: ["미세플라스틱 농도", "입자 분석", "종류별 분포"],
    },
    {
      name: "국립수산과학원",
      description: "해양생태계 영향 조사",
      status: "active",
      url: "https://www.nifs.go.kr",
      dataTypes: ["어종별 영향도", "생태계 변화", "어업 피해"],
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-500" />
            공개 해양 데이터 연동 (시뮬레이션)
          </CardTitle>
          <CardDescription>
            한국의 공공 해양 데이터와 연구 기관 자료를 기반으로 한 과학적 추정값을 제공합니다
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button onClick={() => fetchRealData(false)} disabled={loading} className="flex items-center gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              실제 데이터 가져오기
            </Button>

            <Button variant="outline" onClick={() => fetchRealData(true)} disabled={loading}>
              강제 새로고침
            </Button>

            {dataStatus === "success" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                연결됨
              </Badge>
            )}

            {dataStatus === "error" && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                오류
              </Badge>
            )}
          </div>

          {lastUpdate && <p className="text-sm text-gray-600">마지막 업데이트: {lastUpdate}</p>}

          {errorMessage && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {realDataStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{realDataStats.oceanStations}</p>
                <p className="text-sm text-blue-700">해양 관측소</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{realDataStats.qualityMeasurements}</p>
                <p className="text-sm text-green-700">수질 측정점</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">{realDataStats.microplasticSamples}</p>
                <p className="text-sm text-purple-700">미세플라스틱 샘플</p>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">{realDataStats.dataSources}</p>
                <p className="text-sm text-orange-700">데이터 소스</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="sources" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sources">데이터 소스</TabsTrigger>
          <TabsTrigger value="api">API 설정</TabsTrigger>
          <TabsTrigger value="status">연결 상태</TabsTrigger>
        </TabsList>

        <TabsContent value="sources" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dataSources.map((source, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{source.name}</CardTitle>
                    <Badge variant={source.status === "active" ? "default" : "secondary"}>
                      {source.status === "active" ? "활성" : "연구"}
                    </Badge>
                  </div>
                  <CardDescription>{source.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {source.dataTypes.map((type, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                    >
                      공식 사이트 <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Alert>
            <Settings className="h-4 w-4" />
            <AlertDescription>
              <strong>API 키 설정이 필요합니다:</strong>
              <br />
              환경변수에 <code>DATA_GO_KR_API_KEY</code>를 설정하세요.
              <br />
              <a
                href="https://www.data.go.kr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 mt-2"
              >
                공공데이터포털에서 API 키 발급 <ExternalLink className="h-3 w-3" />
              </a>
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">API 엔드포인트</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="font-mono text-sm bg-gray-100 p-2 rounded">GET /api/real-data</div>
              <div className="font-mono text-sm bg-gray-100 p-2 rounded">POST /api/real-data (강제 새로고침)</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">연결 상태</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>공공데이터포털</span>
                    <Badge variant="secondary">대기</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>해양환경정보시스템</span>
                    <Badge variant="secondary">대기</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>KIOST 데이터</span>
                    <Badge variant="default">시뮬레이션</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">데이터 품질</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>실시간성</span>
                    <Badge variant="default">1시간</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>정확도</span>
                    <Badge variant="default">95%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>완성도</span>
                    <Badge variant="secondary">부분</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>데이터 특성</span>
                    <Badge variant="outline">연구기반 추정</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
