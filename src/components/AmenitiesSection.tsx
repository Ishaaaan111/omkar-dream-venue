import { Wifi, Tv, Shield, MapPin, ParkingSquare, MonitorPlay, PlugZap, Briefcase } from "lucide-react";

const amenities = [
  { icon: Wifi, label: "FIBRED UP" },
  { icon: PlugZap, label: "FULLY GENERATOR BACKUP" },
  { icon: MonitorPlay, label: "SMART TV & STREAMING" },
  { icon: Briefcase, label: "IN-SUITE WORK STATION" },
  { icon: MapPin, label: "LOCAL HOTSPOTS" },
  { icon: Shield, label: "24 HR SECURITY" },
  { icon: Tv, label: "LUXED-UP LIVING" },
  { icon: ParkingSquare, label: "FREE PARKING" },
  { icon: MapPin, label: "PERFECTLY LOCATED" },
];

const AmenitiesSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto max-w-6xl grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.3fr)] items-start">
        <div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            There are so many reasons why our guests love staying with us
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-md">
            Whether you&apos;re in town for business or leisure, our tailor-made services and
            impressive list of amenities will make your stay fun, stress-free, and unforgettable.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 text-sm">
          {amenities.map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-foreground">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-muted text-primary">
                <item.icon className="h-4 w-4" />
              </span>
              <span className="font-medium text-xs sm:text-sm tracking-wide">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AmenitiesSection;

