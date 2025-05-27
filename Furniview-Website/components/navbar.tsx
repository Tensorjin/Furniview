"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, signOut, isLoading } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    setMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/80 backdrop-blur-md dark:bg-background-subtle/80">
      <div className="container flex h-16 items-center px-4 sm:px-8 lg:px-12">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-medium text-primary transition-all duration-300 hover:opacity-80">
            furniview
          </span>
        </Link>
        <nav className="hidden ml-auto md:flex md:items-center gap-4">
          <Link
            href="/browse"
            className="text-sm font-medium text-foreground-muted hover:text-foreground transition-colors duration-200"
          >
            Browse
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-medium text-foreground-muted hover:text-foreground transition-colors duration-200"
          >
            Pricing
          </Link>
          <Link
            href="/features"
            className="text-sm font-medium text-foreground-muted hover:text-foreground transition-colors duration-200"
          >
            Features
          </Link>
          
          <div className="flex items-center gap-2 ml-4">
            {isLoading ? (
              <div className="animate-pulse h-10 w-24 bg-gray-300 rounded-md"></div>
            ) : user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="outline">
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                  </Button>
                </Link>
                <Button onClick={handleSignOut} variant="ghost" size="icon" title="Logout">
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link href="/signup"> 
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>
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
          <div className="fixed inset-0 z-[100] bg-white dark:bg-background px-6 py-6 animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <Link href="/" className="flex items-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
                <span className="text-xl font-medium">furniview</span>
              </Link>
              <Button variant="ghost" className="px-2" onClick={() => setMobileMenuOpen(false)}>
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" />
              </Button>
            </div>
            <nav className="flex flex-col space-y-4">
              <Link
                href="/browse"
                className="text-base font-medium text-foreground-muted hover:text-foreground py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse
              </Link>
              <Link
                href="/pricing"
                className="text-base font-medium text-foreground-muted hover:text-foreground py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/features"
                className="text-base font-medium text-foreground-muted hover:text-foreground py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <div className="mt-6 pt-6 border-t border-border/40">
                {isLoading ? (
                  <div className="animate-pulse h-10 w-full bg-gray-300 rounded-md"></div>
                ) : user ? (
                  <>
                    <Link href="/dashboard" className="block mb-4" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full text-base">
                         <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                      </Button>
                    </Link>
                    <Button onClick={handleSignOut} variant="ghost" className="w-full text-base justify-start px-2 py-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30">
                      <LogOut className="mr-2 h-4 w-4" /> Logout
                    </Button>
                  </>
                ) : (
                  <div className="space-y-4">
                    <Link href="/login" className="block" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full text-base">Login</Button>
                    </Link>
                    <Link href="/signup" className="block" onClick={() => setMobileMenuOpen(false)}>
                       <Button className="w-full text-base">Get Started</Button>
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
