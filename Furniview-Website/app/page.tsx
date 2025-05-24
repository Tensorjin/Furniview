import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { ArrowRight, CheckCircle2, CuboidIcon as Cube3d, Upload, Users } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"

export default function Home() {

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 px-4">
        <div className="container px-4 md:px-6 flex flex-col items-center text-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-medium tracking-tighter sm:text-4xl md:text-5xl xl:text-6xl/none animate-slide-up">
              Assembly instructions
              <span className="block animate-slide-up" style={{ animationDelay: "0.1s" }}>
                reimagined in 3D.
              </span>
            </h1>
            <p
              className="mx-auto max-w-[700px] text-foreground-muted md:text-xl animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              Transform your furniture assembly experience with interactive 3D instructions. No more confusing paper
              manuals. No more frustration.
            </p>
          </div>
          <div
            className="flex flex-col gap-2 min-[400px]:flex-row justify-center animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            <Link href="/signup">
              <Button size="lg" className="px-8 hover-lift">
                Get Started
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="px-8 hover-lift">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 3D Model Showcase */}
      <section className="w-full py-12 md:py-24 bg-background-subtle px-4">
        <div className="container px-4 md:px-6">
          <ScrollReveal>
            <div className="rounded-3xl bg-white shadow-sm border border-border/10 overflow-hidden w-full max-w-5xl mx-auto aspect-[16/9] hover-lift">
              <div className="w-full h-full bg-background-muted flex items-center justify-center">
                <Image
                  src="/placeholder.svg?height=720&width=1280"
                  width={1280}
                  height={720}
                  alt="Interactive 3D model viewer demonstration"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Features */}
      <section className="w-full py-12 md:py-24 px-4">
        <div className="container px-4 md:px-6">
          <ScrollReveal>
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-medium tracking-tighter sm:text-4xl">Clear. Simple. Intuitive.</h2>
                <p className="max-w-[900px] text-foreground-muted md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Furniview transforms complex assembly instructions into an intuitive 3D experience.
                </p>
              </div>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <ScrollReveal delay={0.1} direction="up">
              <Card className="bg-white border-none shadow-sm hover-lift">
                <CardContent className="flex flex-col items-center p-6 text-center space-y-4">
                  <div className="p-2 bg-background-subtle rounded-full">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium">Upload</h3>
                  <p className="text-foreground-muted">
                    Easily upload your 3D furniture models in various formats (OBJ, FBX, STL) to our platform.
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>
            <ScrollReveal delay={0.2} direction="up">
              <Card className="bg-white border-none shadow-sm hover-lift">
                <CardContent className="flex flex-col items-center p-6 text-center space-y-4">
                  <div className="p-2 bg-background-subtle rounded-full">
                    <Cube3d className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium">Convert</h3>
                  <p className="text-foreground-muted">
                    Our system automatically converts your models into interactive 3D instructions ready for viewing.
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>
            <ScrollReveal delay={0.3} direction="up">
              <Card className="bg-white border-none shadow-sm hover-lift">
                <CardContent className="flex flex-col items-center p-6 text-center space-y-4">
                  <div className="p-2 bg-background-subtle rounded-full">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium">Share</h3>
                  <p className="text-foreground-muted">
                    Share interactive assembly instructions with your customers to enhance their experience.
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="w-full py-12 md:py-24 bg-background-subtle px-4">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <ScrollReveal direction="left">
              <Image
                src="/placeholder.svg?height=720&width=1280"
                width={1280}
                height={720}
                alt="Customer experiencing simplified furniture assembly"
                className="mx-auto aspect-video rounded-xl object-cover hover-lift"
              />
            </ScrollReveal>
            <ScrollReveal direction="right" delay={0.2}>
              <div className="space-y-6">
                <h2 className="text-3xl font-medium tracking-tighter">Simplify assembly, reduce support costs</h2>
                <p className="text-foreground-muted md:text-lg/relaxed">
                  Furniture companies can reduce support calls and returns by up to 45% by providing clear, interactive
                  3D assembly instructions. Furniview makes this possible without complex technical knowledge.
                </p>
                <ul className="grid gap-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-accent-green" />
                    <span>Reduce customer support costs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-accent-green" />
                    <span>Decrease product returns due to assembly issues</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-accent-green" />
                    <span>Enhance customer satisfaction and brand reputation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-accent-green" />
                    <span>Gain insights into assembly pain points</span>
                  </li>
                </ul>
                <div>
                  <Link href="/features">
                    <Button size="lg" className="mt-4 rounded-full hover-lift">
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="w-full py-12 md:py-24 px-4">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-medium tracking-tighter sm:text-4xl">Simple, transparent pricing</h2>
              <p className="max-w-[600px] text-foreground-muted md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Choose the plan that's right for your business.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <Card className="bg-white border-none shadow-sm">
              <CardContent className="p-6">
                <div className="mb-4 space-y-2">
                  <h3 className="text-xl font-medium">Small Business</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">$199</span>
                    <span className="text-foreground-muted">/month</span>
                  </div>
                  <p className="text-sm text-foreground-muted">For small furniture companies.</p>
                </div>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent-green" />
                    <span className="text-sm">Up to 10 furniture items</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent-green" />
                    <span className="text-sm">Standard 3D viewer</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent-green" />
                    <span className="text-sm">Basic analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent-green" />
                    <span className="text-sm">Email support</span>
                  </li>
                </ul>
                <Button className="w-full rounded-full">Get Started</Button>
              </CardContent>
            </Card>
            <Card className="bg-white border-none shadow-sm relative">
              <div className="absolute -top-4 left-0 right-0 mx-auto w-max px-4 py-1 bg-accent-blue text-white text-xs font-medium rounded-full">
                Most Popular
              </div>
              <CardContent className="p-6">
                <div className="mb-4 space-y-2">
                  <h3 className="text-xl font-medium">Medium Business</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">$499</span>
                    <span className="text-foreground-muted">/month</span>
                  </div>
                  <p className="text-sm text-foreground-muted">For growing furniture companies.</p>
                </div>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent-green" />
                    <span className="text-sm">Up to 30 furniture items</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent-green" />
                    <span className="text-sm">Enhanced 3D viewer</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent-green" />
                    <span className="text-sm">Detailed analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent-green" />
                    <span className="text-sm">Priority email support</span>
                  </li>
                </ul>
                <Button className="w-full rounded-full">Get Started</Button>
              </CardContent>
            </Card>
            <Card className="bg-white border-none shadow-sm">
              <CardContent className="p-6">
                <div className="mb-4 space-y-2">
                  <h3 className="text-xl font-medium">Large Business</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">$999</span>
                    <span className="text-foreground-muted">/month</span>
                  </div>
                  <p className="text-sm text-foreground-muted">For large furniture companies.</p>
                </div>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent-green" />
                    <span className="text-sm">Up to 100 furniture items</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent-green" />
                    <span className="text-sm">Premium 3D viewer</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent-green" />
                    <span className="text-sm">Advanced analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent-green" />
                    <span className="text-sm">Phone & email support</span>
                  </li>
                </ul>
                <Button className="w-full rounded-full">Get Started</Button>
              </CardContent>
            </Card>
          </div>
          <div className="text-center mt-8">
            <p className="text-foreground-muted">
              Need a custom solution?{" "}
              <Link href="/contact" className="text-primary underline underline-offset-4">
                Contact us
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full py-12 md:py-24 px-4">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-medium tracking-tighter sm:text-4xl">
                Ready to transform your assembly experience?
              </h2>
              <p className="max-w-[600px] text-foreground-muted md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join furniture companies that are enhancing customer satisfaction with interactive 3D instructions.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/signup">
                <Button size="lg" className="px-8 rounded-full">
                  Get Started
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="px-8 rounded-full">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
