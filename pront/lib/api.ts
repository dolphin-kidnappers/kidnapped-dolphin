// API 기본 URL 설정
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

// API 호출 헬퍼 함수
export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }))
    throw new Error(error.error || `HTTP ${response.status}`)
  }

  return response.json()
}

// 지역 데이터 조회
export async function getRegionData(region: string, timeRange: string) {
  return apiCall(`/api/regions?region=${region}&timeRange=${timeRange}`)
}

// 어종 데이터 조회
export async function getSpeciesData() {
  return apiCall("/api/species")
}

// 오염원 데이터 조회
export async function getPollutionSources(region: string) {
  return apiCall(`/api/pollution-sources?region=${region}`)
}

// 차트 데이터 조회
export async function getChartData(region: string, timeRange: string) {
  return apiCall(`/api/chart-data?region=${region}&timeRange=${timeRange}`)
}

// 어종 데이터 업데이트
export async function updateSpecies(speciesName: string, data: any) {
  return apiCall(`/api/species/${encodeURIComponent(speciesName)}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

// 새 어종 추가
export async function addSpecies(data: any) {
  return apiCall("/api/species", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

// 지역 데이터 업데이트
export async function updateRegionData(region: string, timeRange: string, data: any) {
  return apiCall(`/api/regions/${region}/${timeRange}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}
