import { Users, Snowflake, PartyPopper, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import banquetHall from "@/assets/banquet-hall.jpg";

const events = [
  { icon: PartyPopper, label: "Engagement" },
  { icon: Users, label: "Reception" },
  { icon: PartyPopper, label: "Birthday" },
  { icon: Briefcase, label: "Corporate Events" },
];

const BanquetSection = () => {
  return (
    <section id="banquet" className="section-padding bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="order-2 lg:order-1 rounded-xl overflow-hidden shadow-2xl">
            <img src={banquetHall} alt="Hotel Omkar Banquet Hall" className="w-full h-[350px] sm:h-[450px] object-cover" loading="lazy" />
          </div>

          <div className="order-1 lg:order-2 space-y-6">
            <div>
              <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-2">Indoor Events</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground leading-tight">
                Elegant <span className="gold-text">Banquet Hall</span>
              </h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Our fully air-conditioned banquet hall is perfect for indoor celebrations. From intimate engagement 
              ceremonies to grand receptions and corporate events, our hall provides a sophisticated setting.
            </p>

            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Snowflake className="w-5 h-5 text-primary" />
              <span className="text-foreground font-medium text-sm">Fully Air-Conditioned • Up to 300 Guests</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {events.map((e, i) => (
                <div key={i} className="flex items-center gap-2 p-3 bg-card rounded-lg border border-border hover-lift">
                  <e.icon className="w-5 h-5 text-primary" />
                  <span className="text-foreground text-sm font-medium">{e.label}</span>
                </div>
              ))}
            </div>

            <a href="#booking">
              <Button size="lg" className="gold-gradient text-primary-foreground font-semibold shadow-lg">
                Book Banquet Hall
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BanquetSection;
