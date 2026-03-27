import { Phone, Mail, MapPin, Facebook, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="font-display text-2xl font-bold">
              <span className="gold-text">HOTEL</span> Omkar
            </h3>
            <p className="text-cream-dark/70 text-sm leading-relaxed">
              Satna's trusted destination for comfortable stays and grand weddings. Affordable luxury at its finest.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full gold-gradient flex items-center justify-center hover:opacity-80 transition-opacity">
                <Facebook className="w-4 h-4 text-primary-foreground" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full gold-gradient flex items-center justify-center hover:opacity-80 transition-opacity">
                <Instagram className="w-4 h-4 text-primary-foreground" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full gold-gradient flex items-center justify-center hover:opacity-80 transition-opacity">
                <Youtube className="w-4 h-4 text-primary-foreground" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display text-lg font-semibold mb-4 gold-text">Quick Links</h4>
            <ul className="space-y-2 text-sm text-cream-dark/70">
              {["Home", "Rooms", "Wedding Venue", "Banquet Hall", "Gallery", "Reviews"].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase().replace(" ", "-")}`} className="hover:text-gold transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg font-semibold mb-4 gold-text">Contact</h4>
            <ul className="space-y-3 text-sm text-cream-dark/70">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 text-gold shrink-0" />
                <div>
                  <a href="tel:+919752233666" className="hover:text-gold transition-colors">+91 97522 33666</a>
                  <br />
                  <a href="tel:+919425172797" className="hover:text-gold transition-colors">+91 94251 72797</a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 text-gold shrink-0" />
                <a href="mailto:trivediishan003@gmail.com" className="hover:text-gold transition-colors">trivediishan003@gmail.com</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-gold shrink-0" />
                <span>Near Railway Station, Satna, Madhya Pradesh, India</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg font-semibold mb-4 gold-text">SEO Keywords</h4>
            <div className="flex flex-wrap gap-1.5">
              {["Best Hotel in Satna", "Wedding Venue Satna", "Marriage Garden", "Budget Hotel", "Banquet Hall"].map((kw) => (
                <span key={kw} className="text-xs bg-cream-dark/10 text-cream-dark/60 rounded-full px-2.5 py-1">{kw}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-cream-dark/10 mt-10 pt-6 text-center">
          <p className="text-cream-dark/50 text-sm">
            © {new Date().getFullYear()} Hotel Omkar, Satna. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
