"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { User, LogOut, Settings, Heart, ShoppingBag, UserCircle, Bell } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ProfileDropdownProps {
  isLoggedIn?: boolean
  userName?: string
}

export function ProfileDropdown({ isLoggedIn = false, userName = "" }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="group flex flex-col items-center focus:outline-none transition-transform hover:scale-105"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 p-1.5 text-brand-600 transition-colors group-hover:bg-brand-100">
          <Image src="/icons/user.png" alt="User" width={20} height={20} />
        </div>
        <span className="mt-1 text-xs font-medium">{isLoggedIn ? userName : "সাইনইন"}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-20 mt-2 w-64 origin-top-right animate-slideUp rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="divide-y divide-gray-100">
            {isLoggedIn ? (
              <>
                <div className="p-4">
                  <div className="flex items-center">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full bg-brand-100">
                      <Image
                        src="/placeholder.svg?height=40&width=40"
                        alt={userName}
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{userName}</p>
                      <p className="truncate text-xs text-gray-500">user@example.com</p>
                    </div>
                  </div>
                </div>
                <div className="p-1">
                  <Link
                    href="/profile"
                    className="flex items-center rounded-md px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-brand-50 hover:text-brand-600"
                    onClick={() => setIsOpen(false)}
                  >
                    <UserCircle className="mr-3 h-5 w-5 text-gray-400" />
                    <span>প্রোফাইল</span>
                  </Link>
                  <Link
                    href="/orders"
                    className="flex items-center rounded-md px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-brand-50 hover:text-brand-600"
                    onClick={() => setIsOpen(false)}
                  >
                    <ShoppingBag className="mr-3 h-5 w-5 text-gray-400" />
                    <span>অর্ডার</span>
                    <Badge className="ml-auto bg-brand-100 text-brand-800">৩</Badge>
                  </Link>
                  <Link
                    href="/wishlist"
                    className="flex items-center rounded-md px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-brand-50 hover:text-brand-600"
                    onClick={() => setIsOpen(false)}
                  >
                    <Heart className="mr-3 h-5 w-5 text-gray-400" />
                    <span>উইশলিস্ট</span>
                    <Badge className="ml-auto bg-brand-100 text-brand-800">৫</Badge>
                  </Link>
                  <Link
                    href="/notifications"
                    className="flex items-center rounded-md px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-brand-50 hover:text-brand-600"
                    onClick={() => setIsOpen(false)}
                  >
                    <Bell className="mr-3 h-5 w-5 text-gray-400" />
                    <span>নোটিফিকেশন</span>
                    <Badge className="ml-auto bg-red-100 text-red-800">২</Badge>
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center rounded-md px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-brand-50 hover:text-brand-600"
                    onClick={() => setIsOpen(false)}
                  >
                    <Settings className="mr-3 h-5 w-5 text-gray-400" />
                    <span>সেটিংস</span>
                  </Link>
                </div>
                <div className="p-1">
                  <Link
                    href="/logout"
                    className="flex items-center rounded-md px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-brand-50 hover:text-brand-600"
                    onClick={() => setIsOpen(false)}
                  >
                    <LogOut className="mr-3 h-5 w-5 text-gray-400" />
                    <span>লগআউট</span>
                  </Link>
                </div>
              </>
            ) : (
              <div className="p-1">
                <Link
                  href="/signin"
                  className="flex items-center rounded-md px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-brand-50 hover:text-brand-600"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="mr-3 h-5 w-5 text-gray-400" />
                  <span>সাইন ইন</span>
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center rounded-md px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-brand-50 hover:text-brand-600"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="mr-3 h-5 w-5 text-gray-400" />
                  <span>নতুন অ্যাকাউন্ট তৈরি করুন</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
