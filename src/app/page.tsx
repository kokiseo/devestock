import { supabase } from '@/lib/supabase'
import { PropertyCard } from '@/components/PropertyCard'
import { FilterBar } from '@/components/FilterBar'
import { EmptyState } from '@/components/EmptyState'

// 物件一覧を取得
async function getProperties(searchParams: {
  prefecture?: string
  property_type?: string
  grade?: string
  ideas_only?: string
  q?: string
}) {
  let query = supabase
    .from('properties')
    .select(`
      *,
      reviews (
        id,
        has_good_ideas,
        overall_comment,
        category_notes (
          id,
          category,
          note,
          photos (
            id,
            image_url
          )
        )
      )
    `)
    .order('created_at', { ascending: false })

  // フィルタ適用
  if (searchParams.prefecture) {
    query = query.eq('prefecture', searchParams.prefecture)
  }
  if (searchParams.property_type) {
    query = query.eq('property_type', searchParams.property_type)
  }
  if (searchParams.grade) {
    query = query.eq('grade', searchParams.grade)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching properties:', error)
    return []
  }

  let properties = data || []

  // フリーワード検索（物件名 + メモ本文 + 総合コメント）
  if (searchParams.q) {
    const searchTerm = searchParams.q.toLowerCase()
    properties = properties.filter((p) => {
      // 物件名で検索
      if (p.name?.toLowerCase().includes(searchTerm)) return true
      // デベロッパー名で検索
      if (p.developer?.toLowerCase().includes(searchTerm)) return true
      // エリアで検索
      if (p.prefecture?.toLowerCase().includes(searchTerm)) return true
      if (p.city?.toLowerCase().includes(searchTerm)) return true

      // レビュー内を検索
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return p.reviews?.some((r: any) => {
        // 総合コメントで検索
        if (r.overall_comment?.toLowerCase().includes(searchTerm)) return true
        // カテゴリ別メモで検索
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return r.category_notes?.some((n: any) =>
          n.note?.toLowerCase().includes(searchTerm)
        )
      })
    })
  }

  // アイデアありフィルタ
  if (searchParams.ideas_only === 'true') {
    properties = properties.filter((p) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      p.reviews?.some((r: any) => r.has_good_ideas)
    )
  }

  // サムネイル取得
  return properties.map((p) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const firstPhoto = (p.reviews as any)?.[0]?.category_notes?.[0]?.photos?.[0]
    return {
      ...p,
      thumbnail_url: firstPhoto?.image_url || null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      has_good_ideas: p.reviews?.some((r: any) => r.has_good_ideas) || false,
    }
  })
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{
    prefecture?: string
    property_type?: string
    grade?: string
    ideas_only?: string
    q?: string
  }>
}) {
  const params = await searchParams
  const properties = await getProperties(params)

  return (
    <div className="px-4 py-4">
      {/* ヘッダー */}
      <header className="mb-4">
        <h1 className="text-xl font-bold text-primary-900">物件一覧</h1>
      </header>

      {/* フィルタ・検索 */}
      <FilterBar />

      {/* 物件リスト */}
      {properties.length === 0 ? (
        <EmptyState
          title="物件がまだありません"
          description="＋ボタンから最初の物件を登録しましょう"
        />
      ) : (
        <div className="grid gap-4 mt-4">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  )
}
