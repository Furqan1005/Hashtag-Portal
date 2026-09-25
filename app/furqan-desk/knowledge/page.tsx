import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { customerKnowledge } from "@/lib/furqan-desk/mock-data";
import { POLISH_JEWELRY_GLOSSARY } from "@/lib/furqan-desk/polish-glossary";

export default function CustomerKnowledgePage() {
  return (
    <div className="flex flex-col gap-6 pt-2">
      <div>
        <h1 className="font-heading text-4xl font-semibold text-brand-brown">Customer Knowledge</h1>
        <p className="text-brand-brown/60 mt-1.5 max-w-2xl text-sm">
          Terminology, confirmed design mappings and request patterns Estrella&apos;s Autopilot remembers per
          customer. This is separate from order-specific values, which are always read fresh from
          the current request.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Language Understanding</CardTitle>
          <CardDescription>
            Unlike field terminology, a language isn&apos;t customer-specific — this translation
            applies to any request, from any customer, sourced from the team&apos;s own EN↔PL jewelry
            dictionary. Requests in Polish are translated to English before extraction.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 sm:grid-cols-3 lg:grid-cols-4">
            {POLISH_JEWELRY_GLOSSARY.map((entry) => (
              <div key={entry.polish} className="flex flex-col py-1 text-sm">
                <span className="text-brand-brown font-medium">{entry.english}</span>
                <span className="text-brand-brown/50 text-xs">{entry.polish}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {customerKnowledge.map((knowledge) => (
        <Card key={knowledge.customer}>
          <CardHeader>
            <CardTitle>{knowledge.customer}</CardTitle>
            <CardDescription>
              Terminology is customer-specific — the same abbreviation can mean different things for
              different customers.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div>
              <p className="text-brand-brown/50 mb-2 text-xs font-semibold tracking-wide uppercase">
                Known Terminology
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer Term</TableHead>
                    <TableHead>Internal Meaning</TableHead>
                    <TableHead>Note</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {knowledge.terminology.map((t) => (
                    <TableRow key={t.term}>
                      <TableCell className="font-medium text-brand-brown">{t.term}</TableCell>
                      <TableCell>{t.meaning}</TableCell>
                      <TableCell className="text-brand-brown/55 text-xs">
                        {t.note ?? "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div>
              <p className="text-brand-brown/50 mb-2 text-xs font-semibold tracking-wide uppercase">
                Confirmed Design Mappings
              </p>
              <div className="flex flex-wrap gap-2">
                {knowledge.confirmedMappings.map((m) => (
                  <Badge key={m.customerStyle} variant="gold" className="py-1.5">
                    {m.customerStyle} → {m.internalDesign}
                    <span className="text-brand-brown/50 ml-1 font-normal">
                      (confirmed {m.confirmedOn})
                    </span>
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <p className="text-brand-brown/50 mb-2 text-xs font-semibold tracking-wide uppercase">
                Request Pattern
              </p>
              <p className="text-brand-brown/75 text-sm">
                {knowledge.customer} usually sends: {knowledge.requestPattern.join(", ")}.
              </p>
              <p className="text-brand-brown/45 mt-2 text-xs italic">
                Order-specific values are always read from the current request — this pattern
                describes format, not confirmed quantities or amounts.
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
