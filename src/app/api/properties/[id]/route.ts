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

    // レビューを取得
    const { data: review } = await supabase
      .from('reviews')
      .select('*')
      .eq('property_id', id)
      .single()

    return NextResponse.json({
      success: true,
      data: {
        property,
        review,
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

    // レビューを更新（存在する場合）
    if (body.visit_date || body.overall_comment !== undefined || body.has_good_ideas !== undefined) {
      const { error: reviewError } = await supabase
        .from('reviews')
        .update({
          visit_date: body.visit_date,
          overall_comment: body.overall_comment || null,
          has_good_ideas: body.has_good_ideas || false,
        })
        .eq('property_id', id)

      if (reviewError) {
        console.error('Review update error:', reviewError)
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
