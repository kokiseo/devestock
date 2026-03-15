import Link from 'next/link'
import Image from 'next/image'
import { PROPERTY_TYPES, GRADES } from '@/lib/constants'
import type { PropertyListItem } from '@/lib/types'
import { LightBulbIcon } from '@heroicons/react/24/solid'

type Props = {
  property: PropertyListItem
}

export function PropertyCard({ property }: Props) {
  return (
    <Link
      href={`/properties/${property.id}`}
      className="block bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="flex">
        {/* サムネイル */}
        <div className="w-28 h-28 flex-shrink-0 bg-gray-100 relative">
          {property.thumbnail_url ? (
            <Image
              src={property.thumbnail_url}
              alt={property.name}
              fill
              className="object-cover"
              sizes="112px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
              </svg>
            </div>
          )}
          {/* アイデアフラグ */}
          {property.has_good_ideas && (
            <div className="absolute top-1 right-1 bg-yellow-400 rounded-full p-1">
              <LightBulbIcon className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        {/* 情報 */}
        <div className="flex-1 p-3 min-w-0">
          <h3 className="font-bold text-primary-900 truncate">{property.name}</h3>
          <p className="text-sm text-gray-600 mt-1">
            {property.prefecture} {property.city}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className="inline-block px-2 py-0.5 text-xs bg-primary-100 text-primary-700 rounded">
              {PROPERTY_TYPES[property.property_type as keyof typeof PROPERTY_TYPES]}
            </span>
            <span className="inline-block px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded">
              {GRADES[property.grade as keyof typeof GRADES]}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
