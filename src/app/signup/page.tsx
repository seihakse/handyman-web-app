"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Input } from "@/components/forms/Input"
import { Label } from "@/components/forms/Label"
import { Textarea } from "@/components/forms/Textarea" // You'll need to create this
import { Hammer, ArrowLeft, Upload } from "lucide-react"

export default function SignUp() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = (searchParams.get("type") || "customer") as "customer" | "handyman"

  const [formData, setFormData] = useState({
    // Basic user fields
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
    profilePicture: "",
    role,
    
    // Handyman profile fields
    bio: "",
    skills: "",
    certificate: "",
    idCardImage: "",
    portfolioImage: "",
    categoryId: "",
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    try {
      // First, create the user
      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        password: formData.password,
        address: formData.address || undefined,
        profilePicture: formData.profilePicture || undefined,
        role: formData.role,
      }

      const userResponse = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      })

      const userResult = await userResponse.json()

      if (userResponse.ok) {
        // If handyman, create the handyman profile
        if (role === "handyman") {
          const handymanProfileData = {
            userId: userResult.user.id,
            bio: formData.bio || undefined,
            skills: formData.skills || undefined,
            certificate: formData.certificate || undefined,
            idCardImage: formData.idCardImage || undefined,
            portfolioImage: formData.portfolioImage || undefined,
            categoryId: formData.categoryId || undefined,
          }

          const profileResponse = await fetch("/api/handyman/profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(handymanProfileData),
          })

          if (!profileResponse.ok) {
            console.error("Failed to create handyman profile")
            // You might want to handle this error appropriately
          }
        }

        router.push("/signin?message=Account created successfully")
      } else {
        alert(userResult.error || "Signup failed")
      }
    } catch (error) {
      console.error("Signup error:", error)
      alert("An error occurred during signup")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl"> {/* Increased max width for more fields */}
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
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="md:col-span-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      required
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Email */}
                  <div className="md:col-span-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      required
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      placeholder="Enter your address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Profile Picture */}
                  <div className="md:col-span-2">
                    <Label htmlFor="profilePicture">Profile Picture URL</Label>
                    <Input
                      id="profilePicture"
                      name="profilePicture"
                      type="url"
                      placeholder="https://example.com/photo.jpg"
                      value={formData.profilePicture}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Handyman Profile Section */}
              {role === "handyman" && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Professional Information</h3>
                  <div className="space-y-4">
                    {/* Bio */}
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        placeholder="Tell us about your professional background and experience..."
                        value={formData.bio}
                        onChange={handleChange}
                        rows={3}
                      />
                    </div>

                    {/* Skills */}
                    <div>
                      <Label htmlFor="skills">Skills</Label>
                      <Input
                        id="skills"
                        name="skills"
                        placeholder="e.g., Plumbing, Electrical, Carpentry, Painting"
                        value={formData.skills}
                        onChange={handleChange}
                      />
                      <p className="text-sm text-gray-500 mt-1">Separate skills with commas</p>
                    </div>

                    {/* Category */}
                    <div>
                      <Label htmlFor="categoryId">Service Category</Label>
                      <Input
                        id="categoryId"
                        name="categoryId"
                        placeholder="e.g., plumbing, electrical, construction"
                        value={formData.categoryId}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Certificate */}
                    <div>
                      <Label htmlFor="certificate">Certificate URL</Label>
                      <Input
                        id="certificate"
                        name="certificate"
                        type="url"
                        placeholder="https://example.com/certificate.jpg"
                        value={formData.certificate}
                        onChange={handleChange}
                      />
                    </div>

                    {/* ID Card Image */}
                    <div>
                      <Label htmlFor="idCardImage">ID Card Image URL</Label>
                      <Input
                        id="idCardImage"
                        name="idCardImage"
                        type="url"
                        placeholder="https://example.com/id-card.jpg"
                        value={formData.idCardImage}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Portfolio Image */}
                    <div>
                      <Label htmlFor="portfolioImage">Portfolio Image URL</Label>
                      <Input
                        id="portfolioImage"
                        name="portfolioImage"
                        type="url"
                        placeholder="https://example.com/portfolio-work.jpg"
                        value={formData.portfolioImage}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Password Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Security</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      placeholder="At least 6 characters"
                      value={formData.password}
                      onChange={handleChange}
                      minLength={6}
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
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
              <Link href="/signin" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}