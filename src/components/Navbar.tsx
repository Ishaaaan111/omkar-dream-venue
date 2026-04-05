import { useState, useEffect } from "react";
import { Menu, X, Phone, User, LogOut, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/admin/context/AuthContext";
import { Link } from "react-router-dom";

const Navbar = () => {

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Rooms", href: "#rooms" },
  { label: "Wedding", href: "#wedding" },
  { label: "Banquet", href: "#banquet" },
  { label: "Gallery", href: "#gallery" },
  { label: "Location", href: "#location" },
  { label: "Reviews", href: "#reviews" },
  { label: "Restaurant", href: "/restaurant" },
];

  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-card/95 backdrop-blur-md shadow-lg border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <a href="#home" className="flex items-center gap-2">
            <span className="font-display text-xl sm:text-2xl font-bold tracking-wide">
              <span className="gold-text">HOTEL</span>{" "}
              <span className={scrolled ? "text-foreground" : "text-primary-foreground"}>Omkar</span>
            </span>
          </a>

          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium tracking-wide transition-colors hover:text-primary ${
                  scrolled ? "text-foreground" : "text-primary-foreground"
                }`}
              >
                {link.label}
              </a>
            ))}
            <a href="tel:+919752233666">
              <Button size="sm" className="gold-gradient text-primary-foreground font-semibold shadow-md">
                <Phone className="w-4 h-4 mr-1" /> Call Now
              </Button>
            </a>

            {user ? (
              <div className="flex items-center gap-4 border-l border-border pl-6">
                <Link to="/my-bookings">
                  <Button variant="ghost" size="sm" className={scrolled ? "text-foreground" : "text-primary-foreground"}>
                    <Ticket className="w-4 h-4 mr-2" /> My Bookings
                  </Button>
                </Link>
                <div className="group relative">
                  <div className="w-10 h-10 rounded-full gold-gradient p-[2px] cursor-pointer">
                    <div className="w-full h-full rounded-full bg-card flex items-center justify-center text-primary font-bold text-sm">
                      {user.user_metadata?.display_name?.[0] || user.email?.[0]?.toUpperCase()}
                    </div>
                  </div>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 p-2 z-[60]">
                    <Link 
                      to="/my-bookings" 
                      className="flex items-center gap-3 px-4 py-2 text-sm font-bold text-foreground hover:bg-primary/10 rounded-xl transition-colors uppercase tracking-widest"
                    >
                      <User className="w-4 h-4" /> Profile
                    </Link>
                    <button 
                      onClick={() => signOut()}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-destructive hover:bg-destructive/10 rounded-xl transition-colors uppercase tracking-widest"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="border-l border-border pl-6">
                <Button size="sm" variant="outline" className={scrolled ? "border-primary text-primary" : "border-primary-foreground text-primary-foreground"}>
                  <User className="w-4 h-4 mr-1" /> Login
                </Button>
              </Link>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2 ${scrolled ? "text-foreground" : "text-primary-foreground"}`}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-card/95 backdrop-blur-md border-t border-border animate-fade-in">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block text-foreground font-medium py-2 hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a href="tel:+919752233666" className="block">
              <Button className="w-full gold-gradient text-primary-foreground font-semibold">
                <Phone className="w-4 h-4 mr-1" /> Call Now
              </Button>
            </a>

            {user ? (
              <div className="pt-2 space-y-2">
                <Link to="/my-bookings" onClick={() => setIsOpen(false)} className="block">
                  <Button variant="outline" className="w-full justify-start text-foreground">
                    <Ticket className="w-4 h-4 mr-2" /> My Bookings
                  </Button>
                </Link>
                <Button 
                  onClick={() => { signOut(); setIsOpen(false); }} 
                  variant="ghost" 
                  className="w-full justify-start text-destructive"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </Button>
              </div>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)} className="block">
                <Button className="w-full bg-slate-900 text-white hover:bg-slate-800">
                  <User className="w-4 h-4 mr-2" /> Login / Signup
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
