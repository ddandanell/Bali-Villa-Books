import { Layout } from "@/components/Layout";
import { FadeIn } from "@/components/Motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CheckCircle2, Download } from "lucide-react";

export default function SampleReport() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <Layout>
      <div className="bg-muted/30 py-20 border-b border-border/50">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <FadeIn>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">Sample Owner Statement</h1>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Take a look at the exact report you will receive by the 15th of every month. Clear, structured, and in plain English.
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20 max-w-5xl">
        <FadeIn delay={0.2}>
          <div className="bg-white rounded-xl shadow-xl border border-border p-8 md:p-12 mb-20 max-w-4xl mx-auto relative overflow-hidden">
            {/* Document Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-primary/20 pb-8 mb-8">
              <div>
                <h2 className="text-3xl font-serif font-bold text-primary mb-2">Owner Financial Statement</h2>
                <div className="text-muted-foreground">Villa Tirta Sari, Canggu</div>
              </div>
              <div className="mt-4 md:mt-0 text-right">
                <div className="font-bold text-foreground">Reporting Period:</div>
                <div className="text-muted-foreground">April 1 – April 30, 2025</div>
              </div>
            </div>

            {/* Document Body */}
            <div className="space-y-12">
              
              {/* Occupancy Snapshot */}
              <div>
                <h3 className="text-lg font-bold text-primary border-b border-border pb-2 mb-4">1. Occupancy Snapshot</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-muted/20 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Nights Booked</div>
                    <div className="text-xl font-bold">24 / 30</div>
                    <div className="text-xs text-green-600 font-medium">80% Occupancy</div>
                  </div>
                  <div className="bg-muted/20 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">ADR (Avg Daily Rate)</div>
                    <div className="text-xl font-bold">$ 345.00</div>
                  </div>
                  <div className="bg-muted/20 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">RevPAR</div>
                    <div className="text-xl font-bold">$ 276.00</div>
                  </div>
                </div>
              </div>

              {/* Revenue Summary */}
              <div>
                <h3 className="text-lg font-bold text-primary border-b border-border pb-2 mb-4">2. Revenue Summary</h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-muted-foreground border-b border-border/50">
                      <th className="py-2 font-medium">Channel</th>
                      <th className="py-2 font-medium text-right">Gross Booking</th>
                      <th className="py-2 font-medium text-right">OTA Commission</th>
                      <th className="py-2 font-medium text-right">Net Received (USD)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50">
                      <td className="py-3">Airbnb</td>
                      <td className="py-3 text-right">$ 6,240.00</td>
                      <td className="py-3 text-right text-destructive">($ 936.00)</td>
                      <td className="py-3 text-right font-medium">$ 5,304.00</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3">Booking.com</td>
                      <td className="py-3 text-right">$ 2,040.00</td>
                      <td className="py-3 text-right text-destructive">($ 306.00)</td>
                      <td className="py-3 text-right font-medium">$ 1,734.00</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3">Direct</td>
                      <td className="py-3 text-right">$ 1,035.00</td>
                      <td className="py-3 text-right text-destructive">$ 0.00</td>
                      <td className="py-3 text-right font-medium">$ 1,035.00</td>
                    </tr>
                    <tr className="bg-muted/10 font-bold">
                      <td className="py-3">Total Revenue</td>
                      <td className="py-3 text-right">$ 9,315.00</td>
                      <td className="py-3 text-right text-destructive">($ 1,242.00)</td>
                      <td className="py-3 text-right text-primary">$ 8,073.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Operating Expenses */}
              <div>
                <h3 className="text-lg font-bold text-primary border-b border-border pb-2 mb-4">3. Operating Expenses</h3>
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-border/50">
                      <td className="py-2 text-muted-foreground">Management Fee (15%)</td>
                      <td className="py-2 text-right">$ 1,210.95</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2 text-muted-foreground">Staff Wages (Manager, Housekeeping)</td>
                      <td className="py-2 text-right">$ 850.00</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2 text-muted-foreground">Utilities (Electricity, Internet, Water)</td>
                      <td className="py-2 text-right">$ 320.50</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2 text-muted-foreground">Maintenance (Pool, Garden)</td>
                      <td className="py-2 text-right">$ 180.00</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2 text-muted-foreground">Guest Supplies & Amenities</td>
                      <td className="py-2 text-right">$ 215.25</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2 text-muted-foreground">Banjar & Local Fees</td>
                      <td className="py-2 text-right">$ 50.00</td>
                    </tr>
                    <tr className="bg-muted/10 font-bold text-destructive">
                      <td className="py-3">Total Operating Expenses</td>
                      <td className="py-3 text-right">$ 2,826.70</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Net Operating Position */}
              <div>
                <h3 className="text-lg font-bold text-primary border-b border-border pb-2 mb-4">4. Net Operating Position</h3>
                <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-muted-foreground">Total Net Revenue</span>
                    <span className="font-medium">$ 8,073.00</span>
                  </div>
                  <div className="flex justify-between items-center mb-4 border-b border-primary/10 pb-4">
                    <span className="text-muted-foreground">Total Operating Expenses</span>
                    <span className="font-medium text-destructive">($ 2,826.70)</span>
                  </div>
                  <div className="flex justify-between items-center text-xl font-bold text-primary">
                    <span>Net Operating Income</span>
                    <span>$ 5,246.30</span>
                  </div>
                </div>
              </div>

              {/* Cash Summary */}
              <div>
                <h3 className="text-lg font-bold text-primary border-b border-border pb-2 mb-4">5. Cash Summary (Operational Account)</h3>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div className="border border-border/50 p-4 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Opening Bal</div>
                    <div className="font-bold">$ 2,100.00</div>
                  </div>
                  <div className="border border-border/50 p-4 rounded-lg bg-green-50/50">
                    <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Cash In</div>
                    <div className="font-bold text-green-700">+$ 8,073.00</div>
                  </div>
                  <div className="border border-border/50 p-4 rounded-lg bg-red-50/50">
                    <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Cash Out</div>
                    <div className="font-bold text-destructive">-$ 2,826.70</div>
                  </div>
                  <div className="border-2 border-primary p-4 rounded-lg bg-primary/5">
                    <div className="text-xs text-primary font-bold mb-1 uppercase tracking-wider">Closing Bal</div>
                    <div className="font-bold text-primary">$ 7,346.30</div>
                  </div>
                </div>
              </div>

            </div>

            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
          </div>
        </FadeIn>

        <FadeIn delay={0.4}>
          <Card className="max-w-md mx-auto border-primary/20 shadow-lg relative z-10 -mt-24 bg-background">
            <CardHeader className="text-center">
              <CardTitle className="font-serif text-2xl text-primary">Get the Full Sample PDF</CardTitle>
              <CardDescription>Enter your details to download the complete 3-page sample report.</CardDescription>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-lg mb-2">Check your email</h4>
                  <p className="text-muted-foreground">We've sent the sample report to your inbox.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Jane Doe" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="jane@example.com" required />
                  </div>
                  <Button type="submit" className="w-full h-12 text-base font-bold bg-primary hover:bg-primary/90">
                    <Download className="mr-2 w-4 h-4" /> Send me the sample statement
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </Layout>
  );
}
