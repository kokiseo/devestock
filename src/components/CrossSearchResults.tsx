'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PROPERTY_TYPES, GRADES } from '@/lib/constants'
import type { CrossSearchResult } from '@/lib/types'
import { PhotoModal } from './PhotoModal'

type Props = {
  results: CrossSearchResult[]
}

export function CrossSearchResults({ results }: Props) {
  const [selectedPhotos, setSelectedPhotos] = useState<{
    photos: { id: string; image_url: string; caption: string | null }[]
    index: number
  } | null>(null)

  return (
    <>
      <div className="space-y-4">
        {results.map((result) => (
          <div
            key={result.category_note.id}
            className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
          >
            {/* 物件情報ヘッダー */}
            <Link
              href={`/properties/${result.property?.id}`}
              className="block p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-primary-900">
                    {result.property?.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {result.property?.developer}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs px-2 py-0.5 bg-primary-100 text-primary-700 rounded">
                    {PROPERTY_TYPES[result.property?.property_type as keyof typeof PROPERTY_TYPES]}
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                    {GRADES[result.property?.grade as keyof typeof GRADES]}
                  </span>
                </div>
              </div>
            </Link>

            {/* メモ内容 */}
            <div className="p-3">
              {result.category_note.note && (
                <p className="text-gray-700 whitespace-pre-wrap text-sm">
                  {result.category_note.note}
                </p>
              )}

              {/* 写真 */}
              {result.photos.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {result.photos.map((photo, index) => (
                    <button
                      key={photo.id}
                      onClick={() =>
                        setSelectedPhotos({
                          photos: result.photos,
                          index,
                        })
                      }
                      className="relative w-20 h-20 rounded-lg overflow-hidden"
                    >
                      <Image
                        src={photo.image_url}
                        alt={photo.caption || '写真'}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 写真モーダル */}
      {selectedPhotos && (
        <PhotoModal
          photos={selectedPhotos.photos}
          initialIndex={selectedPhotos.index}
          onClose={() => setSelectedPhotos(null)}
        />
      )}
    </>
  )
}
