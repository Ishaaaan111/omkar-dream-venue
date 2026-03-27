import { Phone, MessageCircle, ChevronDown, MapPin, Star, BedDouble, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-wedding.jpg";

const trustBadges = [
  { icon: BedDouble, label: "45 Premium Rooms" },
  { icon: Star, label: "AC & Non-AC Available" },
  { icon: Building2, label: "Marriage Garden + Banquet" },
  { icon: MapPin, label: "Near Railway Station" },
];

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/50 to-foreground/80" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
          <p className="text-gold-light font-body text-sm sm:text-base tracking-[0.3em] uppercase">
            Satna's Trusted Wedding Destination
          </p>
          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-primary-foreground leading-tight text-balance">
            Hassle-Free Weddings &<br />
            <span className="gold-text">Comfortable Stay</span> in Satna
          </h1>
          <p className="text-cream-dark text-base sm:text-lg lg:text-xl max-w-2xl mx-auto font-light">
            Just Minutes Away from Satna Railway Station — Where Weddings Become Grand Memories
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-4">
            <a href="#rooms">
              <Button size="lg" className="gold-gradient text-primary-foreground font-semibold shadow-lg text-sm sm:text-base px-6 sm:px-8">
                Book Room
              </Button>
            </a>
            <a href="#wedding">
              <Button size="lg" variant="outline" className="border-gold-light text-primary-foreground hover:bg-gold/20 font-semibold text-sm sm:text-base px-6 sm:px-8">
                Book Wedding Venue
              </Button>
            </a>
            <a href="tel:+919752233666">
              <Button size="lg" variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10 text-sm sm:text-base">
                <Phone className="w-4 h-4 mr-2" /> Call Now
              </Button>
            </a>
            <a
              href="https://wa.me/919752233666?text=Hello%2C%20I%20want%20to%20inquire%20about%20Hotel%20Omkar"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10 text-sm sm:text-base">
                <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp
              </Button>
            </a>
          </div>
        </div>

        <div className="mt-12 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
          {trustBadges.map((badge, i) => (
            <div
              key={i}
              className="glass-card rounded-lg p-3 sm:p-4 text-center bg-foreground/20 backdrop-blur-sm border border-primary-foreground/10"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <badge.icon className="w-5 h-5 sm:w-6 sm:h-6 text-gold-light mx-auto mb-1.5" />
              <p className="text-primary-foreground text-xs sm:text-sm font-medium">{badge.label}</p>
            </div>
          ))}
        </div>

        <a href="#booking" className="inline-block mt-10 sm:mt-14 animate-float">
          <ChevronDown className="w-8 h-8 text-gold-light" />
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
