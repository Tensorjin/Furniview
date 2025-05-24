import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollReveal } from "@/components/scroll-reveal"
import { AnimatedButton } from "@/components/animated-button"

export default function PricingPage() {
  return (
    <div className="flex flex-col items-center">
      {/* Header */}
      <section className="w-full py-12 md:py-24 lg:py-32 px-4">
        <div className="container px-4 md:px-6 flex flex-col items-center text-center space-y-4">
          <div className="space-y-2 animate-slide-up">
            <h1 className="text-3xl font-medium tracking-tighter sm:text-4xl md:text-5xl">Find your perfect fit</h1>
            <p className="mx-auto max-w-[700px] text-foreground-muted md:text-xl">
              Every furniture company deserves amazing 3D instructions. Choose the option that works for where you are
              today.
            </p>
          </div>
          <div className="w-full max-w-md animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <Tabs defaultValue="monthly" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="annual">Annual (2 months free)</TabsTrigger>
              </TabsList>
              <TabsContent value="monthly">
                <p className="text-sm text-foreground-muted mt-2">Flexibility to adapt as your needs change.</p>
              </TabsContent>
              <TabsContent value="annual">
                <p className="text-sm text-foreground-muted mt-2">
                  Get two months free when you choose annual billing.
                </p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="w-full py-8 px-4">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <ScrollReveal delay={0.1}>
              <Card className="border-border/40 hover-lift">
                <CardHeader>
                  <CardTitle>Starter</CardTitle>
                  <CardDescription>Perfect for new and small collections</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">$199</span>
                    <span className="text-foreground-muted ml-1">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-accent-green shrink-0 mt-0.5" />
                      <span>10 furniture models in your collection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-accent-green shrink-0 mt-0.5" />
                      <span>Essential 3D viewer experience</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-accent-green shrink-0 mt-0.5" />
                      <span>Insight analytics dashboard</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-accent-green shrink-0 mt-0.5" />
                      <span>Friendly email support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-accent-green shrink-0 mt-0.5" />
                      <span>One creator account</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-accent-green shrink-0 mt-0.5" />
                      <span>Furniview branding</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <AnimatedButton className="w-full rounded-full" animationType="scale">
                    Start Your Journey
                  </AnimatedButton>
                </CardFooter>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <Card className="border-border/40 relative hover-lift">
                <div className="absolute -top-4 left-0 right-0 mx-auto w-max px-4 py-1 bg-accent-blue text-white text-xs font-medium rounded-full">
                  Most Popular
                </div>
                <CardHeader>
                  <CardTitle>Growth</CardTitle>
                  <CardDescription>Ideal for expanding product lines</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">$499</span>
                    <span className="text-foreground-muted ml-1">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-accent-green shrink-0 mt-0.5" />
                      <span>30 furniture models in your collection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-accent-green shrink-0 mt-0.5" />
                      <span>Enhanced 3D viewer with animations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-accent-green shrink-0 mt-0.5" />
                      <span>Customer behavior insights</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-accent-green shrink-0 mt-0.5" />
                      <span>Priority support response</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-accent-green shrink-0 mt-0.5" />
                      <span>Team of 5 creators</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-accent-green shrink-0 mt-0.5" />
                      <span>Your branding, your identity</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <AnimatedButton className="w-full rounded-full" animationType="scale">
                    Amplify Your Experience
                  </AnimatedButton>
                </CardFooter>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <Card className="border-border/40 hover-lift">
                <CardHeader>
                  <CardTitle>Premium</CardTitle>
                  <CardDescription>For established furniture collections</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">$999</span>
                    <span className="text-foreground-muted ml-1">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-accent-green shrink-0 mt-0.5" />
                      <span>100 furniture models in your collection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-accent-green shrink-0 mt-0.5" />
                      <span>Premium 3D experience with AR view</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-accent-green shrink-0 mt-0.5" />
                      <span>Advanced analytics and reporting</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-accent-green shrink-0 mt-0.5" />
                      <span>Dedicated support team</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-accent-green shrink-0 mt-0.5" />
                      <span>Unlimited team collaboration</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-accent-green shrink-0 mt-0.5" />
                      <span>Full customization and API access</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <AnimatedButton className="w-full rounded-full" animationType="scale">
                    Elevate Your Brand
                  </AnimatedButton>
                </CardFooter>
              </Card>
            </ScrollReveal>
          </div>
          <div className="text-center mt-8">
            <p className="text-foreground-muted">
              Looking for something unique?{" "}
              <Link href="/contact" className="text-primary underline underline-offset-4">
                Let's create a custom solution
              </Link>{" "}
              together.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="w-full py-12 md:py-24 px-4 bg-background-subtle">
        <div className="container px-4 md:px-6">
          <ScrollReveal>
            <h2 className="text-2xl font-medium tracking-tighter text-center mb-6">What's included in each plan</h2>
            <p className="text-center text-foreground-muted max-w-2xl mx-auto mb-12">
              Every plan includes our core 3D assembly experience. Choose the option that gives you the right tools for
              your current needs.
            </p>
          </ScrollReveal>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left py-4 px-4 font-medium">Features</th>
                  <th className="text-center py-4 px-4 font-medium">Starter</th>
                  <th className="text-center py-4 px-4 font-medium">Growth</th>
                  <th className="text-center py-4 px-4 font-medium">Premium</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-4 px-4">Furniture Models</td>
                  <td className="text-center py-4 px-4">10</td>
                  <td className="text-center py-4 px-4">30</td>
                  <td className="text-center py-4 px-4">100</td>
                </tr>
                <tr className="border-b border-border/40 bg-background/50">
                  <td className="py-4 px-4">3D Experience</td>
                  <td className="text-center py-4 px-4">Essential</td>
                  <td className="text-center py-4 px-4">Enhanced</td>
                  <td className="text-center py-4 px-4">Premium with AR</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-4 px-4">Customer Insights</td>
                  <td className="text-center py-4 px-4">Basic</td>
                  <td className="text-center py-4 px-4">Detailed</td>
                  <td className="text-center py-4 px-4">Comprehensive</td>
                </tr>
                <tr className="border-b border-border/40 bg-background/50">
                  <td className="py-4 px-4">Support</td>
                  <td className="text-center py-4 px-4">Email</td>
                  <td className="text-center py-4 px-4">Priority Email</td>
                  <td className="text-center py-4 px-4">Dedicated Team</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-4 px-4">Team Members</td>
                  <td className="text-center py-4 px-4">1</td>
                  <td className="text-center py-4 px-4">5</td>
                  <td className="text-center py-4 px-4">Unlimited</td>
                </tr>
                <tr className="border-b border-border/40 bg-background/50">
                  <td className="py-4 px-4">Branding Options</td>
                  <td className="text-center py-4 px-4">
                    <span className="text-sm">Furniview branding</span>
                  </td>
                  <td className="text-center py-4 px-4">
                    <span className="text-sm">Your branding</span>
                  </td>
                  <td className="text-center py-4 px-4">
                    <span className="text-sm">Full customization</span>
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-4 px-4">API Integration</td>
                  <td className="text-center py-4 px-4">
                    <span className="text-sm">Coming soon</span>
                  </td>
                  <td className="text-center py-4 px-4">
                    <span className="text-sm">Coming soon</span>
                  </td>
                  <td className="text-center py-4 px-4">
                    <CheckCircle2 className="h-5 w-5 text-accent-green mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-border/40 bg-background/50">
                  <td className="py-4 px-4">Success Manager</td>
                  <td className="text-center py-4 px-4">
                    <span className="text-sm">Self-guided</span>
                  </td>
                  <td className="text-center py-4 px-4">
                    <span className="text-sm">Shared</span>
                  </td>
                  <td className="text-center py-4 px-4">
                    <span className="text-sm">Dedicated</span>
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-4 px-4">Onboarding</td>
                  <td className="text-center py-4 px-4">
                    <Badge variant="outline">Self-guided</Badge>
                  </td>
                  <td className="text-center py-4 px-4">
                    <Badge variant="outline">Guided setup</Badge>
                  </td>
                  <td className="text-center py-4 px-4">
                    <Badge variant="outline">White glove</Badge>
                  </td>
                </tr>
                <tr className="border-b border-border/40 bg-background/50">
                  <td className="py-4 px-4">Storage</td>
                  <td className="text-center py-4 px-4">5GB</td>
                  <td className="text-center py-4 px-4">20GB</td>
                  <td className="text-center py-4 px-4">100GB</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-12 md:py-24 px-4">
        <div className="container px-4 md:px-6">
          <ScrollReveal>
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-medium tracking-tighter">Questions you might have</h2>
                <p className="max-w-[700px] text-foreground-muted md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We're here to make your decision simple and confident.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <div className="mx-auto max-w-3xl mt-12">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>How do I choose the right plan for my company?</AccordionTrigger>
                <AccordionContent>
                  Think about where you are today and what you need right now. Our Starter plan works beautifully for
                  companies with smaller collections or those just beginning their 3D journey. As your catalog grows or
                  you need more customization, you can easily move to Growth or Premium. And remember, you can change
                  plans anytime as your needs evolve.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Can I change my plan as my needs change?</AccordionTrigger>
                <AccordionContent>
                  Your business evolves, and your plan can too. You can upgrade anytime and the new features will be
                  available immediately. If you need to adjust to a different plan, changes take effect at your next
                  billing cycle. We've designed the process to be seamless and flexible.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>What happens when I reach my furniture model limit?</AccordionTrigger>
                <AccordionContent>
                  We'll give you a friendly heads-up when you're approaching your limit, so you'll have time to decide
                  what works best for you. You can either upgrade to accommodate your growing collection, or curate your
                  existing models to stay within your current plan. Either way, we'll make sure you have the information
                  you need to make the right choice for your business.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>What payment options are available?</AccordionTrigger>
                <AccordionContent>
                  We've made payment simple and secure. Use any major credit card (Visa, Mastercard, American Express,
                  Discover) or PayPal. For annual plans, we also offer invoice payment options and bank transfers to
                  give you the flexibility your business needs.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>Can I try before I decide?</AccordionTrigger>
                <AccordionContent>
                  Yes! We offer a 14-day exploration period with our Growth plan features. No credit card needed—just
                  sign up and start creating. You can upload up to 5 furniture models to experience how Furniview
                  transforms your assembly instructions. After your exploration, choose the plan that feels right for
                  where your business is today.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6">
                <AccordionTrigger>What makes each 3D experience level different?</AccordionTrigger>
                <AccordionContent>
                  <p>Each level builds on the foundation of amazing 3D assembly instructions:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>
                      <span className="font-medium">Essential:</span> Clear 3D viewing with intuitive controls for
                      rotation, zoom, and step-by-step guidance—perfect for straightforward assembly.
                    </li>
                    <li>
                      <span className="font-medium">Enhanced:</span> Adds part highlighting, exploded views, and smooth
                      animations to make complex assemblies easier to understand.
                    </li>
                    <li>
                      <span className="font-medium">Premium:</span> The complete experience with AR viewing for
                      real-world placement, high-resolution textures, and advanced lighting that brings your furniture
                      to life.
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-7">
                <AccordionTrigger>
                  Do you offer special pricing for educational or non-profit organizations?
                </AccordionTrigger>
                <AccordionContent>
                  Yes! We believe in supporting organizations doing important work. Educational institutions and
                  non-profits can access special pricing that makes Furniview accessible for your unique needs. Reach
                  out to our team, and we'll create a solution that respects your mission and budget.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Custom Solutions Section */}
      <section className="w-full py-12 md:py-24 px-4 bg-background-subtle">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <ScrollReveal direction="left">
              <div className="space-y-4">
                <div className="inline-flex items-center rounded-full border border-border/40 bg-white px-4 py-1 text-sm">
                  <Badge variant="outline" className="mr-2 bg-accent-blue/10 text-accent-blue border-accent-blue/20">
                    Custom Solution
                  </Badge>
                  <span>Tailored to your vision</span>
                </div>
                <h2 className="text-3xl font-medium tracking-tighter">Something uniquely yours</h2>
                <p className="text-foreground-muted">
                  For furniture brands with distinctive needs, we create bespoke solutions that align perfectly with
                  your vision. Let's collaborate on a tailored experience that reflects your unique identity and
                  customer journey.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-accent-green" />
                    <span>Unlimited furniture collection</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-accent-green" />
                    <span>Custom feature development</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-accent-green" />
                    <span>Dedicated success partner</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-accent-green" />
                    <span>Priority support commitment</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-accent-green" />
                    <span>Seamless brand integration</span>
                  </li>
                </ul>
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Link href="/contact">
                    <AnimatedButton size="lg" className="rounded-full" animationType="scale">
                      Start the Conversation
                    </AnimatedButton>
                  </Link>
                  <Link href="/demo">
                    <Button variant="outline" size="lg" className="rounded-full">
                      See a Demo
                    </Button>
                  </Link>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={0.2}>
              <Card className="bg-white border-none shadow-sm">
                <CardHeader>
                  <CardTitle>Let's create together</CardTitle>
                  <CardDescription>Share your vision and we'll explore how to bring it to life.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">First name</Label>
                        <Input id="first-name" placeholder="John" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Last name</Label>
                        <Input id="last-name" placeholder="Doe" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="john@company.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input id="company" placeholder="Acme Furniture" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Your vision</Label>
                      <textarea
                        id="message"
                        className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Tell us what you're looking to create..."
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <AnimatedButton className="w-full rounded-full" animationType="scale">
                    Start the Conversation
                  </AnimatedButton>
                </CardFooter>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-12 md:py-24 px-4">
        <div className="container px-4 md:px-6">
          <ScrollReveal>
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-medium tracking-tighter">Stories from our community</h2>
                <p className="max-w-[700px] text-foreground-muted md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Hear how furniture brands are transforming their customer experience.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <ScrollReveal delay={0.1}>
              <Card className="bg-white border-none shadow-sm hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-full bg-background-subtle flex items-center justify-center">
                      <span className="font-medium">S</span>
                    </div>
                    <div>
                      <p className="font-medium">Sarah Johnson</p>
                      <p className="text-sm text-foreground-muted">Product Manager, Modern Home Furniture</p>
                    </div>
                  </div>
                  <p className="text-foreground-muted italic">
                    "Our customers now spend more time enjoying their furniture and less time puzzling over
                    instructions. The Starter plan gave us everything we needed to transform our customer experience."
                  </p>
                  <div className="flex items-center mt-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="h-5 w-5 fill-current text-yellow-500"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <Card className="bg-white border-none shadow-sm hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-full bg-background-subtle flex items-center justify-center">
                      <span className="font-medium">M</span>
                    </div>
                    <div>
                      <p className="font-medium">Michael Chen</p>
                      <p className="text-sm text-foreground-muted">CEO, Comfort Living</p>
                    </div>
                  </div>
                  <p className="text-foreground-muted italic">
                    "The Growth plan was exactly what we needed as we expanded our collection. Being able to add our own
                    branding created a seamless experience that our customers love and trust."
                  </p>
                  <div className="flex items-center mt-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="h-5 w-5 fill-current text-yellow-500"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <Card className="bg-white border-none shadow-sm hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-full bg-background-subtle flex items-center justify-center">
                      <span className="font-medium">J</span>
                    </div>
                    <div>
                      <p className="font-medium">Jessica Martinez</p>
                      <p className="text-sm text-foreground-muted">CTO, Global Furniture Inc.</p>
                    </div>
                  </div>
                  <p className="text-foreground-muted italic">
                    "With our extensive catalog, the Premium plan gives us the flexibility and tools we need. The
                    dedicated support team has been instrumental in helping us create exceptional assembly experiences."
                  </p>
                  <div className="flex items-center mt-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="h-5 w-5 fill-current text-yellow-500"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full py-12 md:py-24 px-4 bg-primary text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-medium tracking-tighter sm:text-4xl">Begin your transformation</h2>
              <p className="max-w-[600px] text-white/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join the furniture brands creating assembly experiences their customers love to talk about.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/signup">
                <AnimatedButton
                  size="lg"
                  className="px-8 rounded-full bg-white text-primary hover:bg-white/90"
                  animationType="scale"
                >
                  Start Your Free Experience
                </AnimatedButton>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 rounded-full border-white text-white hover:bg-white/10"
                >
                  Talk to an Expert
                </Button>
              </Link>
            </div>
            <p className="text-sm text-white/60 mt-4">No credit card needed. See the difference for yourself.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
