// 物件詳細API
// GET /api/properties/[id] - 物件詳細を取得
// PUT /api/properties/[id] - 物件を更新

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    // 物件を取得
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single()

    if (propertyError || !property) {
      return NextResponse.json(
        { error: '物件が見つかりません' },
        { status: 404 }
      )
    }

    // レビューとカテゴリ別メモ・写真を取得
    const { data: review } = await supabase
      .from('reviews')
      .select(`
        *,
        category_notes (
          id,
          category,
          note,
          photos (
            id,
            image_url,
            caption,
            sort_order
          )
        )
      `)
      .eq('property_id', id)
      .single()

    return NextResponse.json({
      success: true,
      data: {
        property,
        review,
        category_notes: review?.category_notes || [],
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const body = await request.json()

    // 物件を更新
    const { error: propertyError } = await supabase
      .from('properties')
      .update({
        name: body.name,
        prefecture: body.prefecture,
        city: body.city,
        address: body.address || null,
        nearest_station: body.nearest_station || null,
        developer: body.developer || null,
        property_type: body.property_type,
        grade: body.grade,
        total_units: body.total_units || null,
        floors: body.floors || null,
        completion_year: body.completion_year || null,
      })
      .eq('id', id)

    if (propertyError) {
      console.error('Property update error:', propertyError)
      return NextResponse.json(
        { error: '物件の更新に失敗しました' },
        { status: 500 }
      )
    }

    // レビューを取得
    const { data: review } = await supabase
      .from('reviews')
      .select('id')
      .eq('property_id', id)
      .single()

    if (review) {
      // レビューを更新
      const { error: reviewError } = await supabase
        .from('reviews')
        .update({
          visit_date: body.visit_date,
          overall_comment: body.overall_comment || null,
          has_good_ideas: body.has_good_ideas || false,
        })
        .eq('id', review.id)

      if (reviewError) {
        console.error('Review update error:', reviewError)
      }

      // カテゴリ別メモを更新
      if (body.category_notes) {
        for (const [category, noteData] of Object.entries(body.category_notes)) {
          const { id: noteId, note } = noteData as { id?: string; note: string }

          if (noteId) {
            // 既存のメモを更新
            if (note) {
              await supabase
                .from('category_notes')
                .update({ note })
                .eq('id', noteId)
            } else {
              // メモが空の場合は削除
              await supabase
                .from('category_notes')
                .delete()
                .eq('id', noteId)
            }
          } else if (note) {
            // 新規メモを作成
            await supabase
              .from('category_notes')
              .insert({
                review_id: review.id,
                category,
                note,
              })
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: { propertyId: id },
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: '予期しないエラーが発生しました' },
      { status: 500 }
    )
  }
}
