import { Link } from "react-router-dom";

const Restaurant = () => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-cream-dark/60 bg-gradient-to-b from-background via-cream-dark/40 to-background">
      <section className="w-full max-w-3xl px-6 py-16 text-center animate-fade-in">
        <div className="space-y-6">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-wide text-foreground">
            Sakhi
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground tracking-[0.25em] uppercase">
            Opening Soon
          </p>

          <div className="flex justify-center">
            <span className="h-px w-24 sm:w-32 bg-gradient-to-r from-transparent via-gold to-transparent" />
          </div>

          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            A refined dining experience, thoughtfully crafted for guests of{" "}
            <span className="font-semibold">HOTEL Omkar</span>. Stay tuned for an elegant new chapter in
            Satna&apos;s culinary scene.
          </p>

          <div className="pt-4">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-full border border-gold-light px-6 py-2.5 text-sm sm:text-base font-medium text-foreground bg-cream-light/60 hover:bg-gold/90 hover:text-primary-foreground transition-colors duration-300 shadow-sm"
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

