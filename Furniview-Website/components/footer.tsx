import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background px-4 py-12 sm:px-8 lg:px-12">
      <div className="container grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">furniview</h3>
          <p className="text-sm text-foreground-muted max-w-xs">
            Transform your furniture assembly experience with interactive 3D instructions.
          </p>
        </div>
        <div>
          <h4 className="font-medium mb-4">Product</h4>
          <ul className="space-y-3">
            <li>
              <Link href="/features" className="text-sm text-foreground-muted hover:text-foreground transition-colors">
                Features
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="text-sm text-foreground-muted hover:text-foreground transition-colors">
                Pricing
              </Link>
            </li>
            <li>
              <Link
                href="/testimonials"
                className="text-sm text-foreground-muted hover:text-foreground transition-colors"
              >
                Testimonials
              </Link>
            </li>
            <li>
              <Link href="/faq" className="text-sm text-foreground-muted hover:text-foreground transition-colors">
                FAQ
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium mb-4">Company</h4>
          <ul className="space-y-3">
            <li>
              <Link href="/about" className="text-sm text-foreground-muted hover:text-foreground transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link href="/blog" className="text-sm text-foreground-muted hover:text-foreground transition-colors">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/careers" className="text-sm text-foreground-muted hover:text-foreground transition-colors">
                Careers
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-sm text-foreground-muted hover:text-foreground transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium mb-4">Legal</h4>
          <ul className="space-y-3">
            <li>
              <Link href="/privacy" className="text-sm text-foreground-muted hover:text-foreground transition-colors">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-sm text-foreground-muted hover:text-foreground transition-colors">
                Terms
              </Link>
            </li>
            <li>
              <Link href="/cookies" className="text-sm text-foreground-muted hover:text-foreground transition-colors">
                Cookies
              </Link>
            </li>
            <li>
              <Link href="/licenses" className="text-sm text-foreground-muted hover:text-foreground transition-colors">
                Licenses
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="container mt-12 pt-6 border-t border-border/40 text-center">
        <p className="text-sm text-foreground-muted">© {new Date().getFullYear()} Furniview. All rights reserved.</p>
      </div>
    </footer>
  )
}
