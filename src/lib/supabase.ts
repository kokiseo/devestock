// Supabaseクライアント設定
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// ブラウザ・サーバー共用クライアント
// 注: 本番環境ではSupabase CLIで生成した型を使用することを推奨
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Storage用のバケット名
export const STORAGE_BUCKET = 'property-photos'
