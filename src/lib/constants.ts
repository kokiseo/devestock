// マスタデータ定義

// 物件タイプ
export const PROPERTY_TYPES = {
  tower: 'タワーマンション',
  large_scale: '大規模マンション',
  mid_scale: '中規模マンション',
  small_scale: '小規模マンション',
  low_rise: '低層マンション',
  detached: '戸建（分譲）',
  mixed_use: '複合開発',
} as const

export type PropertyType = keyof typeof PROPERTY_TYPES

// グレード
export const GRADES = {
  premium: 'プレミアム',
  high: 'ハイグレード',
  standard: 'スタンダード',
  compact: 'コンパクト',
} as const

export type Grade = keyof typeof GRADES

// カテゴリ
export const CATEGORIES = {
  exterior: '外観',
  entrance: 'エントランス',
  common_area: '共用部',
  corridor: '廊下まわり',
  floor_plan: '間取り',
  equipment: '設備仕様',
  landscape: 'ランドスケープ',
  sales_center: '販売センター',
} as const

export type Category = keyof typeof CATEGORIES

// 都道府県
export const PREFECTURES = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
  '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
  '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
  '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県',
] as const

export type Prefecture = typeof PREFECTURES[number]
