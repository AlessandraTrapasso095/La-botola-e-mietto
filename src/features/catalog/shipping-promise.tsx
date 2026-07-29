import { PackageIcon, ShieldIcon } from "@/components/icons";
import { Container } from "@/components/ui/container";
import { businessInfo } from "@/config/business";
import { shippingConfig } from "@/config/commerce";
import { formatEuroMinor } from "@/lib/money";

export function ShippingPromise() {
  return (
    <section className="border-border-subtle bg-surface border-y">
      <Container className="grid gap-6 py-10 md:grid-cols-3 md:py-12">
        <div className="flex gap-4">
          <PackageIcon className="text-accent mt-1 shrink-0" />
          <div>
            <h2 className="text-text-strong font-serif text-lg">
              Spedizione gratuita
            </h2>
            <p className="text-text-muted mt-1 text-sm">
              In Italia sopra{" "}
              {formatEuroMinor(businessInfo.freeShippingThresholdMinor)}.
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <ShieldIcon className="text-accent mt-1 shrink-0" />
          <div>
            <h2 className="text-text-strong font-serif text-lg">
              Imballaggio protettivo
            </h2>
            <p className="text-text-muted mt-1 text-sm">
              Preparato con cura per proteggere ogni bottiglia.
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <PackageIcon className="text-accent mt-1 shrink-0" />
          <div>
            <h2 className="text-text-strong font-serif text-lg">
              Consegna indicativa
            </h2>
            <p className="text-text-muted mt-1 text-sm">
              Entro {shippingConfig.indicativeDeliveryHoursFromDispatch} ore
              dalla spedizione.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
