"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CustomButton } from "@/components/custom-button"

export default function DesignSystem() {
  return (
    <div className="container mx-auto p-6 space-y-12">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold">EduTurkia Design System</h1>
        <p className="text-lg text-muted-foreground">
          A comprehensive design system for the Agenta University Matching Platform
        </p>
      </section>

      {/* Color Palette - Updated with EduTurkia colors */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Color Palette</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ColorCard name="Primary" color="#2D6AB4" textColor="white" description="EduTurkia Blue - Trust, Knowledge" />
          <ColorCard name="Secondary" color="#E31E24" textColor="white" description="EduTurkia Red - Energy, Action" />
          <ColorCard name="Accent" color="#00BCD4" textColor="white" description="Teal - Modern, Youth-friendly" />
          <ColorCard name="Tertiary" color="#666666" textColor="white" description="Gray - Professional, Balance" />
          <ColorCard name="Success" color="#4CAF50" textColor="white" description="Green - Progress, Positive" />
          <ColorCard name="Urgent" color="#FF5722" textColor="white" description="Orange-red - Attention" />
          <ColorCard name="Background" color="#F9FAFB" textColor="black" description="Light - Clean, Approachable" />
          <ColorCard name="Card" color="#FFFFFF" textColor="black" border description="Content Container" />
          <ColorCard name="Text" color="#1E293B" textColor="white" description="Primary Text" />
          <ColorCard name="Muted Text" color="#78909C" textColor="white" description="Secondary Text" />
        </div>
      </section>

      {/* Color Usage Guidelines */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Color Usage Guidelines</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-medium mb-4">Primary Actions</h3>
              <div className="space-y-4">
                <p className="text-muted-foreground mb-2">
                  Use the primary blue for main navigation and UI elements that represent the brand.
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Button>Primary Button</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-medium mb-4">Call to Action</h3>
              <div className="space-y-4">
                <p className="text-muted-foreground mb-2">
                  Use the secondary orange for buttons and elements that require user action.
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Button variant="secondary">Secondary Button</Button>
                  <CustomButton variant="accent">Accent Button</CustomButton>
                  <CustomButton variant="success">Success Button</CustomButton>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-medium mb-4">Highlights & Achievements</h3>
              <div className="space-y-4">
                <p className="text-muted-foreground mb-2">
                  Use accent gold for highlighting achievements, awards, and special opportunities.
                </p>
                <div className="p-4 border border-accent rounded-md">
                  <p className="text-sm font-medium text-accent">Scholarship Opportunity</p>
                  <p className="text-xs text-muted-foreground">50% tuition discount for top applicants</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-medium mb-4">Deadlines & Urgency</h3>
              <div className="space-y-4">
                <p className="text-muted-foreground mb-2">
                  Use urgent red sparingly for deadlines and important notices.
                </p>
                <div className="p-4 border-l-4 border-urgent bg-urgent/5 rounded-md">
                  <p className="text-sm font-medium">Application Deadline</p>
                  <p className="text-xs text-muted-foreground">Applications close in 7 days</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Typography - Unchanged */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Typography</h2>
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Headings</h3>
            <div className="space-y-4 p-4 bg-white rounded-lg border">
              <div>
                <span className="text-sm text-muted-foreground">H1 - 2.5rem/40px - Inter Bold</span>
                <h1 className="text-4xl font-bold text-primary">Find Your Perfect University in Turkey</h1>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">H2 - 2rem/32px - Inter Semibold</span>
                <h2 className="text-3xl font-semibold">Discover Academic Opportunities</h2>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">H3 - 1.5rem/24px - Inter Medium</span>
                <h3 className="text-2xl font-medium">Browse Top Universities</h3>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">H4 - 1.25rem/20px - Inter Medium</span>
                <h4 className="text-xl font-medium">Faculty Highlights</h4>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Body Text</h3>
            <div className="space-y-4 p-4 bg-white rounded-lg border">
              <div>
                <span className="text-sm text-muted-foreground">Body Large - 1.125rem/18px - Inter Regular</span>
                <p className="text-lg">
                  Agenta helps international students find their ideal university in Turkey with personalized guidance.
                </p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Body Default - 1rem/16px - Inter Regular</span>
                <p>
                  We provide discounted tuition rates and comprehensive support throughout your application process.
                </p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Body Small - 0.875rem/14px - Inter Regular</span>
                <p className="text-sm">
                  Our team of advisors is available to answer any questions about studying in Turkey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Buttons - Updated with new variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Custom Buttons</h2>
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Primary Buttons</h3>
            <div className="flex flex-wrap gap-4 p-4 bg-white rounded-lg border">
              <CustomButton size="sm">Small</CustomButton>
              <CustomButton>Default</CustomButton>
              <CustomButton size="lg">Large</CustomButton>
              <CustomButton size="xl">Extra Large</CustomButton>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Secondary Buttons</h3>
            <div className="flex flex-wrap gap-4 p-4 bg-white rounded-lg border">
              <CustomButton variant="secondary" size="sm">
                Small
              </CustomButton>
              <CustomButton variant="secondary">Default</CustomButton>
              <CustomButton variant="secondary" size="lg">
                Large
              </CustomButton>
              <CustomButton variant="secondary" size="xl">
                Extra Large
              </CustomButton>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Special Purpose Buttons</h3>
            <div className="flex flex-wrap gap-4 p-4 bg-white rounded-lg border">
              <CustomButton variant="accent">Achievement</CustomButton>
              <CustomButton variant="success">Success</CustomButton>
              <CustomButton variant="urgent">Urgent</CustomButton>
              <CustomButton variant="outline">Outline</CustomButton>
              <CustomButton variant="ghost">Ghost</CustomButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

interface ColorCardProps {
  name: string;
  color: string;
  textColor: string;
  border?: boolean;
  description?: string;
}

function ColorCard({ name, color, textColor, border = false, description = "" }: ColorCardProps) {
  return (
    <div
      className={`rounded-lg p-4 flex flex-col h-32 justify-between ${border ? "border" : ""}`}
      style={{ backgroundColor: color, color: textColor }}
    >
      <div>
        <span className="font-medium">{name}</span>
        {description && <p className="text-xs mt-1 opacity-80">{description}</p>}
      </div>
      <span className="text-sm opacity-90">{color}</span>
    </div>
  )
}
