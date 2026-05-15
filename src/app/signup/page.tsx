// app/signup/page.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Input } from "@/components/forms/Input"
import { Label } from "@/components/forms/Label"
import { Textarea } from "@/components/forms/Textarea"
import { Hammer, ArrowLeft, X } from "lucide-react"
import { useAuth } from "@/app/context/AuthContext"
import { ALL_LOCATIONS } from "@/lib/locations"

// ── Common skills for quick selection ────────────────────────────────────────
const COMMON_SKILLS = [
  'Plumbing', 'Electrical', 'Carpentry', 'Painting',
  'Air Conditioning', 'Cleaning',
]

interface Category {
  id: string
  name: string
}

export default function SignUp() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = (searchParams.get("type") || "customer") as "customer" | "handyman"
  const { signUp } = useAuth()

  // ── Category list loaded from DB ──────────────────────────────────────────
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    if (role !== 'handyman') return
    fetch('/api/admin/categories')
      .then(r => r.json())
      .then(data => setCategories(Array.isArray(data) ? data : (data.categories ?? [])))
      .catch(() => {/* silently ignore — field just stays empty */})
  }, [role])

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
    serviceArea: "",
    profilePicture: "",
    role,
    bio: "",
    categoryId: "",
  })

  // Skills managed as an array
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [customSkill, setCustomSkill] = useState("")

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    )
  }

  const addCustomSkill = () => {
    const trimmed = customSkill.trim()
    if (trimmed && !selectedSkills.includes(trimmed)) {
      setSelectedSkills(prev => [...prev, trimmed])
    }
    setCustomSkill("")
  }

  const removeSkill = (skill: string) => {
    setSelectedSkills(prev => prev.filter(s => s !== skill))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }
    if (!formData.name || !formData.email) {
      setError("Please fill in all required fields")
      setIsLoading(false)
      return
    }

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        password: formData.password,
        address: formData.address || undefined,
        profilePicture: formData.profilePicture || undefined,
        role: formData.role,
        ...(formData.role === "handyman" && {
          bio: formData.bio || undefined,
          skills: selectedSkills.length > 0 ? selectedSkills : undefined,
          categoryId: formData.categoryId || undefined,
          serviceArea: formData.serviceArea || undefined,
        }),
      }

      await signUp(userData)
      router.push("/")
    } catch (err) {
      console.error("Signup error:", err)
      setError(err instanceof Error ? err.message : "An error occurred during signup")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Link href="/user-type" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Link>

        <Card>
          <CardHeader className="text-center">
            <Hammer className="h-12 w-12 text-blue-600 mx-auto mb-3" />
            <CardTitle className="text-2xl">Create Your Account</CardTitle>
            <CardDescription>
              Join as {role === "handyman" ? "a Handyman" : "a Customer"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ── Basic Information ── */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name" name="name" required
                      placeholder="Enter your full name"
                      value={formData.name} onChange={handleChange}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email" name="email" required type="email"
                      placeholder="Enter your email"
                      value={formData.email} onChange={handleChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone" name="phone" type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone} onChange={handleChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address" name="address"
                      placeholder="Enter your address"
                      value={formData.address} onChange={handleChange}
                    />
                  </div>

                </div>
              </div>

              {/* ── Handyman Professional Info ── */}
              {role === "handyman" && (
                <div className="border-t pt-6 space-y-5">
                  <h3 className="text-lg font-semibold">Professional Information</h3>

                  {/* Bio */}
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio" name="bio" rows={3}
                      placeholder="Tell us about your professional background and experience..."
                      value={formData.bio} onChange={handleChange}
                    />
                  </div>

                  {/* Category — real dropdown from DB */}
                  <div>
                    <Label htmlFor="categoryId">Service Category</Label>
                    <select
                      id="categoryId"
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">— Select a category —</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                    {categories.length === 0 && (
                      <p className="text-xs text-gray-400 mt-1">
                        No categories loaded — you can add one later from your profile.
                      </p>
                    )}
                  </div>

                  {/* Service Area */}
                  <div>
                    <Label htmlFor="serviceArea">Service Area</Label>
                    <select
                      id="serviceArea"
                      name="serviceArea"
                      value={formData.serviceArea}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">— Select your service area —</option>
                      {ALL_LOCATIONS.map(group => (
                        <optgroup key={group.group} label={group.group}>
                          {group.areas.map(area => (
                            <option key={area} value={area}>{area}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    <p className="text-xs text-gray-400 mt-1">The district or area where you provide services</p>
                  </div>

                  {/* Skills — chip selector */}
                  <div>
                    <Label>Skills</Label>

                    {/* Quick-pick chips */}
                    <div className="flex flex-wrap gap-2 mt-2 mb-3">
                      {COMMON_SKILLS.map(skill => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                            selectedSkills.includes(skill)
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                          }`}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>

                    {/* Custom skill input */}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a custom skill…"
                        value={customSkill}
                        onChange={e => setCustomSkill(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') { e.preventDefault(); addCustomSkill() }
                        }}
                      />
                      <Button type="button" onClick={addCustomSkill} className="shrink-0 bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300">
                        Add
                      </Button>
                    </div>

                    {/* Selected skills tags */}
                    {selectedSkills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {selectedSkills.map(skill => (
                          <span
                            key={skill}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-200"
                          >
                            {skill}
                            <button type="button" onClick={() => removeSkill(skill)} className="hover:text-blue-900">
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── Password ── */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Security</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password" name="password" type="password" required
                      placeholder="At least 6 characters"
                      value={formData.password} onChange={handleChange} minLength={6}
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword" name="confirmPassword" type="password" required
                      placeholder="Confirm your password"
                      value={formData.confirmPassword} onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/signin" className="text-blue-600 hover:underline">Sign in</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}