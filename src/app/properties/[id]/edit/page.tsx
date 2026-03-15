'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { CATEGORIES, PROPERTY_TYPES, GRADES, PREFECTURES } from '@/lib/constants'
import type { Category } from '@/lib/constants'
import { ChevronLeftIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
import { LightBulbIcon } from '@heroicons/react/24/outline'
import { LightBulbIcon as LightBulbIconSolid } from '@heroicons/react/24/solid'

type CategoryNoteData = {
  id?: string
  note: string
}

export default function EditPropertyPage() {
  const router = useRouter()
  const params = useParams()
  const propertyId = params.id as string

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 物件データ
  const [name, setName] = useState('')
  const [prefecture, setPrefecture] = useState('')
  const [city, setCity] = useState('')
  const [address, setAddress] = useState('')
  const [nearestStation, setNearestStation] = useState('')
  const [developer, setDeveloper] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [grade, setGrade] = useState('')
  const [totalUnits, setTotalUnits] = useState('')
  const [floors, setFloors] = useState('')
  const [completionYear, setCompletionYear] = useState('')
  const [visitDate, setVisitDate] = useState('')
  const [overallComment, setOverallComment] = useState('')
  const [hasGoodIdeas, setHasGoodIdeas] = useState(false)

  // カテゴリ別メモ
  const [categoryNotes, setCategoryNotes] = useState<Record<Category, CategoryNoteData>>(
    Object.fromEntries(
      Object.keys(CATEGORIES).map((key) => [key, { note: '' }])
    ) as Record<Category, CategoryNoteData>
  )

  // アコーディオン開閉状態
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set())

  // データ取得
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/properties/${propertyId}`)
        if (!response.ok) throw new Error('物件が見つかりません')

        const { data } = await response.json()
        const property = data.property
        const review = data.review
        const notes = data.category_notes || []

        setName(property.name || '')
        setPrefecture(property.prefecture || '')
        setCity(property.city || '')
        setAddress(property.address || '')
        setNearestStation(property.nearest_station || '')
        setDeveloper(property.developer || '')
        setPropertyType(property.property_type || '')
        setGrade(property.grade || '')
        setTotalUnits(property.total_units?.toString() || '')
        setFloors(property.floors?.toString() || '')
        setCompletionYear(property.completion_year?.toString() || '')
        setVisitDate(review?.visit_date || '')
        setOverallComment(review?.overall_comment || '')
        setHasGoodIdeas(review?.has_good_ideas || false)

        // カテゴリ別メモをセット
        const notesMap = Object.fromEntries(
          Object.keys(CATEGORIES).map((key) => [key, { note: '' }])
        ) as Record<Category, CategoryNoteData>

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        notes.forEach((n: any) => {
          notesMap[n.category as Category] = {
            id: n.id,
            note: n.note || '',
          }
        })
        setCategoryNotes(notesMap)

        // メモがあるカテゴリを開く
        const openSet = new Set<string>()
        notes.forEach((n: { category: string; note: string }) => {
          if (n.note) openSet.add(n.category)
        })
        setOpenCategories(openSet)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'エラーが発生しました')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProperty()
  }, [propertyId])

  // カテゴリの開閉
  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(category)) {
        newSet.delete(category)
      } else {
        newSet.add(category)
      }
      return newSet
    })
  }

  // カテゴリ別メモの更新
  const updateCategoryNote = (category: Category, note: string) => {
    setCategoryNotes((prev) => ({
      ...prev,
      [category]: { ...prev[category], note },
    }))
  }

  // 更新処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          prefecture,
          city,
          address,
          nearest_station: nearestStation,
          developer,
          property_type: propertyType,
          grade,
          total_units: totalUnits ? parseInt(totalUnits) : null,
          floors: floors ? parseInt(floors) : null,
          completion_year: completionYear ? parseInt(completionYear) : null,
          visit_date: visitDate,
          overall_comment: overallComment,
          has_good_ideas: hasGoodIdeas,
          category_notes: categoryNotes,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || '更新に失敗しました')
      }

      router.push(`/properties/${propertyId}`)
    } catch (err) {
      alert(err instanceof Error ? err.message : '更新に失敗しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* ヘッダー */}
      <header className="sticky top-0 bg-white border-b border-gray-200 z-40">
        <div className="flex items-center h-14 px-4">
          <Link
            href={`/properties/${propertyId}`}
            className="tap-target flex items-center justify-center -ml-2"
          >
            <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
          </Link>
          <h1 className="flex-1 text-center font-bold text-primary-900">物件を編集</h1>
          <div className="w-10" />
        </div>
      </header>

      {/* フォーム */}
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {/* 基本情報セクション */}
        <section className="bg-white rounded-lg p-4 space-y-4">
          <h2 className="font-bold text-primary-900">基本情報</h2>

          {/* 物件名 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              物件名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* 都道府県・市区町村 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                都道府県 <span className="text-red-500">*</span>
              </label>
              <select
                value={prefecture}
                onChange={(e) => setPrefecture(e.target.value)}
                required
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">選択</option>
                {PREFECTURES.map((pref) => (
                  <option key={pref} value={pref}>{pref}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                市区町村 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* 番地・最寄り駅 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">番地以下</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">最寄り駅</label>
              <input
                type="text"
                value={nearestStation}
                onChange={(e) => setNearestStation(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* デベロッパー */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">デベロッパー</label>
            <input
              type="text"
              value={developer}
              onChange={(e) => setDeveloper(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* 物件タイプ・グレード */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                物件タイプ <span className="text-red-500">*</span>
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                required
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">選択</option>
                {Object.entries(PROPERTY_TYPES).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                グレード <span className="text-red-500">*</span>
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                required
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">選択</option>
                {Object.entries(GRADES).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 総戸数・階数・竣工年 */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">総戸数</label>
              <input
                type="number"
                value={totalUnits}
                onChange={(e) => setTotalUnits(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">階数</label>
              <input
                type="number"
                value={floors}
                onChange={(e) => setFloors(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">竣工年</label>
              <input
                type="number"
                value={completionYear}
                onChange={(e) => setCompletionYear(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* 見学日 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">見学日</label>
            <input
              type="date"
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </section>

        {/* カテゴリ別メモセクション */}
        <section className="bg-white rounded-lg p-4 space-y-3">
          <h2 className="font-bold text-primary-900">カテゴリ別メモ</h2>

          {Object.entries(CATEGORIES).map(([key, label]) => {
            const category = key as Category
            const isOpen = openCategories.has(key)
            const hasContent = categoryNotes[category]?.note

            return (
              <div key={key} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleCategory(key)}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-primary-900">{label}</span>
                    {hasContent && (
                      <span className="w-2 h-2 bg-primary-500 rounded-full" />
                    )}
                  </div>
                  {isOpen ? (
                    <ChevronUpIcon className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                  )}
                </button>

                {isOpen && (
                  <div className="p-3 bg-white">
                    <textarea
                      value={categoryNotes[category]?.note || ''}
                      onChange={(e) => updateCategoryNote(category, e.target.value)}
                      rows={4}
                      placeholder={`${label}についてのメモ...`}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    />
                  </div>
                )}
              </div>
            )
          })}
        </section>

        {/* 総合コメント・アイデアフラグ */}
        <section className="bg-white rounded-lg p-4 space-y-4">
          <h2 className="font-bold text-primary-900">総合評価</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">総合コメント</label>
            <textarea
              value={overallComment}
              onChange={(e) => setOverallComment(e.target.value)}
              rows={4}
              placeholder="物件全体の感想や気づき..."
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>

          {/* アイデアフラグ */}
          <button
            type="button"
            onClick={() => setHasGoodIdeas(!hasGoodIdeas)}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg border-2 transition-colors ${
              hasGoodIdeas
                ? 'border-yellow-400 bg-yellow-50 text-yellow-700'
                : 'border-gray-200 text-gray-600'
            }`}
          >
            {hasGoodIdeas ? (
              <LightBulbIconSolid className="w-5 h-5 text-yellow-500" />
            ) : (
              <LightBulbIcon className="w-5 h-5" />
            )}
            使えるアイデアあり
          </button>
        </section>
      </form>

      {/* 送信ボタン（固定フッター） */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? '更新中...' : '更新する'}
          </button>
        </div>
      </div>
    </div>
  )
}
