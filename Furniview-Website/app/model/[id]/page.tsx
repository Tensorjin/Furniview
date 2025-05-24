"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Clock,
  CuboidIcon as Cube3d,
  Download,
  Maximize,
  Minimize,
  RotateCcw,
  Share2,
  ZoomIn,
  ZoomOut,
} from "lucide-react"
import { AnimatedButton } from "@/components/animated-button"
import { LoadingSpinner } from "@/components/loading-spinner"

// Sample furniture data (same as in browse page)
const furnitureItems = [
  {
    id: 1,
    name: "Modern Coffee Table",
    company: "Scandinavian Designs",
    category: "Tables",
    difficulty: "Easy",
    estimatedTime: "30 min",
    parts: 12,
    image: "/placeholder.svg?height=300&width=400",
    description:
      "A sleek, minimalist coffee table with clean lines and a natural wood finish. Perfect for modern living rooms and open concept spaces.",
    steps: [
      "Unpack all components and verify parts",
      "Attach legs to the frame",
      "Secure the table top",
      "Attach the shelf",
      "Final adjustments",
    ],
  },
  {
    id: 2,
    name: "Ergonomic Office Chair",
    company: "WorkSpace Pro",
    category: "Chairs",
    difficulty: "Medium",
    estimatedTime: "45 min",
    parts: 18,
    image: "/placeholder.svg?height=300&width=400",
    description:
      "An adjustable ergonomic office chair designed for comfort during long work sessions. Features lumbar support and height adjustment.",
    steps: [
      "Unpack all components and verify parts",
      "Assemble the base and wheels",
      "Attach the gas lift cylinder",
      "Connect the seat mechanism",
      "Attach the backrest",
      "Install armrests",
      "Final adjustments and testing",
    ],
  },
  // Additional items would be here...
]

