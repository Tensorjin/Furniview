"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/80 backdrop-blur-md">
      <div className="container flex h-16 items-center px-4 sm:px-8 lg:px-12">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-medium text-primary transition-all duration-300 hover:opacity-80">
            furniview
          </span>
        </Link>
        <nav className="hidden ml-auto md:flex md:items-center gap-8">
          <Link
            href="/browse"
            className="text-sm font-medium text-foreground-muted hover:text-foreground transition-colors duration-200 animate-fade-in stagger-1"
          >
            Browse
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-medium text-foreground-muted hover:text-foreground transition-colors duration-200 animate-fade-in stagger-3"
          >
            Pricing
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-foreground-muted hover:text-foreground transition-colors duration-200 animate-fade-in stagger-4"
          >
            About
          </Link>
          <Link href="/contact">
            <Button variant="outline" className="ml-4 animate-fade-in stagger-5">
              Contact
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="animate-fade-in stagger-5">Get Started</Button>
          </Link>
        </nav>
        <div className="flex md:hidden ml-auto">
          <Button variant="ghost" className="px-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <span className="sr-only">Toggle menu</span>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="fixed inset-0 z-50 bg-white px-6 py-6 animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-xl font-medium">furniview</span>
              </Link>
              <Button variant="ghost" className="px-2" onClick={() => setMobileMenuOpen(false)}>
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" />
              </Button>
            </div>
            <nav className="flex flex-col space-y-6">
              <Link
                href="/browse"
                className="text-base font-medium text-foreground-muted hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse
              </Link>
              <Link
                href="/pricing"
                className="text-base font-medium text-foreground-muted hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/about"
                className="text-base font-medium text-foreground-muted hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-base font-medium text-foreground-muted hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <Link href="/signup" className="text-base font-medium" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full">Get Started</Button>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
