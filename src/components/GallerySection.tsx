import { useState } from "react";
import heroWedding from "@/assets/hero-wedding.jpg";
import roomAc from "@/assets/room-ac.jpg";
import roomNonAc from "@/assets/room-nonac.jpg";
import marriageGarden from "@/assets/marriage-garden.jpg";
import banquetHall from "@/assets/banquet-hall.jpg";
import hotelExterior from "@/assets/hotel-exterior.jpg";

const categories = ["All", "Rooms", "Wedding Decor", "Banquet Hall", "Exterior"] as const;

const images = [
  { src: heroWedding, category: "Wedding Decor", alt: "Wedding decoration at Hotel Omkar" },
  { src: roomAc, category: "Rooms", alt: "AC Room" },
  { src: marriageGarden, category: "Wedding Decor", alt: "Marriage Garden stage" },
  { src: banquetHall, category: "Banquet Hall", alt: "Banquet Hall" },
  { src: roomNonAc, category: "Rooms", alt: "Non-AC Room" },
  { src: hotelExterior, category: "Exterior", alt: "Hotel Omkar Exterior" },
];

const GallerySection = () => {
  const [active, setActive] = useState<string>("All");

  const filtered = active === "All" ? images : images.filter((img) => img.category === active);

  return (
    <section id="gallery" className="section-padding bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10">
          <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-2">Gallery</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            A Glimpse of <span className="gold-text">Hotel Omkar</span>
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                active === cat
                  ? "gold-gradient text-primary-foreground shadow-md"
                  : "bg-card text-muted-foreground border border-border hover:border-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((img, i) => (
            <div
              key={`${img.alt}-${i}`}
              className="rounded-xl overflow-hidden shadow-lg hover-lift group cursor-pointer"
              style={{ animation: `fade-in 0.4s ease-out ${i * 0.1}s both` }}
            >
              <div className="relative overflow-hidden aspect-[4/3]">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
