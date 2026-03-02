import { Award, MapPin, BedDouble, Heart } from "lucide-react";
import hotelExterior from "@/assets/hotel-exterior.jpg";

const features = [
  { icon: BedDouble, title: "45 Premium Rooms", desc: "Well-maintained AC & Non-AC rooms for every budget" },
  { icon: MapPin, title: "Prime Location", desc: "Just minutes from Satna Railway Station" },
  { icon: Heart, title: "Wedding Specialists", desc: "Sold-out every wedding season — book early!" },
  { icon: Award, title: "Affordable Luxury", desc: "Premium experience without the premium price" },
];

const AboutSection = () => {
  return (
    <section id="about" className="section-padding bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="relative">
            <div className="rounded-xl overflow-hidden shadow-2xl">
              <img src={hotelExterior} alt="Hotel Omkar Exterior" className="w-full h-[350px] sm:h-[450px] object-cover" loading="lazy" />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground rounded-lg p-4 shadow-xl hidden sm:block">
              <p className="font-display text-2xl font-bold">15+</p>
              <p className="text-sm">Years of Trust</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-2">About Us</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground leading-tight">
                Welcome to <span className="gold-text">Hotel Omkar</span>
              </h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Located in the heart of Satna, Madhya Pradesh, Hotel Omkar has been the city's most trusted destination for comfortable stays and grand celebrations. With 45 well-maintained rooms and a sprawling marriage garden, we offer an unmatched blend of affordability and luxury.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our proximity to Satna Railway Station makes us the first choice for outstation guests attending weddings. Every wedding season, our venue is almost fully booked — a testament to the trust families place in us.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {features.map((f, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover-lift">
                  <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center shrink-0">
                    <f.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">{f.title}</h4>
                    <p className="text-muted-foreground text-xs">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
