'use client'

import { useState } from 'react'
import { PROPERTY_TYPES, GRADES, PREFECTURES, CATEGORIES } from '@/lib/constants'
import type { Category } from '@/lib/constants'
import { CategoryNoteForm } from './CategoryNoteForm'
import { LightBulbIcon } from '@heroicons/react/24/outline'
import { LightBulbIcon as LightBulbIconSolid } from '@heroicons/react/24/solid'

type Props = {
  onSubmit: (data: FormData, isDraft: boolean) => Promise<void>
  isSubmitting: boolean
  initialData?: {
    name: string
    prefecture: string
    city: string
    address: string
    nearest_station: string
    developer: string
    property_type: string
    grade: string
    total_units: string
    floors: string
    completion_year: string
    visit_date: string
    overall_comment: string
    has_good_ideas: boolean
    category_notes: Record<Category, { note: string; photos: File[] }>
  }
}

export function PropertyForm({ onSubmit, isSubmitting, initialData }: Props) {
  // 基本情報
  const [name, setName] = useState(initialData?.name || '')
  const [prefecture, setPrefecture] = useState(initialData?.prefecture || '')
  const [city, setCity] = useState(initialData?.city || '')
  const [address, setAddress] = useState(initialData?.address || '')
  const [nearestStation, setNearestStation] = useState(initialData?.nearest_station || '')
  const [developer, setDeveloper] = useState(initialData?.developer || '')
  const [propertyType, setPropertyType] = useState(initialData?.property_type || '')
  const [grade, setGrade] = useState(initialData?.grade || '')
  const [totalUnits, setTotalUnits] = useState(initialData?.total_units || '')
  const [floors, setFloors] = useState(initialData?.floors || '')
  const [completionYear, setCompletionYear] = useState(initialData?.completion_year || '')

  // レビュー情報
  const [visitDate, setVisitDate] = useState(initialData?.visit_date || new Date().toISOString().split('T')[0])
  const [overallComment, setOverallComment] = useState(initialData?.overall_comment || '')
  const [hasGoodIdeas, setHasGoodIdeas] = useState(initialData?.has_good_ideas || false)

  // カテゴリ別メモの初期値を作成
  const createEmptyCategoryNotes = (): Record<Category, { note: string; photos: File[] }> => {
    const notes = {} as Record<Category, { note: string; photos: File[] }>
    for (const key of Object.keys(CATEGORIES) as Category[]) {
      notes[key] = { note: '', photos: [] }
    }
    return notes
  }

  // カテゴリ別メモ
  const [categoryNotes, setCategoryNotes] = useState<Record<Category, { note: string; photos: File[] }>>(
    initialData?.category_notes || createEmptyCategoryNotes()
  )

  // 現在のステップ（1: 基本情報, 2: カテゴリ別メモ）
  const [step, setStep] = useState(1)

  // カテゴリ別メモの更新
  const updateCategoryNote = (category: Category, note: string, photos: File[]) => {
    setCategoryNotes((prev) => ({
      ...prev,
      [category]: { note, photos },
    }))
  }

  // フォーム送信
  const handleSubmit = async (isDraft: boolean) => {
    const formData = new FormData()

    // 基本情報
    formData.append('name', name)
    formData.append('prefecture', prefecture)
    formData.append('city', city)
    formData.append('address', address)
    formData.append('nearest_station', nearestStation)
    formData.append('developer', developer)
    formData.append('property_type', propertyType)
    formData.append('grade', grade)
    formData.append('total_units', totalUnits)
    formData.append('floors', floors)
    formData.append('completion_year', completionYear)

    // レビュー情報
    formData.append('visit_date', visitDate)
    formData.append('overall_comment', overallComment)
    formData.append('has_good_ideas', String(hasGoodIdeas))
    formData.append('status', isDraft ? 'draft' : 'published')

    // カテゴリ別メモ（JSONとして送信）
    const notesData: Record<string, { note: string; photoCount: number }> = {}
    Object.entries(categoryNotes).forEach(([category, data]) => {
      if (data.note || data.photos.length > 0) {
        notesData[category] = {
          note: data.note,
          photoCount: data.photos.length,
        }
        // 写真は個別に追加
        data.photos.forEach((photo, index) => {
          formData.append(`photo_${category}_${index}`, photo)
        })
      }
    })
    formData.append('category_notes', JSON.stringify(notesData))

    await onSubmit(formData, isDraft)
  }

  // Step 1のバリデーション
  const isStep1Valid = name && prefecture && city && propertyType && grade

  return (
    <div className="pb-24">
      {/* ステップインジケーター */}
      <div className="flex items-center justify-center gap-2 py-4 bg-white border-b border-gray-100">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
          step === 1 ? 'bg-primary-600 text-white' : 'bg-primary-100 text-primary-600'
        }`}>
          1
        </div>
        <div className="w-8 h-0.5 bg-gray-200" />
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
          step === 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
        }`}>
          2
        </div>
      </div>

      {step === 1 ? (
        // Step 1: 基本情報
        <div className="p-4 space-y-4">
          <h2 className="font-bold text-lg text-primary-900">基本情報</h2>

          {/* 物件名 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              物件名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例: パークタワー晴海"
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
                placeholder="例: 中央区"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* 番地以下 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              番地以下
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="例: 晴海2-104-1"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* 最寄り駅 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              最寄り駅
            </label>
            <input
              type="text"
              value={nearestStation}
              onChange={(e) => setNearestStation(e.target.value)}
              placeholder="例: 勝どき駅"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* デベロッパー */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              デベロッパー
            </label>
            <input
              type="text"
              value={developer}
              onChange={(e) => setDeveloper(e.target.value)}
              placeholder="例: 三井不動産レジデンシャル"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                総戸数
              </label>
              <input
                type="number"
                value={totalUnits}
                onChange={(e) => setTotalUnits(e.target.value)}
                placeholder="戸"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                階数
              </label>
              <input
                type="number"
                value={floors}
                onChange={(e) => setFloors(e.target.value)}
                placeholder="階"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                竣工年
              </label>
              <input
                type="number"
                value={completionYear}
                onChange={(e) => setCompletionYear(e.target.value)}
                placeholder="年"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* 見学日 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              見学日 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* 次へボタン */}
          <button
            onClick={() => setStep(2)}
            disabled={!isStep1Valid}
            className="w-full py-3 bg-primary-600 text-white font-medium rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-primary-700 transition-colors"
          >
            次へ（カテゴリ別メモ）
          </button>
        </div>
      ) : (
        // Step 2: カテゴリ別メモ
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg text-primary-900">カテゴリ別メモ</h2>
            <button
              onClick={() => setStep(1)}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              基本情報に戻る
            </button>
          </div>
          <p className="text-sm text-gray-500">
            記録したいカテゴリをタップして、メモや写真を追加してください
          </p>

          {/* カテゴリ別フォーム */}
          <div className="space-y-3">
            {Object.entries(CATEGORIES).map(([key, label]) => (
              <CategoryNoteForm
                key={key}
                category={key as Category}
                label={label}
                note={categoryNotes[key as Category].note}
                photos={categoryNotes[key as Category].photos}
                onChange={(note, photos) => updateCategoryNote(key as Category, note, photos)}
              />
            ))}
          </div>

          {/* 総合コメント */}
          <div className="pt-4 border-t border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              総合コメント
            </label>
            <textarea
              value={overallComment}
              onChange={(e) => setOverallComment(e.target.value)}
              rows={3}
              placeholder="物件全体の感想や気づきをメモ..."
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
        </div>
      )}

      {/* 送信ボタン（固定フッター） */}
      {step === 2 && (
        <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="max-w-3xl mx-auto flex gap-3">
            <button
              onClick={() => handleSubmit(true)}
              disabled={isSubmitting}
              className="flex-1 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              下書き保存
            </button>
            <button
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting}
              className="flex-1 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? '登録中...' : '登録する'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
