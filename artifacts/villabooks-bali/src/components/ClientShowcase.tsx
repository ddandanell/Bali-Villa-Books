import { ArrowUpRight } from "lucide-react";

const wrap = "mx-auto max-w-7xl px-5 md:px-8";

const clients = [
  {
    name: "Q Villas Bali", url: "https://qvillasbali.com/", villas: 3,
    description: "A focused, high-end villa collection. Its compact portfolio makes a clear financial view for each property especially useful.",
  },
  {
    name: "Avani Bali Villas", url: "https://avanibalivillas.com/", villas: 4,
    description: "Four Ubud villas with direct booking, housekeeping and an on-call team. Channel-by-channel tracking helps distinguish direct reservations from platform bookings.",
  },
  {
    name: "Villa Nest Bali", url: "https://villanest.com/4-private-luxury-villas/", villas: 4,
    description: "Four Seminyak villas served by one team. Shared staffing and services make consistent allocation of costs to each villa important.",
  },
  {
    name: "Bila De Ubud Villas", url: "https://www.biladeubudvillas.com/index.html", villas: 4,
    description: "A compact Ubud collection with private pools and daily room service. Property-level records help keep guest income and operating expenses identifiable.",
  },
  {
    name: "Phinisi Villas Bali", url: "https://www.phinisivillasbali.com/", villas: 6,
    description: "Six distinct villas across Seminyak and Canggu. Different property sizes make per-villa revenue and profitability comparisons more informative than one combined total.",
  },
  {
    name: "Samastiti Villas", url: "https://samastitivillas.com/", villas: 7,
    description: "Seven villas across several Bali locations. A geographically spread portfolio benefits from separate maintenance, staffing and transport-cost records.",
  },
];

export function ClientShowcase() {
  return <section id="our-clients" className="border-y border-primary/10 bg-accent/35 py-16 sm:py-24">
    <div className={wrap}>
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[.2em] text-secondary">Clients we work with</p>
        <h2 className="mt-4 font-serif text-3xl leading-[1.08] text-primary sm:text-5xl">Villa owners and operators across Bali.</h2>
        <p className="mt-5 text-base leading-7 text-foreground/70 sm:text-lg">Meet six villa operators we work with. These collection descriptions explain their businesses and the bookkeeping questions different portfolios can create.</p>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {clients.map(client => <article key={client.name} className="flex flex-col rounded-2xl border border-primary/10 bg-background p-6 sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-wider text-secondary">Listed collection · {client.villas} villas</p>
          <h3 className="mt-4 font-serif text-2xl text-primary">
            <a href={client.url} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 underline decoration-transparent underline-offset-4 hover:decoration-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
              {client.name}<ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0 text-secondary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              <span className="sr-only"> — visit website (opens in a new tab)</span>
            </a>
          </h3>
          <p className="mt-4 text-sm leading-7 text-foreground/70">{client.description}</p>
        </article>)}
      </div>
      <p className="mt-6 max-w-4xl text-xs leading-6 text-foreground/60">Listed collection sizes describe the operators’ portfolios, not the number of properties managed or serviced by Bali Accounting. These are business descriptions, not quoted testimonials or claims of financial results.</p>
    </div>
  </section>;
}

export function SixVillaScenario() {
  return <section aria-labelledby="six-villa-example" className="bg-background">
    <div className={`${wrap} py-14 sm:py-20`}>
      <p className="text-xs font-bold uppercase tracking-[.18em] text-secondary">Fictional bookkeeping example</p>
      <h2 id="six-villa-example" className="mt-3 max-w-4xl font-serif text-3xl leading-tight text-primary">A monthly close for six separately owned villas.</h2>
      <p className="mt-5 max-w-4xl rounded-xl border border-secondary/25 bg-accent/45 p-4 text-sm leading-6 text-foreground/75"><strong>This scenario is made up.</strong> It is not a client case study or a finding about any operator listed above. In this illustration, one management company manages six villas on behalf of their separate owners.</p>
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div>
          <h3 className="font-serif text-2xl text-primary">The assumed spreadsheet problem</h3>
          <p className="mt-3 text-sm leading-7 text-foreground/70">The example spreadsheet treats every guest receipt as company sales and every owner payment as a company expense. It also combines costs from all six villas. That presentation hides each owner’s property performance and obscures the company’s own management activity.</p>
        </div>
        <div>
          <h3 className="font-serif text-2xl text-primary">A clearer owner-by-owner view</h3>
          <p className="mt-3 text-sm leading-7 text-foreground/70">Reconcile each booking to its platform payout and bank receipt. Show each owner their villa’s guest revenue, refunds, platform fees, operating costs, management fee and payout. Keep company overhead in a separate company report, with shared costs allocated on an agreed, documented basis.</p>
        </div>
      </div>
      <p className="mt-6 max-w-4xl text-sm leading-7 text-foreground/70">Keep invoices linked to each transaction and flag routine repairs separately from larger improvements for qualified review. Actual revenue recognition and cost treatment depend on the contracts, entity structure and professional advice; this example does not determine tax or statutory accounting treatment.</p>
    </div>
  </section>;
}
