import { Wifi, Tv, ShowerHead, Clock, Wind, Fan, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import roomAc from "@/assets/room-ac.jpg";
import roomNonAc from "@/assets/room-nonac.jpg";

const acAmenities = [
  { icon: Wind, label: "Air Conditioning" },
  { icon: Wifi, label: "Free WiFi" },
  { icon: Tv, label: "LED TV" },
  { icon: ShowerHead, label: "Clean Washroom" },
  { icon: Clock, label: "24/7 Room Service" },
];

const nonAcAmenities = [
  { icon: Fan, label: "Ceiling Fan" },
  { icon: Wifi, label: "Free WiFi" },
  { icon: Tv, label: "LED TV" },
  { icon: ShowerHead, label: "Clean Washroom" },
  { icon: Clock, label: "24/7 Room Service" },
];

const RoomsSection = () => {
  return (
    <section id="rooms" className="section-padding bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-2">Our Rooms</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            Comfortable <span className="gold-text">Stays</span> for Every Budget
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Choose from 45 well-maintained rooms — all designed for your comfort.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {/* AC Room */}
          <div className="bg-card rounded-xl overflow-hidden shadow-lg border border-border hover-lift group">
            <div className="relative overflow-hidden">
              <img src={roomAc} alt="AC Room at Hotel Omkar" className="w-full h-56 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              <Badge className="absolute top-3 left-3 gold-gradient text-primary-foreground border-0">Popular</Badge>
              <Badge className="absolute top-3 right-3 bg-destructive text-destructive-foreground border-0 animate-pulse">Only 5 Left!</Badge>
            </div>
            <div className="p-5 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground">AC Deluxe Room</h3>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground line-through">₹2,499</p>
                  <p className="text-xl font-bold text-primary">₹1,999<span className="text-xs text-muted-foreground font-normal">/night</span></p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {acAmenities.map((a, i) => (
                  <span key={i} className="flex items-center gap-1 text-xs text-muted-foreground bg-muted rounded-full px-2.5 py-1">
                    <a.icon className="w-3 h-3" /> {a.label}
                  </span>
                ))}
              </div>
              <a href="#booking">
                <Button className="w-full gold-gradient text-primary-foreground font-semibold">Book Now</Button>
              </a>
            </div>
          </div>

          {/* Non-AC Room */}
          <div className="bg-card rounded-xl overflow-hidden shadow-lg border border-border hover-lift group">
            <div className="relative overflow-hidden">
              <img src={roomNonAc} alt="Non-AC Room at Hotel Omkar" className="w-full h-56 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground border-0">Budget Friendly</Badge>
              <Badge className="absolute top-3 right-3 bg-destructive text-destructive-foreground border-0 animate-pulse">Only 3 Left!</Badge>
            </div>
            <div className="p-5 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground">Non-AC Room</h3>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground line-through">₹1,799</p>
                  <p className="text-xl font-bold text-primary">₹1,299<span className="text-xs text-muted-foreground font-normal">/night</span></p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {nonAcAmenities.map((a, i) => (
                  <span key={i} className="flex items-center gap-1 text-xs text-muted-foreground bg-muted rounded-full px-2.5 py-1">
                    <a.icon className="w-3 h-3" /> {a.label}
                  </span>
                ))}
              </div>
              <a href="#booking">
                <Button className="w-full gold-gradient text-primary-foreground font-semibold">Book Now</Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoomsSection;
