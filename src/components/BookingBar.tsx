import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/admin/context/AuthContext";
import { 
  CalendarDays, 
  Users, 
  Search, 
  User, 
  Phone, 
  Mail, 
  Star, 
  ShieldCheck, 
  Undo2, 
  ChevronRight,
  Wifi,
  Wind,
  Tv,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { BookingDateRange } from "./booking/BookingDateRange";
import { GuestSelector } from "./booking/GuestSelector";
import { DateRange } from "react-day-picker";
import { differenceInDays, format } from "date-fns";
import roomAc from "@/assets/room-ac.jpg";
import roomNonAc from "@/assets/room-nonac.jpg";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

const ROOM_PRICES = {
  ac: 1999,
  nonac: 1299
};

const BookingBar = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("room");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  // Step 1: Search state
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: undefined,
  });
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [roomsCount, setRoomsCount] = useState(1);
  const [roomType, setRoomType] = useState("ac");

  // Step 2: Details state
  const [personalDetails, setPersonalDetails] = useState({
    name: "",
    phone: "",
    email: ""
  });

  const nights = useMemo(() => {
    if (date?.from && date?.to) {
      return differenceInDays(date.to, date.from);
    }
    return 0;
  }, [date]);

  const totalPrice = useMemo(() => {
    const nightCount = Math.max(1, nights);
    const pricePerNight = roomType === "ac" ? ROOM_PRICES.ac : ROOM_PRICES.nonac;
    return pricePerNight * nightCount * roomsCount;
  }, [nights, roomType, roomsCount]);

  useEffect(() => {
    if (user && !personalDetails.name) {
      setPersonalDetails({
        name: user.user_metadata?.display_name || "",
        email: user.email || "",
        phone: ""
      });
    }
  }, [user]);

  const handleNextStep = () => {
    if (activeTab === "room") {
      if (!date?.from || !date?.to) {
        toast.error("Please pick check-in & check-out dates");
        return;
      }
      if (nights < 1) {
        toast.error("Check-out must be after check-in");
        return;
      }
    } else if (activeTab === "wedding") {
      if (!eventData.date || !eventData.type) {
        toast.error("Please select event type and date");
        return;
      }
    }
    setStep(2);
  };

  const handleBookNow = async () => {
    if (!personalDetails.name || !personalDetails.phone || !personalDetails.email) {
      toast.error("Please fill in your details");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("room_bookings").insert({
        name: personalDetails.name,
        phone: personalDetails.phone,
        email: personalDetails.email,
        check_in: date?.from?.toISOString(),
        check_out: date?.to?.toISOString(),
        guests: adults + children,
        room_type: roomType,
        user_id: user?.id,
      });

      if (error) throw error;

      toast.success("Booking Request Sent! We will contact you shortly.");
      setStep(1); // Reset
      setPersonalDetails({ name: "", phone: "", email: "" });
    } catch (error: any) {
      toast.error(error.message || "Booking failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Event Inquiry State (Traditional flow or simplified)
  const [eventData, setEventData] = useState({
    name: "", phone: "", email: "", date: "", guests: "", type: ""
  });

  const handleEventInquiry = async () => {
    if (!eventData.name || !eventData.phone || !eventData.date) {
      toast.error("Please fill in key details");
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("event_inquiries").insert({
        name: eventData.name,
        phone: eventData.phone,
        email: eventData.email,
        event_date: eventData.date,
        expected_guests: parseInt(eventData.guests) || 0,
        event_type: eventData.type,
        user_id: user?.id,
      });
      if (error) throw error;
      toast.success("Inquiry Sent!");
      setEventData({ name: "", phone: "", email: "", date: "", guests: "", type: "" });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="booking" className="relative -mt-16 sm:-mt-24 z-30 px-4 pb-20">
      <div className="container mx-auto max-w-6xl">
        {/* Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card/50 backdrop-blur-md border border-border text-foreground text-[10px] sm:text-xs font-bold uppercase tracking-widest leading-none shadow-sm">
            <Star className="w-3 h-3 text-primary fill-primary" />
            <span>4.8 Rating</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card/50 backdrop-blur-md border border-border text-foreground text-[10px] sm:text-xs font-bold uppercase tracking-widest leading-none shadow-sm">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>1,000+ Guests Served</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card/50 backdrop-blur-md border border-border text-foreground text-[10px] sm:text-xs font-bold uppercase tracking-widest leading-none shadow-sm">
            <ShieldCheck className="w-3 h-3 text-sky-600" />
            <span>Free Cancellation</span>
          </div>
        </div>

        <div className="bg-card/90 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-border overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full h-auto p-2 bg-muted/30 justify-start border-b border-border rounded-none flex-wrap">
              <TabsTrigger
                value="room"
                className="rounded-full px-6 py-2.5 text-xs font-bold tracking-widest uppercase data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
              >
                🏨 Stay Booking
              </TabsTrigger>
              <TabsTrigger
                value="wedding"
                className="rounded-full px-6 py-2.5 text-xs font-bold tracking-widest uppercase data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
              >
                🎊 Event Inquiry
              </TabsTrigger>
            </TabsList>

            {/* Room Booking Tab */}
            <TabsContent value="room" className="p-6 md:p-10">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Left: Input Selection */}
                <div className="flex-1 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Date Picker */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Stay Duration</label>
                      <BookingDateRange date={date} setDate={setDate} />
                    </div>

                    {/* Guest Selector */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Passengers & Rooms</label>
                      <GuestSelector 
                        adults={adults} setAdults={setAdults} 
                        children={children} setChildren={setChildren} 
                        rooms={roomsCount} setRooms={setRoomsCount} 
                      />
                    </div>
                  </div>

                  {/* Room Type Visual Selection */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Selection Room Category</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {["ac", "nonac"].map((type) => (
                        <button
                          key={type}
                          onClick={() => setRoomType(type)}
                          className={cn(
                            "relative flex flex-col items-start p-5 rounded-[1.5rem] border bg-background transition-all duration-300 group overflow-hidden",
                            roomType === type ? "border-primary ring-2 ring-primary/20 bg-primary/5 shadow-lg" : "border-border hover:border-border/80"
                          )}
                        >
                          {/* Image Preview */}
                          <div className="w-full h-24 rounded-xl overflow-hidden mb-4 border border-border/50">
                            <img 
                              src={type === "ac" ? roomAc : roomNonAc} 
                              alt={type === "ac" ? "AC Room" : "Non-AC Room"} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                          
                          <div className="flex items-center justify-between w-full mb-2">
                            <span className={cn(
                              "text-xs font-black uppercase tracking-widest",
                              roomType === type ? "text-primary" : "text-muted-foreground"
                            )}>
                              {type === "ac" ? "Super Deluxe AC" : "Standard Non-AC"}
                            </span>
                            <div className={cn(
                              "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                              roomType === type ? "border-primary bg-primary" : "border-border"
                            )}>
                              {roomType === type && <CheckCircle2 className="w-3.5 h-3.5 text-primary-foreground" />}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-muted-foreground mb-4">
                            <div className="flex items-center gap-1.5"><Wifi className="w-3.5 h-3.5" /><span className="text-[10px] font-bold">WiFi</span></div>
                            <div className="flex items-center gap-1.5"><Tv className="w-3.5 h-3.5" /><span className="text-[10px] font-bold">TV</span></div>
                            {type === "ac" && <div className="flex items-center gap-1.5"><Wind className="w-3.5 h-3.5" /><span className="text-[10px] font-bold">AC</span></div>}
                          </div>

                          <div className="flex items-end gap-1.5">
                            <span className="text-xl font-black text-foreground">₹{type === "ac" ? ROOM_PRICES.ac : ROOM_PRICES.nonac}</span>
                            <span className="text-[10px] font-bold text-muted-foreground pb-1 uppercase tracking-wider">/ Night</span>
                          </div>

                          {/* Decorative blur */}
                          <div className={cn(
                            "absolute -bottom-10 -right-10 w-24 h-24 blur-[60px] transition-opacity duration-300",
                            roomType === type ? "bg-amber-500/30 opacity-100" : "bg-white/10 opacity-0"
                          )}></div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Price Summary & CTA */}
                <div className="w-full lg:w-80 lg:border-l lg:border-border lg:pl-8 flex flex-col">
                  <div className="flex-1 bg-muted/30 rounded-3xl p-6 border border-border mb-6">
                    <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">Price Breakdown</h4>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs font-bold text-foreground uppercase tracking-wider">{roomType === "ac" ? "Super Deluxe AC" : "Standard Non-AC"}</p>
                          <p className="text-[10px] text-muted-foreground font-medium">₹{roomType === "ac" ? ROOM_PRICES.ac : ROOM_PRICES.nonac} x {Math.max(1, nights)} Night{nights !== 1 ? "s" : ""}</p>
                          {roomsCount > 1 && <p className="text-[10px] text-muted-foreground font-medium">For {roomsCount} Room{roomsCount > 1 ? "s" : ""}</p>}
                        </div>
                        <span className="text-sm font-black text-foreground">₹{totalPrice.toLocaleString()}</span>
                      </div>

                      <div className="pt-4 border-t border-border">
                        <div className="flex justify-between items-center text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                          <span>Total Charges</span>
                          <span className="text-foreground">₹{totalPrice.toLocaleString()}</span>
                        </div>
                        <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-widest">Inclusive of WiFi & Service</p>
                      </div>
                    </div>

                    <div className="mt-10 p-4 rounded-2xl bg-primary/10 border border-primary/20 text-center">
                      <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Payable Total</p>
                      <p className="text-3xl font-black text-foreground tracking-tighter">₹{totalPrice.toLocaleString()}</p>
                    </div>
                  </div>

                  <Button
                    onClick={handleNextStep}
                    className="w-full h-16 rounded-[1.25rem] gold-gradient text-primary-foreground font-black uppercase tracking-[0.15em] text-sm shadow-xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
                  >
                    Check Availability
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Wedding Tab */}
            <TabsContent value="wedding" className="p-6 md:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Event Type</label>
                  <Select value={eventData.type} onValueChange={(v) => setEventData({...eventData, type: v})}>
                    <SelectTrigger className="h-12 bg-background border-border text-foreground rounded-xl">
                      <SelectValue placeholder="Select Occasion" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border text-popover-foreground">
                      <SelectItem value="wedding">💍 Wedding</SelectItem>
                      <SelectItem value="reception">🥂 Reception</SelectItem>
                      <SelectItem value="engagement">💎 Engagement</SelectItem>
                      <SelectItem value="birthday">🎂 Birthday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Event Date</label>
                  <Input
                    type="date"
                    className="h-12 bg-background border-border text-foreground rounded-xl"
                    value={eventData.date}
                    onChange={(e) => setEventData({...eventData, date: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Estimated Guests</label>
                  <Input
                    type="number"
                    placeholder="e.g. 500"
                    className="h-12 bg-background border-border text-foreground rounded-xl"
                    value={eventData.guests}
                    onChange={(e) => setEventData({...eventData, guests: e.target.value})}
                  />
                </div>

                <Button
                  onClick={handleNextStep} // Reuse the multi-step logic for details
                  className="w-full h-12 rounded-xl bg-amber-500 text-slate-950 font-black uppercase tracking-widest text-xs hover:bg-amber-600 shadow-lg shadow-amber-500/10"
                >
                  Request Proposal
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* STEP 2 MODAL: Personal Details */}
      <Dialog open={step === 2} onOpenChange={(open) => !open && setStep(1)}>
        <DialogContent className="sm:max-w-[425px] bg-card/95 backdrop-blur-2xl border-border p-8 rounded-[2.5rem] shadow-2xl">
          <DialogHeader>
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 border border-primary/20">
              <User className="w-6 h-6" />
            </div>
            <DialogTitle className="text-2xl font-black text-foreground tracking-tight">One Last Step!</DialogTitle>
            <DialogDescription className="text-muted-foreground font-medium">
              We just need your contact details to check availability and block your selection.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-5 py-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Guest Name</label>
              <div className="relative">
                <Input
                  className="h-12 bg-background border-border text-foreground pl-10 rounded-xl"
                  placeholder="Full Name"
                  value={personalDetails.name}
                  onChange={(e) => setPersonalDetails({...personalDetails, name: e.target.value})}
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Phone Number</label>
              <div className="relative">
                <Input
                  className="h-12 bg-background border-border text-foreground pl-10 rounded-xl"
                  placeholder="+91-0000000000"
                  type="tel"
                  value={personalDetails.phone}
                  onChange={(e) => setPersonalDetails({...personalDetails, phone: e.target.value})}
                />
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Input
                  className="h-12 bg-background border-border text-foreground pl-10 rounded-xl"
                  placeholder="email@example.com"
                  type="email"
                  value={personalDetails.email}
                  onChange={(e) => setPersonalDetails({...personalDetails, email: e.target.value})}
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          <DialogFooter className="sm:justify-start gap-3 mt-4">
            <Button
              className="flex-1 h-14 rounded-2xl gold-gradient text-primary-foreground font-black uppercase tracking-widest hover:opacity-90 disabled:opacity-50 shadow-xl shadow-primary/20"
              onClick={activeTab === "room" ? handleBookNow : handleEventInquiry}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto text-primary-foreground" />
              ) : (
                activeTab === "room" ? "Confirm Booking" : "Send Inquiry"
              )}
            </Button>
            <Button
              variant="ghost"
              className="px-4 text-muted-foreground hover:text-foreground"
              onClick={() => setStep(1)}
              disabled={isSubmitting}
            >
              <Undo2 className="w-5 h-5" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

// Typescript helper
const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");

export default BookingBar;
