"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"

export default function SignUp() {
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate form submission
    setTimeout(() => {
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-12 md:py-24">
      <Link
        href="/"
        className="absolute top-4 left-4 md:top-8 md:left-8 flex items-center text-sm text-foreground-muted hover:text-foreground transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to home
      </Link>

      <div className="mx-auto max-w-md w-full space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-medium">Create an account</h1>
          <p className="text-foreground-muted">
            Join Furniview to start providing interactive 3D assembly instructions
          </p>
        </div>

        <div className="mb-4 pb-2 border-b border-border/40">
          <h3 className="text-lg font-medium">Sign up with Email</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Company Name</Label>
            <Input id="name" placeholder="Acme Furniture" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@company.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password-confirm">Confirm Password</Label>
            <Input id="password-confirm" type="password" required />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
        <div className="text-center text-sm text-foreground-muted mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-primary underline underline-offset-4">
            Sign in
          </Link>
        </div>

        <div className="text-center text-xs text-foreground-muted">
          By signing up, you agree to our{" "}
          <Link href="/terms" className="text-primary underline underline-offset-4">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-primary underline underline-offset-4">
            Privacy Policy
          </Link>
          .
        </div>
      </div>
    </div>
  )
}
