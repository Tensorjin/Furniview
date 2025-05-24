"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  animationType?: "scale" | "pulse" | "float" | "none"
}

export function AnimatedButton({
  children,
  variant = "default",
  size = "default",
  className,
  animationType = "scale",
  ...props
}: AnimatedButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getAnimationClass = () => {
    if (animationType === "none") return ""
    if (animationType === "scale") return isHovered ? "scale-105" : ""
    if (animationType === "pulse") return "animate-pulse-subtle"
    if (animationType === "float") return "animate-float"
    return ""
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={cn("transition-all duration-300", getAnimationClass(), className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {children}
    </Button>
  )
}
