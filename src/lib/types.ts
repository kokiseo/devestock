// TypeScript型定義

import type { PropertyType, Grade, Category } from './constants'

// 物件
export type Property = {
  id: string
  name: string
  prefecture: string
  city: string
  address: string | null
  nearest_station: string | null
  developer: string | null
  property_type: PropertyType
  grade: Grade
  total_units: number | null
  floors: number | null
  completion_year: number | null
  created_at: string
  updated_at: string
  user_id: string | null
}

// レビュー
export type Review = {
  id: string
  property_id: string
  visit_date: string
  overall_comment: string | null
  has_good_ideas: boolean
  status: 'draft' | 'published'
  created_at: string
  updated_at: string
  user_id: string | null
}

// カテゴリ別メモ
export type CategoryNote = {
  id: string
  review_id: string
  category: Category
  note: string
  created_at: string
}

// 写真
export type Photo = {
  id: string
  category_note_id: string
  image_url: string
  caption: string | null
  sort_order: number
  created_at: string
}

// 一覧表示用の簡易型
export type PropertyListItem = Property & {
  thumbnail_url: string | null
  has_good_ideas: boolean
}

// カテゴリ横断検索結果
export type CrossSearchResult = {
  property: Property | null
  category_note: CategoryNote
  photos: Photo[]
}
