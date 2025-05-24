"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

interface PageTransitionProps {
  children: React.ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [displayChildren, setDisplayChildren] = useState(children)

  useEffect(() => {
    // Don't run the animation on initial load
    if (displayChildren === children) return

    setIsTransitioning(true)
    const timer = setTimeout(() => {
      setDisplayChildren(children)
      setIsTransitioning(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [pathname, children, displayChildren])

  return (
    <div
      className={`transition-opacity duration-300 ${isTransitioning ? "opacity-0" : "opacity-100"}`}
      style={{ minHeight: "50vh" }}
    >
      {displayChildren}
    </div>
  )
}
