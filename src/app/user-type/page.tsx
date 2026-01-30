"use client"

import Link from "next/link"
import { Hammer, User } from "lucide-react"

export default function UserType() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-2 text-blue-600 text-3xl font-bold">
          <Hammer className="w-8 h-8" />
          HandyPro
        </div>
      </div>

      <div className="flex gap-6">
        <Link
          href="/signup?type=customer"
          className="border-2 border-blue-500 rounded-xl p-6 w-44 hover:shadow-md text-center transition"
        >
          <User className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <h3 className="font-semibold">Customer</h3>
          <p className="text-sm text-gray-500">Looking for services</p>
        </Link>

        <Link
          href="/signup?type=handyman"
          className="border-2 border-gray-300 rounded-xl p-6 w-44 hover:shadow-md text-center transition"
        >
          <Hammer className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <h3 className="font-semibold">Handyman</h3>
          <p className="text-sm text-gray-500">Providing services</p>
        </Link>
      </div>
    </div>
  )
}
