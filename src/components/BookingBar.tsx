import { useState } from "react";
import { CalendarDays, Users, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const BookingBar = () => {
  const [activeTab, setActiveTab] = useState("room");

  const handleCheckAvailability = () => {
    toast.success("We've received your inquiry! Our team will contact you shortly.");
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <CalendarDays className="w-3.5 h-3.5" /> Check-in
                  </label>
                  <Input type="date" className="bg-background" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <CalendarDays className="w-3.5 h-3.5" /> Check-out
                  </label>
                  <Input type="date" className="bg-background" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> Guests
                  </label>
                  <Select>
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
                  <Select>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ac">AC Room</SelectItem>
                      <SelectItem value="nonac">Non-AC Room</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleCheckAvailability} className="gold-gradient text-primary-foreground font-semibold h-10">
                  <Search className="w-4 h-4 mr-2" /> Check
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="wedding" className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <CalendarDays className="w-3.5 h-3.5" /> Event Date
                  </label>
                  <Input type="date" className="bg-background" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> Guests
                  </label>
                  <Input type="number" placeholder="Expected guests" className="bg-background" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground">Event Type</label>
                  <Select>
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
                <Button onClick={handleCheckAvailability} className="gold-gradient text-primary-foreground font-semibold h-10">
                  <Search className="w-4 h-4 mr-2" /> Check Date
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
