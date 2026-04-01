import { useState } from "react";
import { CalendarDays, Users, Search, User, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const BookingBar = () => {
  const [activeTab, setActiveTab] = useState("room");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Room booking state
  const [roomName, setRoomName] = useState("");
  const [roomPhone, setRoomPhone] = useState("");
  const [roomEmail, setRoomEmail] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("");
  const [roomType, setRoomType] = useState("");

  // Event inquiry state
  const [eventName, setEventName] = useState("");
  const [eventPhone, setEventPhone] = useState("");
  const [eventEmail, setEventEmail] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [expectedGuests, setExpectedGuests] = useState("");
  const [eventType, setEventType] = useState("");

  const handleRoomBooking = async () => {
    if (!roomName || !roomPhone || !roomEmail || !checkIn || !checkOut || !guests || !roomType) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("room_bookings").insert({
        name: roomName,
        phone: roomPhone,
        email: roomEmail,
        check_in: checkIn,
        check_out: checkOut,
        guests: parseInt(guests),
        room_type: roomType,
      });

      if (error) throw error;

      toast.success("Room booking submitted! Our team will contact you shortly.");
      // Reset form
      setRoomName("");
      setRoomPhone("");
      setRoomEmail("");
      setCheckIn("");
      setCheckOut("");
      setGuests("");
      setRoomType("");
    } catch (error: any) {
      console.error("Booking error:", error);
      toast.error(error?.message || "Something went wrong. Please try again or call us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEventInquiry = async () => {
    if (!eventName || !eventPhone || !eventEmail || !eventDate || !expectedGuests || !eventType) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("event_inquiries").insert({
        name: eventName,
        phone: eventPhone,
        email: eventEmail,
        event_date: eventDate,
        expected_guests: parseInt(expectedGuests),
        event_type: eventType,
      });

      if (error) throw error;

      toast.success("Event inquiry submitted! Our team will contact you shortly.");
      // Reset form
      setEventName("");
      setEventPhone("");
      setEventEmail("");
      setEventDate("");
      setExpectedGuests("");
      setEventType("");
    } catch (error: any) {
      console.error("Inquiry error:", error);
      toast.error(error?.message || "Something went wrong. Please try again or call us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="booking" className="relative -mt-8 z-20 section-padding py-0 pb-12">
      <div className="container mx-auto max-w-5xl">
        <div className="bg-card rounded-xl shadow-2xl border border-border overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full rounded-none h-auto p-0 bg-muted">
              <TabsTrigger
                value="room"
                className="flex-1 rounded-none py-4 text-sm sm:text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                🏨 Room Booking
              </TabsTrigger>
              <TabsTrigger
                value="wedding"
                className="flex-1 rounded-none py-4 text-sm sm:text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                💒 Wedding Inquiry
              </TabsTrigger>
            </TabsList>

            <TabsContent value="room" className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <User className="w-3.5 h-3.5" /> Your Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Full name"
                    className="bg-background"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" /> Phone Number
                  </label>
                  <Input
                    type="tel"
                    placeholder="Phone number"
                    className="bg-background"
                    value={roomPhone}
                    onChange={(e) => setRoomPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" /> Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="Email address"
                    className="bg-background"
                    value={roomEmail}
                    onChange={(e) => setRoomEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <CalendarDays className="w-3.5 h-3.5" /> Check-in
                  </label>
                  <Input
                    type="date"
                    className="bg-background"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <CalendarDays className="w-3.5 h-3.5" /> Check-out
                  </label>
                  <Input
                    type="date"
                    className="bg-background"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> Guests
                  </label>
                  <Select value={guests} onValueChange={setGuests}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Guests" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <SelectItem key={n} value={String(n)}>{n} Guest{n > 1 ? "s" : ""}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground">Room Type</label>
                  <Select value={roomType} onValueChange={setRoomType}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ac">AC Room</SelectItem>
                      <SelectItem value="nonac">Non-AC Room</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  onClick={handleRoomBooking}
                  disabled={isSubmitting}
                  className="gold-gradient text-primary-foreground font-semibold h-10 px-8"
                >
                  <Search className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Submitting..." : "Book Now"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="wedding" className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <User className="w-3.5 h-3.5" /> Your Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Full name"
                    className="bg-background"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" /> Phone Number
                  </label>
                  <Input
                    type="tel"
                    placeholder="Phone number"
                    className="bg-background"
                    value={eventPhone}
                    onChange={(e) => setEventPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" /> Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="Email address"
                    className="bg-background"
                    value={eventEmail}
                    onChange={(e) => setEventEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <CalendarDays className="w-3.5 h-3.5" /> Event Date
                  </label>
                  <Input
                    type="date"
                    className="bg-background"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> Expected Guests
                  </label>
                  <Input
                    type="number"
                    placeholder="Expected guests"
                    className="bg-background"
                    value={expectedGuests}
                    onChange={(e) => setExpectedGuests(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground">Event Type</label>
                  <Select value={eventType} onValueChange={setEventType}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wedding">Wedding</SelectItem>
                      <SelectItem value="reception">Reception</SelectItem>
                      <SelectItem value="engagement">Engagement</SelectItem>
                      <SelectItem value="birthday">Birthday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  onClick={handleEventInquiry}
                  disabled={isSubmitting}
                  className="gold-gradient text-primary-foreground font-semibold h-10 px-8"
                >
                  <Search className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Submitting..." : "Submit Inquiry"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default BookingBar;
