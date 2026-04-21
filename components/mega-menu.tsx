"use client"

import { useState } from "react"
import Link from "next/link"

interface MegaMenuItem {
  title: string
  href: string
}

interface MegaMenuProps {
  title: string
  items: MegaMenuItem[]
  columns?: number
}

export function MegaMenu({ title, items, columns = 1 }: MegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <li className="py-3 group relative" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <Link href="#" className="flex items-center text-sm font-medium hover:text-gray-200">
        <span>{title}</span>
        <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </Link>
      <div
        className={`absolute left-0 top-full z-10 ${columns > 1 ? "grid" : ""} rounded-b-md bg-white py-2 shadow-lg transition-all duration-200 ${isOpen || "group-hover:block" ? "block" : "hidden"}`}
        style={{
          gridTemplateColumns: columns > 1 ? `repeat(${columns}, minmax(0, 1fr))` : "",
          minWidth: columns > 1 ? "400px" : "200px",
        }}
      >
        {items.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-600"
          >
            {item.title}
          </Link>
        ))}
      </div>
    </li>
  )
}
