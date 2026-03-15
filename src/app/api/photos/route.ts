// 写真API
// POST /api/photos - 写真をアップロード
// DELETE /api/photos - 写真を削除

import { NextRequest, NextResponse } from 'next/server'
import { supabase, STORAGE_BUCKET } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const categoryNoteId = formData.get('category_note_id') as string
    const propertyId = formData.get('property_id') as string

    if (!file || !categoryNoteId) {
      return NextResponse.json(
        { error: 'ファイルとカテゴリメモIDが必要です' },
        { status: 400 }
      )
    }

    // ファイル名を生成
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const filename = `${propertyId}/${timestamp}-${randomStr}.${ext}`

    // Storageにアップロード
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filename, file, {
        contentType: file.type,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json(
        { error: 'アップロードに失敗しました' },
        { status: 500 }
      )
    }

    // 公開URLを取得
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filename)

    // 写真レコードを作成
    const { data: photo, error: insertError } = await supabase
      .from('photos')
      .insert({
        category_note_id: categoryNoteId,
        image_url: urlData.publicUrl,
        sort_order: 0,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Insert error:', insertError)
      return NextResponse.json(
        { error: '写真の保存に失敗しました' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: photo,
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: '予期しないエラーが発生しました' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const photoId = searchParams.get('id')

    if (!photoId) {
      return NextResponse.json(
        { error: '写真IDが必要です' },
        { status: 400 }
      )
    }

    // 写真情報を取得
    const { data: photo } = await supabase
      .from('photos')
      .select('image_url')
      .eq('id', photoId)
      .single()

    if (photo?.image_url) {
      // Storageから削除
      const path = photo.image_url.split('/').slice(-2).join('/')
      await supabase.storage.from(STORAGE_BUCKET).remove([path])
    }

    // DBから削除
    const { error: deleteError } = await supabase
      .from('photos')
      .delete()
      .eq('id', photoId)

    if (deleteError) {
      console.error('Delete error:', deleteError)
      return NextResponse.json(
        { error: '削除に失敗しました' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: '予期しないエラーが発生しました' },
      { status: 500 }
    )
  }
}
