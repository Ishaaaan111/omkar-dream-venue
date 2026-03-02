import { Check, Download, CalendarCheck, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import marriageGarden from "@/assets/marriage-garden.jpg";
import { toast } from "sonner";

const features = [
  "Fully Decorated Stage",
  "Catering Space",
  "Professional Lighting Setup",
  "DJ Area",
  "Ample Parking Space",
  "Separate Bride & Groom Rooms",
  "Generator Backup",
  "800+ Guest Capacity",
];

const MarriageGardenSection = () => {
  return (
    <section id="wedding" className="relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${marriageGarden})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/80 to-foreground/60" />

      <div className="relative z-10 section-padding">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div>
                <p className="text-gold-light font-semibold text-sm tracking-widest uppercase mb-2">
                  Our Main Attraction
                </p>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground leading-tight">
                  Grand <span className="gold-text">Marriage Garden</span>
                </h2>
              </div>
              <p className="text-cream-dark/80 leading-relaxed text-base sm:text-lg">
                Host your dream wedding at Satna's most sought-after venue. Our spacious marriage garden 
                accommodates 800+ guests with world-class facilities, beautiful décor, and impeccable service.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-cream-dark/90">
                    <div className="w-5 h-5 rounded-full gold-gradient flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                    <span className="text-sm">{f}</span>
                  </div>
                ))}
              </div>

              <div className="bg-destructive/20 border border-destructive/30 rounded-lg p-3 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-gold-light shrink-0" />
                <p className="text-cream-dark text-sm font-medium">
                  Limited Wedding Dates Available for Upcoming Season!
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <a href="#booking">
                  <Button size="lg" className="gold-gradient text-primary-foreground font-semibold shadow-lg">
                    <CalendarCheck className="w-4 h-4 mr-2" /> Check Wedding Date
                  </Button>
                </a>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gold-light text-primary-foreground hover:bg-gold/20"
                  onClick={() => toast.info("Wedding brochure download will be available soon!")}
                >
                  <Download className="w-4 h-4 mr-2" /> Download Brochure
                </Button>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="relative rounded-xl overflow-hidden shadow-2xl border-2 border-gold/30">
                <img src={marriageGarden} alt="Hotel Omkar Marriage Garden" className="w-full h-[500px] object-cover" loading="lazy" />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-foreground/80 to-transparent p-6">
                  <p className="font-display text-2xl font-bold text-primary-foreground">Where Weddings Become</p>
                  <p className="gold-text font-display text-3xl font-bold">Grand Memories</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarriageGardenSection;
