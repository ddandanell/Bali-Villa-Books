import { Layout } from "@/components/Layout";
import { FadeIn } from "@/components/Motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { CheckCircle2, ChevronRight, ArrowLeft, AlertCircle } from "lucide-react";

type FormData = {
  villaName: string;
  area: string;
  bedrooms: string;
  platforms: string[];
  channelManager: string;
  channelManagerName: string;
  ownershipStructure: string;
  ownerBase: string;
  localManagement: string;
  bookkeepingSystem: string;
  monthlyRevenue: string;
  taxFiled: string;
  concern: string;
  fullName: string;
  email: string;
  contactMethod: string;
  whatsapp: string;
  startTimeline: string;
};

const initialFormData: FormData = {
  villaName: "",
  area: "",
  bedrooms: "",
  platforms: [],
  channelManager: "no",
  channelManagerName: "",
  ownershipStructure: "",
  ownerBase: "",
  localManagement: "",
  bookkeepingSystem: "",
  monthlyRevenue: "",
  taxFiled: "",
  concern: "",
  fullName: "",
  email: "",
  contactMethod: "email",
  whatsapp: "",
  startTimeline: "",
};

function validateStep(step: number, formData: FormData): string[] {
  const errors: string[] = [];
  if (step === 1) {
    if (!formData.villaName.trim()) errors.push("Please enter your villa name.");
    if (!formData.area) errors.push("Please select your villa's area in Bali.");
    if (!formData.bedrooms || parseInt(formData.bedrooms) < 1) errors.push("Please enter the number of bedrooms.");
  }
  if (step === 2) {
    if (!formData.ownershipStructure) errors.push("Please select your ownership structure.");
    if (!formData.ownerBase) errors.push("Please indicate where you are based.");
    if (!formData.localManagement) errors.push("Please select your local management situation.");
  }
  if (step === 3) {
    if (!formData.bookkeepingSystem) errors.push("Please select your current bookkeeping system.");
    if (!formData.monthlyRevenue) errors.push("Please select your estimated monthly gross revenue.");
    if (!formData.taxFiled) errors.push("Please answer the Indonesian tax filing question.");
  }
  if (step === 4) {
    if (!formData.fullName.trim()) errors.push("Please enter your full name.");
    if (!formData.email.trim()) errors.push("Please enter your email address.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.push("Please enter a valid email address.");
    if (!formData.startTimeline) errors.push("Please indicate when you are looking to start.");
  }
  return errors;
}

export default function GetStarted() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<string[]>([]);

  const set = (field: keyof FormData, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const togglePlatform = (platform: string) => {
    setFormData((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform],
    }));
  };

  const handleNext = () => {
    const errs = validateStep(step, formData);
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }
    setErrors([]);
    setStep((s) => Math.min(s + 1, 4));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateStep(4, formData);
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }
    setErrors([]);
    setSubmitted(true);
  };

  const prevStep = () => {
    setErrors([]);
    setStep((s) => Math.max(s - 1, 1));
  };

  const renderStepIndicator = () => (
    <div className="mb-10">
      <div className="flex justify-between mb-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors
              ${step === i ? "bg-primary text-primary-foreground" :
                step > i ? "bg-primary/20 text-primary cursor-pointer" : "bg-muted text-muted-foreground"}`}
            onClick={() => step > i && setStep(i)}
          >
            {step > i ? <CheckCircle2 className="w-5 h-5" /> : i}
          </div>
        ))}
      </div>
      <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-primary transition-all duration-300 ease-in-out"
          style={{ width: `${((step - 1) / 3) * 100}%` }}
        />
      </div>
      <div className="flex justify-between mt-2 text-xs font-medium text-muted-foreground px-1">
        <span className={step >= 1 ? "text-primary" : ""}>Villa</span>
        <span className={step >= 2 ? "text-primary" : ""}>Structure</span>
        <span className={step >= 3 ? "text-primary" : ""}>Finances</span>
        <span className={step >= 4 ? "text-primary" : ""}>Contact</span>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="bg-muted/30 py-16 border-b border-border/50">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <FadeIn>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">Get Started</h1>
            <p className="text-lg text-foreground/70">
              Tell us a bit about your property, and we'll schedule a free 15-minute clarity call.
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <FadeIn delay={0.1}>
          {submitted ? (
            <Card className="border-primary/20 shadow-lg text-center py-16">
              <CardContent>
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-serif font-bold text-primary mb-4">Thank you, {formData.fullName || "there"}.</h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                  We've received your details. Expect a personal response via your preferred contact method within 24 hours.
                </p>
                <Button onClick={() => { window.location.href = "/"; }} variant="outline" className="h-12 px-8">
                  Return to Homepage
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border shadow-md">
              <CardHeader className="bg-muted/20 border-b border-border/50 pb-8">
                {renderStepIndicator()}
                <CardTitle className="text-2xl font-serif text-primary">
                  {step === 1 && "Step 1: About Your Villa"}
                  {step === 2 && "Step 2: Ownership & Structure"}
                  {step === 3 && "Step 3: Your Financial Situation"}
                  {step === 4 && "Step 4: Contact Details"}
                </CardTitle>
                <CardDescription>
                  {step === 1 && "Basic details about your property in Bali."}
                  {step === 2 && "How your investment is legally structured."}
                  {step === 3 && "Where you currently stand with your bookkeeping."}
                  {step === 4 && "How we can reach you to discuss your needs."}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-8">
                {errors.length > 0 && (
                  <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                      <ul className="space-y-1">
                        {errors.map((err, i) => (
                          <li key={i} className="text-sm text-destructive">{err}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* STEP 1 */}
                {step === 1 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="space-y-3">
                      <Label htmlFor="villaName" className="text-base">Villa Name <span className="text-destructive">*</span></Label>
                      <Input
                        id="villaName"
                        placeholder="e.g. Villa Tirta Sari"
                        value={formData.villaName}
                        onChange={(e) => set("villaName", e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="area" className="text-base">Area in Bali <span className="text-destructive">*</span></Label>
                        <Select value={formData.area} onValueChange={(v) => set("area", v)}>
                          <SelectTrigger id="area">
                            <SelectValue placeholder="Select area" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="canggu">Canggu</SelectItem>
                            <SelectItem value="seminyak">Seminyak</SelectItem>
                            <SelectItem value="ubud">Ubud</SelectItem>
                            <SelectItem value="uluwatu">Uluwatu</SelectItem>
                            <SelectItem value="sanur">Sanur</SelectItem>
                            <SelectItem value="nusa-dua">Nusa Dua</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="bedrooms" className="text-base">Bedrooms <span className="text-destructive">*</span></Label>
                        <Input
                          id="bedrooms"
                          type="number"
                          min="1"
                          placeholder="e.g. 3"
                          value={formData.bedrooms}
                          onChange={(e) => set("bedrooms", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-base">Rental Platforms Used</Label>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {["Airbnb", "Booking.com", "VRBO", "Direct bookings", "Other"].map((platform) => (
                          <div key={platform} className="flex items-center space-x-3 bg-muted/20 p-3 rounded-lg border border-border/50">
                            <Checkbox
                              id={`platform-${platform}`}
                              checked={formData.platforms.includes(platform)}
                              onCheckedChange={() => togglePlatform(platform)}
                            />
                            <Label htmlFor={`platform-${platform}`} className="font-normal cursor-pointer w-full">{platform}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-base">Do you use a Channel Manager?</Label>
                      <RadioGroup
                        value={formData.channelManager}
                        onValueChange={(v) => set("channelManager", v)}
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-3 bg-muted/20 p-3 rounded-lg border border-border/50">
                          <RadioGroupItem value="yes" id="cm-yes" />
                          <Label htmlFor="cm-yes" className="font-normal cursor-pointer w-full">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-3 bg-muted/20 p-3 rounded-lg border border-border/50">
                          <RadioGroupItem value="no" id="cm-no" />
                          <Label htmlFor="cm-no" className="font-normal cursor-pointer w-full">No</Label>
                        </div>
                      </RadioGroup>
                      {formData.channelManager === "yes" && (
                        <div className="space-y-2 pt-2">
                          <Label htmlFor="channelManagerName" className="text-sm text-muted-foreground">Which channel manager do you use?</Label>
                          <Input
                            id="channelManagerName"
                            placeholder="e.g. Cloudbeds, Guesty, Hostaway, Lodgify..."
                            value={formData.channelManagerName}
                            onChange={(e) => set("channelManagerName", e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="space-y-4">
                      <Label className="text-base">Ownership Structure <span className="text-destructive">*</span></Label>
                      <RadioGroup
                        value={formData.ownershipStructure}
                        onValueChange={(v) => set("ownershipStructure", v)}
                        className="grid gap-3"
                      >
                        {[
                          { id: "ptpma", label: "PT PMA (Foreign Investment Company)" },
                          { id: "leasehold", label: "Leasehold / Nominee" },
                          { id: "other", label: "Other" },
                          { id: "notsure", label: "Not sure" },
                        ].map((opt) => (
                          <div key={opt.id} className="flex items-center space-x-3 bg-muted/20 p-4 rounded-lg border border-border/50">
                            <RadioGroupItem value={opt.id} id={`struct-${opt.id}`} />
                            <Label htmlFor={`struct-${opt.id}`} className="font-medium cursor-pointer w-full">{opt.label}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-base">Where are you based? <span className="text-destructive">*</span></Label>
                      <RadioGroup
                        value={formData.ownerBase}
                        onValueChange={(v) => set("ownerBase", v)}
                        className="grid gap-3"
                      >
                        {[
                          { id: "bali", label: "Bali-based" },
                          { id: "remote-same", label: "Remote — same country as villa (Indonesia)" },
                          { id: "remote-overseas", label: "Remote — overseas" },
                        ].map((opt) => (
                          <div key={opt.id} className="flex items-center space-x-3 bg-muted/20 p-4 rounded-lg border border-border/50">
                            <RadioGroupItem value={opt.id} id={`base-${opt.id}`} />
                            <Label htmlFor={`base-${opt.id}`} className="font-medium cursor-pointer w-full">{opt.label}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-base">Local Management <span className="text-destructive">*</span></Label>
                      <RadioGroup
                        value={formData.localManagement}
                        onValueChange={(v) => set("localManagement", v)}
                        className="grid gap-3"
                      >
                        {[
                          { id: "mgr-yes", label: "We have a local villa manager/company" },
                          { id: "mgr-no", label: "No local manager" },
                          { id: "mgr-self", label: "We manage everything ourselves" },
                        ].map((opt) => (
                          <div key={opt.id} className="flex items-center space-x-3 bg-muted/20 p-4 rounded-lg border border-border/50">
                            <RadioGroupItem value={opt.id} id={`mgr-${opt.id}`} />
                            <Label htmlFor={`mgr-${opt.id}`} className="font-medium cursor-pointer w-full">{opt.label}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="space-y-4">
                      <Label className="text-base">Current Bookkeeping System <span className="text-destructive">*</span></Label>
                      <RadioGroup
                        value={formData.bookkeepingSystem}
                        onValueChange={(v) => set("bookkeepingSystem", v)}
                        className="grid gap-3"
                      >
                        {[
                          { id: "bk-none", label: "No system at all" },
                          { id: "bk-informal", label: "Informal tracking on spreadsheet or WhatsApp" },
                          { id: "bk-basic", label: "Basic bookkeeping in place but not organized" },
                          { id: "bk-some", label: "Some system but not accurate/reliable" },
                        ].map((opt) => (
                          <div key={opt.id} className="flex items-center space-x-3 bg-muted/20 p-4 rounded-lg border border-border/50">
                            <RadioGroupItem value={opt.id} id={`bk-${opt.id}`} />
                            <Label htmlFor={`bk-${opt.id}`} className="font-medium cursor-pointer w-full">{opt.label}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-base">Estimated Monthly Gross Revenue (IDR) <span className="text-destructive">*</span></Label>
                      <RadioGroup
                        value={formData.monthlyRevenue}
                        onValueChange={(v) => set("monthlyRevenue", v)}
                        className="grid sm:grid-cols-2 gap-3"
                      >
                        {[
                          { id: "rev-1", label: "Under Rp 50.000.000" },
                          { id: "rev-2", label: "Rp 50.000.000 – Rp 130.000.000" },
                          { id: "rev-3", label: "Rp 130.000.000 – Rp 330.000.000" },
                          { id: "rev-4", label: "Above Rp 330.000.000" },
                        ].map((opt) => (
                          <div key={opt.id} className="flex items-center space-x-3 bg-muted/20 p-4 rounded-lg border border-border/50">
                            <RadioGroupItem value={opt.id} id={`rev-${opt.id}`} />
                            <Label htmlFor={`rev-${opt.id}`} className="font-medium cursor-pointer w-full">{opt.label}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-base">Have you ever filed Indonesian taxes for this villa income? <span className="text-destructive">*</span></Label>
                      <RadioGroup
                        value={formData.taxFiled}
                        onValueChange={(v) => set("taxFiled", v)}
                        className="flex flex-wrap gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="tax-yes" />
                          <Label htmlFor="tax-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="tax-no" />
                          <Label htmlFor="tax-no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="notsure" id="tax-notsure" />
                          <Label htmlFor="tax-notsure">Not sure</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="concern" className="text-base">What is your biggest financial concern right now?</Label>
                      <Textarea
                        id="concern"
                        placeholder="E.g., I have no idea if we're profitable, or I'm worried about taxes..."
                        className="h-24"
                        value={formData.concern}
                        onChange={(e) => set("concern", e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* STEP 4 */}
                {step === 4 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="space-y-4">
                      <Label htmlFor="fullName" className="text-base">Full Name <span className="text-destructive">*</span></Label>
                      <Input
                        id="fullName"
                        placeholder="Jane Doe"
                        value={formData.fullName}
                        onChange={(e) => set("fullName", e.target.value)}
                      />
                    </div>

                    <div className="space-y-4">
                      <Label htmlFor="emailInput" className="text-base">Email Address <span className="text-destructive">*</span></Label>
                      <Input
                        id="emailInput"
                        type="email"
                        placeholder="jane@example.com"
                        value={formData.email}
                        onChange={(e) => set("email", e.target.value)}
                      />
                    </div>

                    <div className="space-y-4">
                      <Label className="text-base">Preferred Contact Method</Label>
                      <RadioGroup
                        value={formData.contactMethod}
                        onValueChange={(v) => set("contactMethod", v)}
                        className="flex space-x-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="email" id="contact-email" />
                          <Label htmlFor="contact-email" className="font-medium">Email</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="whatsapp" id="contact-wa" />
                          <Label htmlFor="contact-wa" className="font-medium">WhatsApp</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-4">
                      <Label htmlFor="whatsapp" className="text-base">WhatsApp Number (Optional)</Label>
                      <Input
                        id="whatsapp"
                        type="tel"
                        placeholder="+1 234 567 8900"
                        value={formData.whatsapp}
                        onChange={(e) => set("whatsapp", e.target.value)}
                      />
                    </div>

                    <div className="space-y-4 pt-4 border-t border-border">
                      <Label className="text-base">When are you looking to start? <span className="text-destructive">*</span></Label>
                      <RadioGroup
                        value={formData.startTimeline}
                        onValueChange={(v) => set("startTimeline", v)}
                        className="grid gap-3"
                      >
                        {[
                          { id: "start-asap", label: "As soon as possible" },
                          { id: "start-month", label: "Within the next month" },
                          { id: "start-exploring", label: "Just exploring for now" },
                        ].map((opt) => (
                          <div key={opt.id} className="flex items-center space-x-3 bg-muted/20 p-4 rounded-lg border border-border/50">
                            <RadioGroupItem value={opt.id} id={`start-${opt.id}`} />
                            <Label htmlFor={`start-${opt.id}`} className="font-medium cursor-pointer w-full">{opt.label}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                )}

                <div className="mt-12 flex justify-between items-center pt-6 border-t border-border/50">
                  {step > 1 ? (
                    <Button type="button" variant="outline" onClick={prevStep} className="h-12 px-6">
                      <ArrowLeft className="mr-2 w-4 h-4" /> Back
                    </Button>
                  ) : (
                    <div></div>
                  )}

                  {step < 4 ? (
                    <Button type="button" onClick={handleNext} className="h-12 px-8 bg-primary hover:bg-primary/90 text-base">
                      Next Step <ChevronRight className="ml-2 w-4 h-4" />
                    </Button>
                  ) : (
                    <Button type="button" onClick={handleSubmit} className="h-12 px-8 bg-secondary text-secondary-foreground hover:bg-secondary/90 text-base font-bold shadow-md">
                      Submit & Request Call
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </FadeIn>
      </div>
    </Layout>
  );
}
