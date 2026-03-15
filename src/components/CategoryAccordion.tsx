'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
import { PhotoModal } from './PhotoModal'

type Photo = {
  id: string
  image_url: string
  caption: string | null
}

type Props = {
  label: string
  note: string
  photos: Photo[]
}

export function CategoryAccordion({ label, note, photos }: Props) {
  const [isOpen, setIsOpen] = useState(true)
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null)

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* ヘッダー */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="font-medium text-primary-900">{label}</span>
          {photos.length > 0 && (
            <span className="text-xs text-gray-500">({photos.length}枚)</span>
          )}
        </div>
        {isOpen ? (
          <ChevronUpIcon className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDownIcon className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {/* コンテンツ */}
      {isOpen && (
        <div className="p-3 pt-0 border-t border-gray-100">
          {/* メモ */}
          {note && (
            <p className="text-gray-700 whitespace-pre-wrap mb-3">{note}</p>
          )}

          {/* 写真 */}
          {photos.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {photos.map((photo, index) => (
                <button
                  key={photo.id}
                  onClick={() => setSelectedPhotoIndex(index)}
                  className="relative w-20 h-20 rounded-lg overflow-hidden"
                >
                  <Image
                    src={photo.image_url}
                    alt={photo.caption || `写真 ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 写真モーダル */}
      {selectedPhotoIndex !== null && (
        <PhotoModal
          photos={photos}
          initialIndex={selectedPhotoIndex}
          onClose={() => setSelectedPhotoIndex(null)}
        />
      )}
    </div>
  )
}
