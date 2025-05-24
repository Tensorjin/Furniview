"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, ChevronLeft, ChevronRight, Maximize, Minimize, RotateCcw, ZoomIn, ZoomOut } from "lucide-react"
import Image from "next/image"

export default function Demo() {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 5

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  return (
    <div className="flex flex-col items-center">
      {/* Header */}
      <section className="w-full py-12 md:py-24 px-4">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-medium tracking-tighter sm:text-4xl">Interactive 3D Viewer Demo</h1>
              <p className="max-w-[700px] text-foreground-muted md:text-xl">
                Experience how your customers will interact with 3D assembly instructions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Viewer Demo */}
      <section className="w-full py-8 px-4">
        <div className="container px-4 md:px-6">
          <div className="bg-white rounded-xl overflow-hidden border border-border/10 shadow-sm">
            <div className="flex items-center justify-between p-4 border-b border-border/40">
              <h2 className="text-lg font-medium">Modern Coffee Table Assembly</h2>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Maximize className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* 3D Viewer Area */}
            <div className="bg-background-subtle aspect-[4/3] md:aspect-[16/9] relative">
              {/* This would be replaced with an actual 3D viewer in production */}
              <Image
                src="/placeholder.svg?height=720&width=1280"
                width={1280}
                height={720}
                alt="3D model of furniture assembly step"
                className="w-full h-full object-cover"
              />

              {/* Controls overlay */}
              <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                <Card className="bg-white/80 backdrop-blur-sm border-none shadow">
                  <CardContent className="p-2 flex flex-col gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Minimize className="h-4 w-4" />
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
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="flex items-center">
                <span className="text-foreground-muted">
                  Step {currentStep}: {getStepDescription(currentStep)}
                </span>
                <Button variant="ghost" size="icon">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="outline"
                onClick={nextStep}
                disabled={currentStep === totalSteps}
                className="flex items-center gap-1"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 text-center">
            <p className="text-foreground-muted">Interact with the 3D model using your mouse or touchscreen:</p>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <Card className="bg-white border-none shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className="font-medium">Click + Drag</p>
                  <p className="text-sm text-foreground-muted">Rotate the model</p>
                </CardContent>
              </Card>
              <Card className="bg-white border-none shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className="font-medium">Scroll / Pinch</p>
                  <p className="text-sm text-foreground-muted">Zoom in/out</p>
                </CardContent>
              </Card>
              <Card className="bg-white border-none shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className="font-medium">Shift + Drag</p>
                  <p className="text-sm text-foreground-muted">Pan the model</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="w-full py-12 md:py-24 px-4 bg-background-subtle">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-medium tracking-tighter">Ready to implement this for your customers?</h2>
              <p className="max-w-[700px] text-foreground-muted md:text-xl">
                Create an account today and start uploading your furniture models.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" className="px-8">
                Get Started
              </Button>
              <Button size="lg" variant="outline" className="px-8">
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function getStepDescription(step: number): string {
  switch (step) {
    case 1:
      return "Unpack all components"
    case 2:
      return "Attach legs to the frame"
    case 3:
      return "Secure the table top"
    case 4:
      return "Attach the shelf"
    case 5:
      return "Final adjustments"
    default:
      return ""
  }
}
