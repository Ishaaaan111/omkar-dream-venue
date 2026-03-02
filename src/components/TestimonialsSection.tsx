import { Star } from "lucide-react";

const reviews = [
  {
    name: "Rajesh Sharma",
    event: "Wedding",
    text: "We had our daughter's wedding at Hotel Omkar. The marriage garden was beautifully decorated and the staff was extremely cooperative. Best venue in Satna!",
    rating: 5,
  },
  {
    name: "Priya Gupta",
    event: "Room Stay",
    text: "Very clean and comfortable rooms. The proximity to the railway station was a huge plus for our family members coming from out of town. Highly recommended!",
    rating: 5,
  },
  {
    name: "Anil Tiwari",
    event: "Reception",
    text: "We hosted our son's reception in the banquet hall. The AC hall was perfect for our 250 guests. The food arrangements and service were top-notch. Great value for money!",
    rating: 5,
  },
  {
    name: "Sunita Patel",
    event: "Room Stay",
    text: "Budget-friendly hotel with premium facilities. The rooms are well-maintained and the staff is very helpful. Best hotel in Satna for the price.",
    rating: 4,
  },
];

const TestimonialsSection = () => {
  return (
    <section id="reviews" className="section-padding bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10">
          <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-2">Testimonials</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            What Our <span className="gold-text">Guests Say</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {reviews.map((review, i) => (
            <div
              key={i}
              className="bg-card rounded-xl p-5 border border-border hover-lift"
              style={{ animation: `fade-in 0.5s ease-out ${i * 0.1}s both` }}
            >
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className={`w-4 h-4 ${j < review.rating ? "text-primary fill-primary" : "text-border"}`}
                  />
                ))}
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">"{review.text}"</p>
              <div className="border-t border-border pt-3">
                <p className="font-semibold text-foreground text-sm">{review.name}</p>
                <p className="text-muted-foreground text-xs">{review.event}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
