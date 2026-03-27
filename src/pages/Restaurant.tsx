import { Link } from "react-router-dom";

const Restaurant = () => {
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Blur */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center blur-[4px] scale-105"
        style={{ backgroundImage: `url('/public/restaurant-bg.jpg')` }}
      >
        <div className="absolute inset-0 bg-black/60" /> {/* Dark overlay for text readability */}
      </div>

      {/* Content */}
      <section className="relative z-10 w-full max-w-3xl px-6 py-16 text-center animate-fade-in text-white drop-shadow-md">
        <div className="space-y-6">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-wide text-white">
            Sakhi
          </h1>
          <p className="text-lg sm:text-xl text-white/90 tracking-[0.25em] uppercase">
            Opening Soon
          </p>

          <div className="flex justify-center">
            <span className="h-px w-24 sm:w-32 bg-gradient-to-r from-transparent via-gold to-transparent" />
          </div>

          <p className="text-sm sm:text-base text-white/80 max-w-xl mx-auto font-medium">
            A refined dining experience, thoughtfully crafted for guests of{" "}
            <span className="font-semibold text-white">HOTEL Omkar</span>. Stay tuned for an elegant new chapter in
            Satna&apos;s culinary scene.
          </p>

          <div className="pt-4">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-2.5 text-sm sm:text-base font-medium text-white bg-black/40 hover:bg-gold/90 hover:text-white backdrop-blur-md transition-colors duration-300 shadow-sm"
            >
              Back to HOTEL Omkar
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Restaurant;
