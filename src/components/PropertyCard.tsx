import Link from 'next/link'
import Image from 'next/image'
import { PROPERTY_TYPES, GRADES } from '@/lib/constants'
import type { PropertyListItem } from '@/lib/types'
import { LightBulbIcon } from '@heroicons/react/24/solid'
import { MapPinIcon } from '@heroicons/react/24/outline'

const GRADE_STYLES = {
  premium: 'bg-amber-100 text-amber-800',
  high:    'bg-blue-100 text-blue-800',
  standard:'bg-gray-100 text-gray-600',
  compact: 'bg-green-100 text-green-700',
} as const

export function PropertyCard({ property }: { property: PropertyListItem }) {
  return (
    <Link
      href={`/properties/${property.id}`}
      className="block bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
      {/* ヒーロー写真 */}
      <div className="relative w-full aspect-[4/3] bg-gray-100">
        {property.thumbnail_url ? (
          <Image
            src={property.thumbnail_url}
            alt={property.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) calc(50vw - 12px), 400px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
            </svg>
          </div>
        )}

        {/* 物件タイプ（写真下部グラデーションオーバーレイ） */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-2.5 py-2">
          <span className="text-[11px] font-medium text-white">
            {PROPERTY_TYPES[property.property_type as keyof typeof PROPERTY_TYPES]}
          </span>
        </div>

        {/* アイデアフラグ */}
        {property.has_good_ideas && (
          <div className="absolute top-2 right-2 bg-yellow-400 rounded-full p-1">
            <LightBulbIcon className="w-3.5 h-3.5 text-white" />
          </div>
        )}
      </div>

      {/* カード本体 */}
      <div className="p-2.5">
        <h3 className="font-bold text-[13px] text-primary-900 leading-snug line-clamp-2">
          {property.name}
        </h3>

        {property.developer && (
          <p className="text-[11px] text-gray-400 mt-0.5 truncate">{property.developer}</p>
        )}

        {property.price_per_tsubo && (
          <p className="text-[12px] font-bold text-primary-700 mt-1">
            坪{property.price_per_tsubo}万円
          </p>
        )}

        <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-0.5">
          <MapPinIcon className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">
            {property.nearest_station
              ? property.nearest_station
              : `${property.prefecture} ${property.city}`}
          </span>
        </p>

        {/* グレード + スペック */}
        <div className="mt-2 flex items-center justify-between gap-1">
          <span
            className={`px-1.5 py-0.5 text-[10px] font-medium rounded ${
              GRADE_STYLES[property.grade as keyof typeof GRADE_STYLES] ?? 'bg-gray-100 text-gray-600'
            }`}
          >
            {GRADES[property.grade as keyof typeof GRADES]}
          </span>
          <div className="flex gap-2 text-[10px] text-gray-400">
            {property.total_units && <span>{property.total_units}戸</span>}
            {property.floors && <span>{property.floors}F</span>}
            {property.completion_year && <span>{property.completion_year}年</span>}
          </div>
        </div>
      </div>
    </Link>
  )
}
