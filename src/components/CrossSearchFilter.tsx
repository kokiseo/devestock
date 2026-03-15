'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { PROPERTY_TYPES, GRADES, CATEGORIES, PREFECTURES } from '@/lib/constants'

export function CrossSearchFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentCategory = searchParams.get('category') || ''
  const currentType = searchParams.get('property_type') || ''
  const currentGrade = searchParams.get('grade') || ''
  const currentPrefecture = searchParams.get('prefecture') || ''

  // URLパラメータを更新
  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="bg-white border-b border-gray-200 p-4 space-y-4">
      {/* カテゴリ選択（必須） */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          カテゴリを選択 <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(CATEGORIES).map(([key, label]) => (
            <button
              key={key}
              onClick={() => updateParams('category', key)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentCategory === key
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 絞り込み条件 */}
      <div className="grid grid-cols-3 gap-3">
        {/* 物件タイプ */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">物件タイプ</label>
          <select
            value={currentType}
            onChange={(e) => updateParams('property_type', e.target.value)}
            className="w-full px-2 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">すべて</option>
            {Object.entries(PROPERTY_TYPES).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        {/* グレード */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">グレード</label>
          <select
            value={currentGrade}
            onChange={(e) => updateParams('grade', e.target.value)}
            className="w-full px-2 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">すべて</option>
            {Object.entries(GRADES).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        {/* エリア */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">エリア</label>
          <select
            value={currentPrefecture}
            onChange={(e) => updateParams('prefecture', e.target.value)}
            className="w-full px-2 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">すべて</option>
            {PREFECTURES.map((pref) => (
              <option key={pref} value={pref}>{pref}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
