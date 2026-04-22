import Link from "next/link";
import { Shield } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-bebas text-2xl tracking-wider text-foreground">MW INDUSTRY</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Pioneering intelligent security solutions for residential, commercial, and industrial applications. 
              Precision engineering meets absolute security.
            </p>
            <div className="flex space-x-4 pt-2">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Facebook
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Twitter
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Instagram
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                LinkedIn
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bebas text-lg tracking-wide text-foreground mb-4">Products</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/products?category=Residential" className="text-muted-foreground hover:text-primary transition-colors">
                  Residential Locks
                </Link>
              </li>
              <li>
                <Link href="/products?category=Commercial" className="text-muted-foreground hover:text-primary transition-colors">
                  Commercial Access
                </Link>
              </li>
              <li>
                <Link href="/products?category=Industrial" className="text-muted-foreground hover:text-primary transition-colors">
                  Industrial Security
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-muted-foreground hover:text-primary transition-colors">
                  All Products
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bebas text-lg tracking-wide text-foreground mb-4">Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bebas text-lg tracking-wide text-foreground mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>1-800-MW-SECURE</li>
              <li>support@mwindustry.com</li>
              <li>
                1200 Industrial Parkway<br />
                Suite 400<br />
                Detroit, MI 48202
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} MW Industry, Inc. All rights reserved.
          </p>
          <div className="flex gap-4">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Shield className="h-3 w-3" /> ISO 27001 Certified
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
