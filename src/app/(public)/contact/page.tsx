import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-24 sm:px-6 lg:px-8 max-w-2xl">
      <h1 className="font-bebas text-5xl md:text-6xl tracking-wide text-foreground mb-4 text-center">
        Contact Sales
      </h1>
      <p className="text-muted-foreground text-center mb-12">
        Have questions about our systems or need a custom enterprise solution? Reach out to our team.
      </p>
      
      <div className="bg-card border border-border/50 rounded-xl p-8">
        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">First Name</label>
              <Input placeholder="John" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Last Name</label>
              <Input placeholder="Doe" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input type="email" placeholder="john@company.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Message</label>
            <Textarea placeholder="How can we help you?" className="min-h-[150px]" />
          </div>
          <Button type="button" size="lg" className="w-full">Send Message</Button>
        </form>
      </div>
    </div>
  );
}
