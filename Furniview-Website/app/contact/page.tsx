"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MapPin, Phone } from "lucide-react"

export default function Contact() {
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
    <div className="flex flex-col items-center">
      {/* Header */}
      <section className="w-full py-12 md:py-24 px-4">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-medium tracking-tighter sm:text-4xl md:text-5xl">Get in touch</h1>
              <p className="max-w-[700px] text-foreground-muted md:text-xl">
                Have questions about Furniview? We're here to help.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="w-full py-12 px-4">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            {/* Contact Form */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-medium">Send us a message</h2>
                <p className="text-foreground-muted mt-2">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First name</Label>
                    <Input id="first-name" placeholder="John" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last name</Label>
                    <Input id="last-name" placeholder="Doe" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john@company.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" placeholder="Acme Furniture" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us about your inquiry..."
                    className="min-h-[150px]"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8 lg:pl-12">
              <div>
                <h2 className="text-2xl font-medium">Contact information</h2>
                <p className="text-foreground-muted mt-2">Reach out to us through any of these channels.</p>
              </div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-background-subtle rounded-full">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-foreground-muted mt-1">info@furniview.com</p>
                    <p className="text-foreground-muted">support@furniview.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-background-subtle rounded-full">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p className="text-foreground-muted mt-1">+1 (555) 123-4567</p>
                    <p className="text-foreground-muted">Monday-Friday, 9am-5pm PST</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-background-subtle rounded-full">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Office</h3>
                    <p className="text-foreground-muted mt-1">123 Designer Street</p>
                    <p className="text-foreground-muted">San Francisco, CA 94103</p>
                    <p className="text-foreground-muted">United States</p>
                  </div>
                </div>
              </div>
              <div className="pt-8 mt-8 border-t border-border/40">
                <h3 className="font-medium">Hours of Operation</h3>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div>
                    <p className="text-foreground-muted">Monday-Friday</p>
                    <p>9:00 AM - 5:00 PM</p>
                  </div>
                  <div>
                    <p className="text-foreground-muted">Saturday-Sunday</p>
                    <p>Closed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="w-full py-12 px-4">
        <div className="container px-4 md:px-6">
          <div className="bg-background-subtle rounded-xl overflow-hidden h-[400px] w-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <p className="text-foreground-muted">Interactive map would appear here</p>
              <p className="text-sm text-foreground-muted">123 Designer Street, San Francisco, CA 94103</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
