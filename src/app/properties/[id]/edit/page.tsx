'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'

export default function EditPropertyPage() {
  const router = useRouter()
  const params = useParams()
  const propertyId = params.id as string

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
  const [isSubmitting, setIsSubmitting] = useState(false)

  // データ取得
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/properties/${propertyId}`)
        if (!response.ok) throw new Error('物件が見つかりません')

        const { data } = await response.json()
        const property = data.property
        const review = data.review

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
      } catch (err) {
        setError(err instanceof Error ? err.message : 'エラーが発生しました')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProperty()
  }, [propertyId])

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
    <div className="min-h-screen bg-gray-50 pb-20">
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
            <input
              type="text"
              value={prefecture}
              onChange={(e) => setPrefecture(e.target.value)}
              required
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
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

        {/* 番地以下 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">番地以下</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* 最寄り駅 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">最寄り駅</label>
          <input
            type="text"
            value={nearestStation}
            onChange={(e) => setNearestStation(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
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

        {/* 総合コメント */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">総合コメント</label>
          <textarea
            value={overallComment}
            onChange={(e) => setOverallComment(e.target.value)}
            rows={4}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
          />
        </div>

        {/* アイデアフラグ */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="hasGoodIdeas"
            checked={hasGoodIdeas}
            onChange={(e) => setHasGoodIdeas(e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <label htmlFor="hasGoodIdeas" className="text-sm text-gray-700">
            使えるアイデアあり
          </label>
        </div>

        {/* 送信ボタン */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? '更新中...' : '更新する'}
        </button>
      </form>
    </div>
  )
}
