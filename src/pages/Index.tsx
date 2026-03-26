import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import BookingBar from "@/components/BookingBar";
import AboutSection from "@/components/AboutSection";
import RoomsSection from "@/components/RoomsSection";
import AmenitiesSection from "@/components/AmenitiesSection";
import MarriageGardenSection from "@/components/MarriageGardenSection";
import BanquetSection from "@/components/BanquetSection";
import GallerySection from "@/components/GallerySection";
import LocationSection from "@/components/LocationSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <BookingBar />
      <AboutSection />
      <RoomsSection />
      <AmenitiesSection />
      <MarriageGardenSection />
      <BanquetSection />
      <GallerySection />
      <LocationSection />
      <TestimonialsSection />
      <Footer />
      <WhatsAppButton />
    </main>
  );
};

export default Index;
