import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { PROPERTY_TYPES, GRADES, CATEGORIES } from '@/lib/constants'
import { CategoryAccordion } from '@/components/CategoryAccordion'
import {
  ChevronLeftIcon,
  PencilIcon,
  MapPinIcon,
  BuildingOffice2Icon,
  CalendarIcon,
} from '@heroicons/react/24/outline'
import { LightBulbIcon as LightBulbIconSolid } from '@heroicons/react/24/solid'

// 物件詳細を取得
async function getProperty(id: string) {
  const { data, error } = await supabase
    .from('properties')
    .select(`
      *,
      reviews (
        *,
        category_notes (
          *,
          photos (*)
        )
      )
    `)
    .eq('id', id)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const property = await getProperty(id)

  if (!property) {
    notFound()
  }

  const review = property.reviews?.[0]
  const categoryNotes = review?.category_notes || []

  // カテゴリごとにグループ化
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const notesByCategory: Record<string, any> = {}
  for (const note of categoryNotes) {
    notesByCategory[note.category] = note
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* ヘッダー */}
      <header className="sticky top-0 bg-white border-b border-gray-200 z-40">
        <div className="flex items-center justify-between h-14 px-4">
          <Link href="/" className="tap-target flex items-center justify-center -ml-2">
            <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
          </Link>
          <h1 className="flex-1 text-center font-bold text-primary-900 truncate px-2">
            {property.name}
          </h1>
          <Link
            href={`/properties/${property.id}/edit`}
            className="tap-target flex items-center justify-center -mr-2"
          >
            <PencilIcon className="w-5 h-5 text-gray-600" />
          </Link>
        </div>
      </header>

      {/* 基本情報 */}
      <section className="bg-white p-4 border-b border-gray-100">
        {/* タグ */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="inline-block px-2.5 py-1 text-sm bg-primary-100 text-primary-700 rounded">
            {PROPERTY_TYPES[property.property_type as keyof typeof PROPERTY_TYPES]}
          </span>
          <span className="inline-block px-2.5 py-1 text-sm bg-gray-100 text-gray-700 rounded">
            {GRADES[property.grade as keyof typeof GRADES]}
          </span>
          {review?.has_good_ideas && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-sm bg-yellow-100 text-yellow-700 rounded">
              <LightBulbIconSolid className="w-4 h-4" />
              アイデアあり
            </span>
          )}
        </div>

        {/* 物件名 */}
        <h2 className="text-xl font-bold text-primary-900 mb-3">{property.name}</h2>

        {/* 詳細情報 */}
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <MapPinIcon className="w-4 h-4 text-gray-400" />
            <span>
              {property.prefecture} {property.city}
              {property.address && ` ${property.address}`}
            </span>
          </div>
          {property.nearest_station && (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8m-8 4h8m-4 4v4m-4-4h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>{property.nearest_station}</span>
            </div>
          )}
          {property.developer && (
            <div className="flex items-center gap-2">
              <BuildingOffice2Icon className="w-4 h-4 text-gray-400" />
              <span>{property.developer}</span>
            </div>
          )}
          {review?.visit_date && (
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-gray-400" />
              <span>見学日: {new Date(review.visit_date).toLocaleDateString('ja-JP')}</span>
            </div>
          )}
        </div>

        {/* 規模情報 */}
        {(property.total_units || property.floors || property.completion_year) && (
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100 text-sm">
            {property.total_units && (
              <div>
                <span className="text-gray-500">総戸数</span>
                <span className="ml-1 font-medium">{property.total_units}戸</span>
              </div>
            )}
            {property.floors && (
              <div>
                <span className="text-gray-500">階数</span>
                <span className="ml-1 font-medium">{property.floors}階</span>
              </div>
            )}
            {property.completion_year && (
              <div>
                <span className="text-gray-500">竣工</span>
                <span className="ml-1 font-medium">{property.completion_year}年</span>
              </div>
            )}
          </div>
        )}
      </section>

      {/* カテゴリ別メモ */}
      <section className="p-4">
        <h3 className="font-bold text-primary-900 mb-3">カテゴリ別メモ</h3>
        <div className="space-y-2">
          {Object.entries(CATEGORIES).map(([key, label]) => {
            const note = notesByCategory[key]
            if (!note) return null

            return (
              <CategoryAccordion
                key={key}
                label={label}
                note={note.note}
                photos={note.photos || []}
              />
            )
          })}
          {Object.keys(notesByCategory).length === 0 && (
            <p className="text-gray-500 text-sm py-4 text-center">
              メモがまだありません
            </p>
          )}
        </div>
      </section>

      {/* 総合コメント */}
      {review?.overall_comment && (
        <section className="p-4 bg-white border-t border-gray-100">
          <h3 className="font-bold text-primary-900 mb-2">総合コメント</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{review.overall_comment}</p>
        </section>
      )}
    </div>
  )
}
