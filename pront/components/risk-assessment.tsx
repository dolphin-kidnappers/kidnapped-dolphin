"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Shield, Activity, Zap } from "lucide-react"

interface RiskAssessmentProps {
  region: string
}

export function RiskAssessment({ region }: RiskAssessmentProps) {
  const riskFactors = [
    {
      category: "생태계 영향",
      score: 85,
      level: "높음",
      factors: [
        { name: "어류 폐사율", value: 78, status: "위험" },
        { name: "생물다양성 감소", value: 82, status: "위험" },
        { name: "먹이사슬 교란", value: 90, status: "매우위험" },
      ],
    },
    {
      category: "인간 건강",
      score: 72,
      level: "중간",
      factors: [
        { name: "수산물 안전성", value: 68, status: "주의" },
        { name: "해수욕장 안전", value: 75, status: "위험" },
        { name: "어업 종사자 노출", value: 73, status: "위험" },
      ],
    },
    {
      category: "경제적 영향",
      score: 68,
      level: "중간",
      factors: [
        { name: "어업 생산량 감소", value: 65, status: "주의" },
        { name: "관광업 피해", value: 70, status: "위험" },
        { name: "정화 비용 증가", value: 69, status: "주의" },
      ],
    },
  ]

  const emergencyAlerts = [
    {
      level: "높음",
      message: "서해 연안 미세플라스틱 농도가 위험 수준에 도달했습니다.",
      action: "즉시 모니터링 강화 및 정화 작업 필요",
    },
    {
      level: "중간",
      message: "주요 어종의 미세플라스틱 섭취량이 증가하고 있습니다.",
      action: "수산물 안전성 검사 강화 권고",
    },
  ]

  const mitigationStrategies = [
    {
      strategy: "단기 대응",
      actions: ["핫스팟 지역 집중 정화", "어업 활동 일시 제한", "수산물 안전성 검사 강화", "시민 경보 시스템 가동"],
      timeline: "1-3개월",
      effectiveness: 65,
    },
    {
      strategy: "중기 대응",
      actions: ["오염원 차단 시설 설치", "생태계 복원 프로그램", "대체 어장 개발", "정화 기술 도입"],
      timeline: "6개월-2년",
      effectiveness: 80,
    },
    {
      strategy: "장기 대응",
      actions: ["플라스틱 사용 규제", "순환경제 시스템 구축", "국제 협력 강화", "기술 혁신 투자"],
      timeline: "3-10년",
      effectiveness: 95,
    },
  ]

  return (
    <div className="space-y-6">
      {/* 긴급 알림 */}
      <div className="space-y-3">
        {emergencyAlerts.map((alert, index) => (
          <Alert
            key={index}
            className={`border-l-4 ${
              alert.level === "높음" ? "border-red-500 bg-red-50" : "border-yellow-500 bg-yellow-50"
            }`}
          >
            <AlertTriangle className={`h-4 w-4 ${alert.level === "높음" ? "text-red-600" : "text-yellow-600"}`} />
            <AlertDescription>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{alert.message}</p>
                  <p className="text-sm text-gray-600 mt-1">{alert.action}</p>
                </div>
                <Badge variant={alert.level === "높음" ? "destructive" : "default"}>{alert.level}</Badge>
              </div>
            </AlertDescription>
          </Alert>
        ))}
      </div>

      {/* 위험도 평가 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {riskFactors.map((category, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{category.category}</CardTitle>
                <Badge
                  variant={
                    category.level === "높음" ? "destructive" : category.level === "중간" ? "default" : "secondary"
                  }
                >
                  {category.level}
                </Badge>
              </div>
              <CardDescription>종합 위험도: {category.score}점</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {category.factors.map((factor, factorIndex) => (
                  <div key={factorIndex}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{factor.name}</span>
                      <span
                        className={`font-medium ${
                          factor.status === "매우위험"
                            ? "text-red-600"
                            : factor.status === "위험"
                              ? "text-orange-600"
                              : "text-yellow-600"
                        }`}
                      >
                        {factor.value}점
                      </span>
                    </div>
                    <Progress
                      value={factor.value}
                      className={`h-2 ${
                        factor.status === "매우위험"
                          ? "[&>div]:bg-red-500"
                          : factor.status === "위험"
                            ? "[&>div]:bg-orange-500"
                            : "[&>div]:bg-yellow-500"
                      }`}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 대응 전략 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-500" />
            위험 완화 전략
          </CardTitle>
          <CardDescription>단계별 대응 방안 및 예상 효과</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mitigationStrategies.map((strategy, index) => (
              <Card key={index} className="border-l-4 border-blue-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{strategy.strategy}</CardTitle>
                    <Badge variant="outline">{strategy.timeline}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">예상 효과:</span>
                    <span className="font-semibold text-green-600">{strategy.effectiveness}%</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {strategy.actions.map((action, actionIndex) => (
                      <li key={actionIndex} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4">
                    <Progress value={strategy.effectiveness} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 모니터링 지표 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-500" />
            실시간 모니터링 지표
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Zap className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-700">센서 가동률</h3>
              <p className="text-2xl font-bold text-blue-600">94%</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Activity className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold text-green-700">데이터 수집률</h3>
              <p className="text-2xl font-bold text-green-600">98%</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Shield className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <h3 className="font-semibold text-purple-700">경보 시스템</h3>
              <p className="text-2xl font-bold text-purple-600">정상</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <AlertTriangle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <h3 className="font-semibold text-orange-700">대응 준비도</h3>
              <p className="text-2xl font-bold text-orange-600">85%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
