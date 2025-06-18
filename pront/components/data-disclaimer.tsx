"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Info, AlertTriangle, Database, BookOpen } from "lucide-react"

export function DataDisclaimer() {
  return (
    <div className="space-y-4">
      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-semibold text-blue-800">📊 데이터 특성 안내</p>
            <p className="text-blue-700">
              본 시스템은 <strong>실제 연구기관 자료를 기반으로 한 과학적 시뮬레이션</strong>입니다.
            </p>
          </div>
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Database className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-green-800">실제 기반 데이터</h3>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                ✓ 실제
              </Badge>
            </div>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• 국립해양조사원 관측소 16개소</li>
              <li>• KIOST, 국립수산과학원 등 연구기관</li>
              <li>• 실제 어종명 및 학명</li>
              <li>• 실제 항구 및 지역명</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-5 w-5 text-orange-600" />
              <h3 className="font-semibold text-orange-800">연구 기반 추정</h3>
              <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                ≈ 추정
              </Badge>
            </div>
            <ul className="text-sm text-orange-700 space-y-1">
              <li>• 미세플라스틱 농도 수치</li>
              <li>• 어종별 영향도 점수</li>
              <li>• 개체수 변화율</li>
              <li>• 월별 변화 추이</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Alert className="border-amber-200 bg-amber-50">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription>
          <p className="text-amber-800">
            <strong>⚠️ 중요:</strong> 표시된 농도 및 영향도 수치는 공개된 연구 결과를 참고한 추정값으로, 실시간
            측정값이나 공식 발표 수치가 아닙니다. 정확한 정보는 해당 연구기관에 문의하시기 바랍니다.
          </p>
        </AlertDescription>
      </Alert>
    </div>
  )
}
