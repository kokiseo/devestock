import { supabase } from '@/lib/supabase'
import { CrossSearchFilter } from '@/components/CrossSearchFilter'
import { CrossSearchResults } from '@/components/CrossSearchResults'
import { EmptyState } from '@/components/EmptyState'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

// 横断検索を実行
async function searchCategoryNotes(params: {
  category?: string
  property_type?: string
  grade?: string
  prefecture?: string
}) {
  // カテゴリが選択されていない場合は空配列
  if (!params.category) {
    return []
  }

  // カテゴリ別メモを取得（リレーション含む）
  const query = supabase
    .from('category_notes')
    .select(`
      *,
      photos (*),
      review:reviews!inner (
        *,
        property:properties!inner (*)
      )
    `)
    .eq('category', params.category)

  const { data, error } = await query

  if (error) {
    console.error('Search error:', error)
    return []
  }

  // フィルタ適用（プロパティ側）
  let results = data || []

  if (params.property_type) {
    results = results.filter(
      (item) => item.review?.property?.property_type === params.property_type
    )
  }

  if (params.grade) {
    results = results.filter(
      (item) => item.review?.property?.grade === params.grade
    )
  }

  if (params.prefecture) {
    results = results.filter(
      (item) => item.review?.property?.prefecture === params.prefecture
    )
  }

  // 結果を整形
  return results.map((item) => ({
    property: item.review?.property,
    category_note: {
      id: item.id,
      review_id: item.review_id,
      category: item.category,
      note: item.note,
      created_at: item.created_at,
    },
    photos: item.photos || [],
  }))
}

export default async function CrossSearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string
    property_type?: string
    grade?: string
    prefecture?: string
  }>
}) {
  const params = await searchParams
  const results = await searchCategoryNotes(params)

  const hasFilters = params.category

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-200 p-4">
        <h1 className="text-xl font-bold text-primary-900">カテゴリ横断検索</h1>
        <p className="text-sm text-gray-500 mt-1">
          物件タイプ × カテゴリで一覧比較
        </p>
      </header>

      {/* フィルタ */}
      <CrossSearchFilter />

      {/* 結果 */}
      <div className="p-4">
        {!hasFilters ? (
          <EmptyState
            title="カテゴリを選択してください"
            description="フィルタを設定すると検索結果が表示されます"
            icon={<MagnifyingGlassIcon className="w-8 h-8 text-gray-400" />}
          />
        ) : results.length === 0 ? (
          <EmptyState
            title="該当する記録がありません"
            description="フィルタ条件を変更してください"
          />
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              {results.length}件の記録が見つかりました
            </p>
            <CrossSearchResults results={results} />
          </>
        )}
      </div>
    </div>
  )
}
