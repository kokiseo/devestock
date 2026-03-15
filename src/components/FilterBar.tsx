'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PROPERTY_TYPES, GRADES, PREFECTURES } from '@/lib/constants'
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline'

export function FilterBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchText, setSearchText] = useState(searchParams.get('q') || '')

  // 現在のフィルタ値
  const currentPrefecture = searchParams.get('prefecture') || ''
  const currentType = searchParams.get('property_type') || ''
  const currentGrade = searchParams.get('grade') || ''
  const ideasOnly = searchParams.get('ideas_only') === 'true'

  // アクティブなフィルタ数
  const activeFilterCount = [currentPrefecture, currentType, currentGrade, ideasOnly ? 'true' : ''].filter(Boolean).length

  // URLパラメータを更新
  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/?${params.toString()}`)
  }

  // 検索実行
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateParams('q', searchText)
  }

  // フィルタをクリア
  const clearFilters = () => {
    router.push('/')
    setSearchText('')
  }

  return (
    <div className="space-y-3">
      {/* 検索バー */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="物件名で検索..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
        <button
          type="button"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`relative px-3 py-2.5 border rounded-lg tap-target ${
            activeFilterCount > 0
              ? 'border-primary-500 bg-primary-50 text-primary-700'
              : 'border-gray-200 text-gray-600'
          }`}
        >
          <FunnelIcon className="w-5 h-5" />
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </form>

      {/* フィルタパネル */}
      {isFilterOpen && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
          {/* 都道府県 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              エリア
            </label>
            <select
              value={currentPrefecture}
              onChange={(e) => updateParams('prefecture', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">すべて</option>
              {PREFECTURES.map((pref) => (
                <option key={pref} value={pref}>{pref}</option>
              ))}
            </select>
          </div>

          {/* 物件タイプ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              物件タイプ
            </label>
            <select
              value={currentType}
              onChange={(e) => updateParams('property_type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">すべて</option>
              {Object.entries(PROPERTY_TYPES).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          {/* グレード */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              グレード
            </label>
            <select
              value={currentGrade}
              onChange={(e) => updateParams('grade', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">すべて</option>
              {Object.entries(GRADES).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          {/* アイデアありのみ */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="ideas_only"
              checked={ideasOnly}
              onChange={(e) => updateParams('ideas_only', e.target.checked ? 'true' : '')}
              className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="ideas_only" className="text-sm text-gray-700">
              アイデアありのみ表示
            </label>
          </div>

          {/* クリアボタン */}
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="w-4 h-4" />
              フィルタをクリア
            </button>
          )}
        </div>
      )}
    </div>
  )
}
