'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import type { Category } from '@/lib/constants'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CameraIcon,
  XMarkIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline'

type Props = {
  category: Category
  label: string
  note: string
  photos: File[]
  onChange: (note: string, photos: File[]) => void
}

export function CategoryNoteForm({ category, label, note, photos, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ファイル選択時
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // プレビューURLを生成
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file))
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls])

    // 親に通知
    onChange(note, [...photos, ...files])

    // input をリセット
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // 写真を削除
  const removePhoto = (index: number) => {
    // プレビューURLを解放
    URL.revokeObjectURL(previewUrls[index])

    const newPreviewUrls = previewUrls.filter((_, i) => i !== index)
    const newPhotos = photos.filter((_, i) => i !== index)

    setPreviewUrls(newPreviewUrls)
    onChange(note, newPhotos)
  }

  // 入力があるかどうか
  const hasContent = note || photos.length > 0

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* ヘッダー（アコーディオン） */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-white hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="font-medium text-primary-900">{label}</span>
          {hasContent && (
            <span className="w-2 h-2 bg-primary-500 rounded-full" />
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
        <div className="p-3 pt-0 space-y-3 bg-gray-50">
          {/* メモ入力 */}
          <textarea
            value={note}
            onChange={(e) => onChange(e.target.value, photos)}
            rows={3}
            placeholder={`${label}についてのメモ...`}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none bg-white"
          />

          {/* 写真プレビュー */}
          {previewUrls.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative w-20 h-20">
                  <Image
                    src={url}
                    alt={`${label} 写真 ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 写真追加ボタン */}
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
              id={`photo-${category}`}
            />
            <label
              htmlFor={`photo-${category}`}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-white cursor-pointer transition-colors"
            >
              <PhotoIcon className="w-5 h-5" />
              写真を追加
            </label>
            <button
              type="button"
              onClick={() => {
                // カメラ起動（スマホ対応）
                const input = fileInputRef.current
                if (input) {
                  input.setAttribute('capture', 'environment')
                  input.click()
                  input.removeAttribute('capture')
                }
              }}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-white transition-colors"
            >
              <CameraIcon className="w-5 h-5" />
              撮影
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
