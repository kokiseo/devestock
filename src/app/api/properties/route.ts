// 物件API
// POST /api/properties - 物件を新規登録

import { NextRequest, NextResponse } from 'next/server'
import { supabase, STORAGE_BUCKET } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // 基本情報を取得
    const name = formData.get('name') as string
    const prefecture = formData.get('prefecture') as string
    const city = formData.get('city') as string
    const address = formData.get('address') as string
    const nearestStation = formData.get('nearest_station') as string
    const developer = formData.get('developer') as string
    const propertyType = formData.get('property_type') as string
    const grade = formData.get('grade') as string
    const totalUnits = formData.get('total_units') as string
    const floors = formData.get('floors') as string
    const completionYear = formData.get('completion_year') as string

    // レビュー情報
    const visitDate = formData.get('visit_date') as string
    const overallComment = formData.get('overall_comment') as string
    const hasGoodIdeas = formData.get('has_good_ideas') === 'true'
    const status = formData.get('status') as string

    // カテゴリ別メモ
    const categoryNotesJson = formData.get('category_notes') as string
    const categoryNotesData = JSON.parse(categoryNotesJson || '{}')

    // バリデーション
    if (!name || !prefecture || !city || !propertyType || !grade || !visitDate) {
      return NextResponse.json(
        { error: '必須項目を入力してください' },
        { status: 400 }
      )
    }

    // 1. 物件を作成
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .insert({
        name,
        prefecture,
        city,
        address: address || null,
        nearest_station: nearestStation || null,
        developer: developer || null,
        property_type: propertyType,
        grade,
        total_units: totalUnits ? parseInt(totalUnits) : null,
        floors: floors ? parseInt(floors) : null,
        completion_year: completionYear ? parseInt(completionYear) : null,
      })
      .select()
      .single()

    if (propertyError || !property) {
      console.error('Property insert error:', propertyError)
      return NextResponse.json(
        { error: '物件の登録に失敗しました' },
        { status: 500 }
      )
    }

    // 2. レビューを作成
    const { data: review, error: reviewError } = await supabase
      .from('reviews')
      .insert({
        property_id: property.id,
        visit_date: visitDate,
        overall_comment: overallComment || null,
        has_good_ideas: hasGoodIdeas,
        status: status || 'published',
      })
      .select()
      .single()

    if (reviewError || !review) {
      console.error('Review insert error:', reviewError)
      // ロールバック: 物件を削除
      await supabase.from('properties').delete().eq('id', property.id)
      return NextResponse.json(
        { error: 'レビューの登録に失敗しました' },
        { status: 500 }
      )
    }

    // 3. カテゴリ別メモと写真を作成
    for (const [category, noteData] of Object.entries(categoryNotesData)) {
      const { note, photoCount } = noteData as { note: string; photoCount: number }

      // メモがある場合のみ作成
      if (!note && photoCount === 0) continue

      const { data: categoryNote, error: noteError } = await supabase
        .from('category_notes')
        .insert({
          review_id: review.id,
          category,
          note: note || '',
        })
        .select()
        .single()

      if (noteError || !categoryNote) {
        console.error('Category note insert error:', noteError)
        continue
      }

      // 写真をアップロード
      for (let i = 0; i < photoCount; i++) {
        const photoFile = formData.get(`photo_${category}_${i}`) as File
        if (!photoFile) continue

        // ファイル名を生成
        const timestamp = Date.now()
        const randomStr = Math.random().toString(36).substring(2, 8)
        const ext = photoFile.name.split('.').pop()?.toLowerCase() || 'jpg'
        const filename = `${property.id}/${category}/${timestamp}-${randomStr}.${ext}`

        // Storageにアップロード
        const { error: uploadError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(filename, photoFile, {
            contentType: photoFile.type,
          })

        if (uploadError) {
          console.error('Photo upload error:', uploadError)
          continue
        }

        // 公開URLを取得
        const { data: urlData } = supabase.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(filename)

        // 写真レコードを作成
        await supabase.from('photos').insert({
          category_note_id: categoryNote.id,
          image_url: urlData.publicUrl,
          sort_order: i,
        })
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        propertyId: property.id,
        reviewId: review.id,
      },
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: '予期しないエラーが発生しました' },
      { status: 500 }
    )
  }
}
