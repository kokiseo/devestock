'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

type Photo = {
  id: string
  image_url: string
  caption: string | null
}

type Props = {
  photos: Photo[]
  initialIndex: number
  onClose: () => void
}

export function PhotoModal({ photos, initialIndex, onClose }: Props) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1))
  }, [photos.length])

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0))
  }, [photos.length])

  // ESCキーで閉じる
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft') {
        goToPrev()
      } else if (e.key === 'ArrowRight') {
        goToNext()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose, goToPrev, goToNext])

  // スクロール無効化
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const currentPhoto = photos[currentIndex]

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* ヘッダー */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 z-10">
        <span className="text-white text-sm">
          {currentIndex + 1} / {photos.length}
        </span>
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center text-white"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>

      {/* 写真 */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative w-full h-full max-w-4xl">
          <Image
            src={currentPhoto.image_url}
            alt={currentPhoto.caption || '写真'}
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
        </div>
      </div>

      {/* 前へボタン */}
      {photos.length > 1 && (
        <button
          onClick={goToPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-black/30 rounded-full text-white"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
      )}

      {/* 次へボタン */}
      {photos.length > 1 && (
        <button
          onClick={goToNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-black/30 rounded-full text-white"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>
      )}

      {/* キャプション */}
      {currentPhoto.caption && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
          <p className="text-white text-center">{currentPhoto.caption}</p>
        </div>
      )}
    </div>
  )
}
