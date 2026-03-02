import { MapPin, Train, ShoppingBag } from "lucide-react";

const LocationSection = () => {
  return (
    <section id="location" className="section-padding bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10">
          <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-2">Location</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            <span className="gold-text">Prime Location</span> in Satna
          </h2>
          <p className="text-muted-foreground mt-3">Just Minutes Away from Satna Railway Station</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-xl overflow-hidden shadow-lg border border-border h-[350px] sm:h-[400px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3623.123456789!2d80.832!3d24.57!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSatna%20Railway%20Station!5e0!3m2!1sen!2sin!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Hotel Omkar Location"
            />
          </div>

          <div className="space-y-4">
            <div className="bg-card rounded-xl p-5 border border-border hover-lift">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Hotel Omkar</h4>
                  <p className="text-muted-foreground text-sm mt-1">Near Railway Station, Satna, Madhya Pradesh, India</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl p-5 border border-border hover-lift">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center shrink-0">
                  <Train className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Railway Station</h4>
                  <p className="text-muted-foreground text-sm mt-1">Walking distance — easy access for outstation wedding guests</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl p-5 border border-border hover-lift">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Nearby Market</h4>
                  <p className="text-muted-foreground text-sm mt-1">Close to Satna's main market for all your shopping needs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
