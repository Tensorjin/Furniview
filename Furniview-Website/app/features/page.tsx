import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, CuboidIcon as Cube3d, Laptop, LineChart, Smartphone, Tablet, Users2 } from "lucide-react"
import Image from "next/image"

export default function Features() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 px-4">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-medium tracking-tighter sm:text-4xl md:text-5xl">
                Features designed with purpose
              </h1>
              <p className="max-w-[700px] text-foreground-muted md:text-xl">
                Every aspect of Furniview is meticulously crafted to provide the best assembly experience for your
                customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Viewer Feature */}
      <section className="w-full py-12 md:py-24 px-4 bg-background-subtle">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div>
              <Image
                src="/placeholder.svg?height=720&width=1280"
                width={1280}
                height={720}
                alt="Interactive 3D viewer demonstration"
                className="mx-auto aspect-video rounded-xl object-cover shadow-sm"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-medium tracking-tighter">Interactive 3D Viewer</h2>
              <p className="text-foreground-muted md:text-lg/relaxed">
                Our advanced 3D viewer transforms complex assembly instructions into an intuitive experience. Users can
                rotate, zoom, and examine each step from any angle.
              </p>
              <ul className="grid gap-3">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent-green" />
                  <span>Intuitive touch and mouse controls</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent-green" />
                  <span>Step-by-step sequence navigation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent-green" />
                  <span>High-performance rendering engine</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent-green" />
                  <span>Part highlighting and zoom-to-detail</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Device Compatibility */}
      <section className="w-full py-12 md:py-24 px-4">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="order-2 lg:order-1 space-y-6">
              <h2 className="text-3xl font-medium tracking-tighter">Works on every device</h2>
              <p className="text-foreground-muted md:text-lg/relaxed">
                Furniview is designed to provide a seamless experience across all devices. Whether your customers are
                using a desktop, tablet, or smartphone, they'll get the same high-quality assembly guidance.
              </p>
              <div className="flex flex-wrap gap-4">
                <Card className="bg-white border-none shadow-sm">
                  <CardContent className="flex items-center gap-3 p-4">
                    <Laptop className="h-5 w-5 text-primary" />
                    <span>Desktop</span>
                  </CardContent>
                </Card>
                <Card className="bg-white border-none shadow-sm">
                  <CardContent className="flex items-center gap-3 p-4">
                    <Tablet className="h-5 w-5 text-primary" />
                    <span>Tablet</span>
                  </CardContent>
                </Card>
                <Card className="bg-white border-none shadow-sm">
                  <CardContent className="flex items-center gap-3 p-4">
                    <Smartphone className="h-5 w-5 text-primary" />
                    <span>Mobile</span>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <Image
                src="/placeholder.svg?height=720&width=1280"
                width={1280}
                height={720}
                alt="Multi-device compatibility demonstration"
                className="mx-auto aspect-video rounded-xl object-cover shadow-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Company Dashboard */}
      <section className="w-full py-12 md:py-24 px-4 bg-background-subtle">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-medium tracking-tighter">Powerful company tools</h2>
              <p className="max-w-[700px] text-foreground-muted md:text-xl">
                Manage your furniture models and track customer engagement with our intuitive dashboard.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white border-none shadow-sm">
              <CardContent className="flex flex-col items-center p-6 text-center space-y-4">
                <div className="p-2 bg-background-subtle rounded-full">
                  <Cube3d className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium">Model Management</h3>
                <p className="text-foreground-muted">
                  Upload, organize, and manage your 3D models in one place. Track conversion status and make updates.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white border-none shadow-sm">
              <CardContent className="flex flex-col items-center p-6 text-center space-y-4">
                <div className="p-2 bg-background-subtle rounded-full">
                  <LineChart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium">Analytics</h3>
                <p className="text-foreground-muted">
                  Gain insights into how customers interact with your assembly instructions and identify improvement
                  areas.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white border-none shadow-sm">
              <CardContent className="flex flex-col items-center p-6 text-center space-y-4">
                <div className="p-2 bg-background-subtle rounded-full">
                  <Users2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium">Collaboration</h3>
                <p className="text-foreground-muted">
                  Invite team members to collaborate on models and instructions. Control access with user permissions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="w-full py-12 md:py-24 px-4">
        <div className="container px-4 md:px-6">
          <div className="bg-white rounded-xl shadow-sm border border-border/10 overflow-hidden">
            <Image
              src="/placeholder.svg?height=720&width=1280"
              width={1280}
              height={720}
              alt="Company dashboard preview"
              className="w-full object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