export default function ModelPage({ params }: { params: { id: string } }) {
  const modelId = Number.parseInt(params.id)
  const model = furnitureItems.find((item) => item.id === modelId)

  const [currentStep, setCurrentStep] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)

  if (!model) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-medium mb-4">Model not found</h2>
        <p className="text-foreground-muted mb-6">The furniture model you're looking for doesn't exist.</p>
        <Link href="/browse">
          <Button>Browse All Models</Button>
        </Link>
      </div>
    )
  }

  const totalSteps = model.steps.length

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <div className="flex flex-col">
      {/* Breadcrumb Navigation */}
      <section className="w-full py-4 px-4 border-b border-border/40">
        <div className="container px-4 md:px-6">
          <div className="flex items-center text-sm text-foreground-muted">
            <Link href="/browse" className="flex items-center hover:text-foreground transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Browse
            </Link>
            <span className="mx-2">/</span>
            <span>{model.category}</span>
            <span className="mx-2">/</span>
            <span className="text-foreground font-medium">{model.name}</span>
          </div>
        </div>
      </section>

      {/* Model Header */}
      <section className="w-full py-6 px-4">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="animate-fade-in">
              <h1 className="text-2xl md:text-3xl font-medium">{model.name}</h1>
              <div className="flex items-center mt-2">
                <p className="text-foreground-muted">{model.company}</p>
                <span className="mx-2">•</span>
                <Badge variant="outline" className="bg-background-subtle">
                  {model.category}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <AnimatedButton variant="outline" size="sm" className="flex items-center gap-1" animationType="scale">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Download</span>
              </AnimatedButton>
              <AnimatedButton variant="outline" size="sm" className="flex items-center gap-1" animationType="scale">
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">Share</span>
              </AnimatedButton>
            </div>
          </div>
        </div>
      </section>

      {/* Model Content */}
      <section className="w-full py-4 px-4">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Model Info Sidebar */}
            <div className="order-2 lg:order-1 space-y-6">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Assembly Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            model.difficulty === "Easy"
                              ? "outline"
                              : model.difficulty === "Medium"
                                ? "secondary"
                                : "default"
                          }
                          className={
                            model.difficulty === "Easy"
                              ? "bg-white"
                              : model.difficulty === "Medium"
                                ? "bg-secondary"
                                : "bg-primary text-white"
                          }
                        >
                          {model.difficulty}
                        </Badge>
                        <span className="text-sm">Difficulty</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-foreground-muted" />
                        <span className="text-sm">{model.estimatedTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Cube3d className="h-4 w-4 text-foreground-muted" />
                        <span className="text-sm">{model.parts} parts</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{totalSteps} steps</span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-border/40">
                    <h3 className="text-lg font-medium mb-2">Description</h3>
                    <p className="text-foreground-muted text-sm">{model.description}</p>
                  </div>
                  <div className="pt-4 border-t border-border/40">
                    <h3 className="text-lg font-medium mb-2">Assembly Steps</h3>
                    <ol className="space-y-2 pl-5 list-decimal text-sm text-foreground-muted">
                      {model.steps.map((step, index) => (
                        <li key={index} className={currentStep === index + 1 ? "text-primary font-medium" : ""}>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">About the Manufacturer</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 bg-background-subtle rounded-full flex items-center justify-center">
                      <span className="font-medium">{model.company.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium">{model.company}</p>
                      <p className="text-sm text-foreground-muted">Furniture Manufacturer</p>
                    </div>
                  </div>
                  <p className="text-sm text-foreground-muted mb-4">
                    {model.company} specializes in high-quality, easy-to-assemble furniture for modern homes and
                    offices.
                  </p>
                  <Link href={`/company/${model.company.toLowerCase().replace(/\s+/g, "-")}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      View All Models
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* 3D Viewer */}
            <div className="order-1 lg:order-2 lg:col-span-2">
              <Tabs defaultValue="3d" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="3d">3D Interactive</TabsTrigger>
                  <TabsTrigger value="steps">Step-by-Step</TabsTrigger>
                </TabsList>
                <TabsContent value="3d" className="mt-4">
                  <Card className={isFullscreen ? "fixed inset-0 z-50 rounded-none" : ""}>
                    <div className="flex items-center justify-between p-4 border-b border-border/40">
                      <h2 className="text-lg font-medium">Interactive 3D Viewer</h2>
                      <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
                        {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                      </Button>
                    </div>

                    {/* 3D Viewer Area */}
                    <div className="bg-background-subtle aspect-[4/3] md:aspect-[16/9] relative">
                      {/* This would be replaced with an actual 3D viewer in production */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <LoadingSpinner size="lg" className="opacity-20" />
                      </div>
                      <Image
                        src="/placeholder.svg?height=720&width=1280"
                        width={1280}
                        height={720}
                        alt="3D model of furniture assembly"
                        className="w-full h-full object-cover transition-opacity duration-500"
                        onLoad={(e) => {
                          // This would be used to hide the spinner when the image loads
                          const target = e.target as HTMLImageElement
                          target.style.opacity = "1"
                        }}
                        style={{ opacity: 0 }}
                      />

                      {/* Controls overlay */}
                      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                        <Card className="bg-white/80 backdrop-blur-sm border-none shadow transition-all duration-300 hover:bg-white">
                          <CardContent className="p-2 flex flex-col gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 transition-transform duration-200 hover:scale-110"
                            >
                              <ZoomIn className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 transition-transform duration-200 hover:scale-110"
                            >
                              <ZoomOut className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 transition-transform duration-200 hover:scale-110"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Step indicator */}
                      <div className="absolute top-4 left-4">
                        <Card className="bg-white/80 backdrop-blur-sm border-none shadow">
                          <CardContent className="p-2 px-4">
                            <span className="text-sm font-medium">
                              Step {currentStep} of {totalSteps}
                            </span>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    {/* Step Navigation */}
                    <div className="p-4 border-t border-border/40 flex justify-between items-center">
                      <AnimatedButton
                        variant="outline"
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        className="flex items-center gap-1"
                        animationType="scale"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </AnimatedButton>
                      <div className="text-center animate-fade-in">
                        <p className="text-sm font-medium">Step {currentStep}</p>
                        <p className="text-xs text-foreground-muted">{model.steps[currentStep - 1]}</p>
                      </div>
                      <AnimatedButton
                        variant="outline"
                        onClick={nextStep}
                        disabled={currentStep === totalSteps}
                        className="flex items-center gap-1"
                        animationType="scale"
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </AnimatedButton>
                    </div>
                  </Card>
                </TabsContent>
                <TabsContent value="steps" className="mt-4">
                  <Card>
                    <div className="p-4 border-b border-border/40">
                      <h2 className="text-lg font-medium">Step-by-Step Instructions</h2>
                    </div>
                    <div className="p-6 space-y-8">
                      {model.steps.map((step, index) => (
                        <div key={index} className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white font-medium text-sm">
                              {index + 1}
                            </div>
                            <h3 className="font-medium">{step}</h3>
                          </div>
                          <div className="pl-11">
                            <div className="bg-background-subtle rounded-lg overflow-hidden">
                              <Image
                                src="/placeholder.svg?height=300&width=600"
                                width={600}
                                height={300}
                                alt={`Step ${index + 1}: ${step}`}
                                className="w-full object-cover"
                              />
                            </div>
                            <p className="mt-3 text-sm text-foreground-muted">{getStepDescription(index + 1)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </section>

      {/* Related Models */}
      <section className="w-full py-12 px-4 bg-background-subtle mt-12">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-medium mb-6">Similar Models</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {furnitureItems
              .filter((item) => item.id !== model.id && item.category === model.category)
              .slice(0, 4)
              .map((item) => (
                <Link key={item.id} href={`/model/${item.id}`}>
                  <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-md hover-lift">
                    <div className="aspect-[4/3] relative bg-background-subtle">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      <div className="absolute top-2 right-2">
                        <Badge
                          variant={
                            item.difficulty === "Easy"
                              ? "outline"
                              : item.difficulty === "Medium"
                                ? "secondary"
                                : "default"
                          }
                          className={
                            item.difficulty === "Easy"
                              ? "bg-white/80 backdrop-blur-sm"
                              : item.difficulty === "Medium"
                                ? "bg-secondary/80 backdrop-blur-sm"
                                : "bg-primary/80 backdrop-blur-sm text-white"
                          }
                        >
                          {item.difficulty}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <p className="text-sm text-foreground-muted">{item.company}</p>
                        <h3 className="font-medium line-clamp-1">{item.name}</h3>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="bg-background-subtle">
                            {item.category}
                          </Badge>
                          <p className="text-xs text-foreground-muted">Est. time: {item.estimatedTime}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  )
}

// Helper function to generate step descriptions
function getStepDescription(step: number): string {
  const descriptions = [
    "Carefully unpack all components and verify that all parts are present according to the parts list. Lay them out on a clean, flat surface.",
    "Attach the legs to the frame using the provided screws. Make sure they are securely fastened and aligned properly.",
    "Place the table top onto the frame and secure it using the provided screws. Ensure it is centered and level.",
    "Attach the shelf to the bottom of the frame using the provided brackets and screws. Make sure it is level and secure.",
    "Check all connections and tighten any loose screws. Adjust the leveling feet if necessary to ensure the table is stable.",
  ]

  return descriptions[step - 1] || "Detailed instructions for this step will guide you through the process."
}
