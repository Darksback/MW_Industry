import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Fingerprint, ScanFace, ChevronRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background pt-24 pb-32">
        {/* Background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary backdrop-blur-sm">
                <Shield className="mr-2 h-4 w-4" />
                The Future of Access Control
              </div>
              
              <h1 className="font-bebas text-6xl md:text-8xl tracking-wider text-foreground leading-[0.9]">
                INTELLIGENT <br />
                <span className="text-primary drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]">SECURITY</span> SYSTEMS
              </h1>
              
              <p className="max-w-2xl text-lg md:text-xl text-muted-foreground mx-auto lg:mx-0">
                Pioneering the next generation of biometric and smart access control. 
                Experience seamless, military-grade security tailored for modern 
                residential and industrial environments.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link href="/products">
                  <Button size="lg" className="h-14 px-8 text-lg font-medium">
                    Explore Catalog
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-medium">
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="flex-1 w-full relative">
              <div className="aspect-square relative flex items-center justify-center">
                {/* Decorative circles */}
                <div className="absolute inset-0 rounded-full border border-primary/20 bg-primary/5 blur-3xl" />
                <div className="absolute w-[80%] h-[80%] rounded-full border border-primary/30 rotate-45" />
                
                {/* Hero Graphic placeholder - represent a smart lock */}
                <div className="relative z-10 w-64 h-96 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md shadow-2xl flex flex-col items-center justify-center p-8 overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
                  <div className="w-24 h-24 rounded-full border-2 border-primary/50 flex items-center justify-center mb-8 relative">
                    <div className="absolute inset-0 rounded-full border border-primary animate-ping opacity-20" />
                    <ScanFace className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="font-bebas text-2xl tracking-wide text-foreground mb-2">MW-FR300</h3>
                  <p className="text-sm text-muted-foreground text-center">3D Facial Recognition Deadbolt</p>
                  
                  {/* Scanning effect */}
                  <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-primary/0 via-primary/10 to-primary/0 translate-y-[-100%] group-hover:animate-[scan_3s_ease-in-out_infinite]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-secondary/30 py-24 border-y border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-bebas text-4xl md:text-5xl tracking-wide text-foreground mb-4">Uncompromising Protection</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our systems integrate cutting-edge biometric hardware with robust 
              software management for unparalleled security and convenience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-xl border border-border/50 bg-background/50 p-8 backdrop-blur-sm transition-colors hover:border-primary/50">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Fingerprint className="h-6 w-6" />
              </div>
              <h3 className="mb-3 font-bebas text-2xl tracking-wide text-foreground">Advanced Biometrics</h3>
              <p className="text-muted-foreground leading-relaxed">
                Sub-second authentication using 3D facial mapping and encrypted fingerprint data, ensuring access is limited only to authorized personnel.
              </p>
            </div>
            
            <div className="rounded-xl border border-border/50 bg-background/50 p-8 backdrop-blur-sm transition-colors hover:border-primary/50">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="mb-3 font-bebas text-2xl tracking-wide text-foreground">Military-Grade Encryption</h3>
              <p className="text-muted-foreground leading-relaxed">
                All data transmission and storage utilizes AES-256 encryption. Your access credentials and audit logs remain strictly confidential.
              </p>
            </div>
            
            <div className="rounded-xl border border-border/50 bg-background/50 p-8 backdrop-blur-sm transition-colors hover:border-primary/50">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="mb-3 font-bebas text-2xl tracking-wide text-foreground">Industrial Durability</h3>
              <p className="text-muted-foreground leading-relaxed">
                Built with reinforced steel alloys and weatherproof IP68 sealing to withstand extreme temperatures, impacts, and the harshest environments.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-bebas text-4xl md:text-5xl tracking-wide text-foreground mb-6">Ready to secure your premises?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Browse our catalog of intelligent locks, from residential deadbolts to heavy-duty industrial access control systems.
          </p>
          <Link href="/products">
            <Button size="lg" className="h-14 px-10 text-lg">
              View Product Catalog
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
