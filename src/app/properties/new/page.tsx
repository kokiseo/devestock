'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PropertyForm } from '@/components/PropertyForm'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function NewPropertyPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: FormData, _isDraft: boolean) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        body: data,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || '登録に失敗しました')
      }

      const result = await response.json()
      router.push(`/properties/${result.data.propertyId}`)
    } catch (error) {
      console.error('Submit error:', error)
      alert(error instanceof Error ? error.message : '登録に失敗しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="sticky top-0 bg-white border-b border-gray-200 z-40">
        <div className="flex items-center h-14 px-4">
          <Link href="/" className="tap-target flex items-center justify-center -ml-2">
            <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
          </Link>
          <h1 className="flex-1 text-center font-bold text-primary-900">物件を登録</h1>
          <div className="w-10" /> {/* バランス用 */}
        </div>
      </header>

      {/* フォーム */}
      <PropertyForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  )
}
