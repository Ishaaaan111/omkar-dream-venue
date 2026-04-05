import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/admin/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Ticket, 
  Clock, 
  ChevronRight, 
  ArrowLeft, 
  Loader2, 
  Hotel, 
  PartyPopper,
  MapPin,
  Phone,
  CheckCircle2,
  Check,
  Building,
  Smartphone,
  QrCode,
  Gift,
  CreditCard
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import PaymentDialog from "@/components/booking/PaymentDialog";

interface Booking {
  id: string;
  created_at: string;
  check_in: string;
  check_out: string;
  room_type: string;
  status: string;
  guests: number;
  phone: string;
  email: string | null;
}

interface EventInquiry {
  id: string;
  created_at: string;
  event_date: string;
  event_type: string;
  expected_guests: number;
  status: string;
  phone: string;
  email: string | null;
}

const MyBookings = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [inquiries, setInquiries] = useState<EventInquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentState, setPaymentState] = useState<{
    open: boolean;
    amount: number;
    id: string;
    type: "Stay" | "Event";
  }>({
    open: false,
    amount: 0,
    id: "",
    type: "Stay"
  });

  // Grouped Data
  const now = new Date();
  const upcomingBookings = bookings.filter(b => b.check_out && new Date(b.check_out) >= now);
  const pastBookings = bookings.filter(b => b.check_out && new Date(b.check_out) < now);
  const upcomingInquiries = inquiries.filter(i => i.event_date && new Date(i.event_date) >= now);
  const pastInquiries = inquiries.filter(i => i.event_date && new Date(i.event_date) < now);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchMyBookings();
    }
  }, [user]);

  const fetchMyBookings = async () => {
    setIsLoading(true);
    try {
      // Fetch Room Bookings (cast to any to avoid deep type instantiation issue)
      const { data: bookingsData, error: bookingsError } = await (supabase
        .from("room_bookings")
        .select("*")
        .eq("user_id" as any, user?.id)
        .order("created_at", { ascending: false }) as any);

      if (bookingsError) console.error("Error fetching bookings:", bookingsError);
      else setBookings(bookingsData || []);

      // Fetch Event Inquiries
      const { data: inquiriesData, error: inquiriesError } = await (supabase
        .from("event_inquiries")
        .select("*")
        .eq("user_id" as any, user?.id)
        .order("created_at", { ascending: false }) as any);

      if (inquiriesError) console.error("Error fetching inquiries:", inquiriesError);
      else setInquiries(inquiriesData || []);

    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link to="/" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">My Bookings</h1>
                <p className="text-sm text-slate-500 font-medium">Manage your stays and inquiries</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {user?.user_metadata?.display_name?.[0] || user?.email?.[0]?.toUpperCase()}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-black uppercase tracking-widest text-slate-900">
                  {user?.user_metadata?.display_name || "Guest Account"}
                </p>
                <p className="text-[10px] font-medium text-slate-500">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="rooms" className="space-y-8">
          <TabsList className="bg-slate-200/50 p-1 rounded-2xl h-14 w-full sm:w-auto">
            <TabsTrigger value="rooms" className="rounded-xl px-8 h-12 text-xs font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Hotel className="w-4 h-4 mr-2" /> Stays
            </TabsTrigger>
            <TabsTrigger value="events" className="rounded-xl px-8 h-12 text-xs font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <PartyPopper className="w-4 h-4 mr-2" /> Events
            </TabsTrigger>
            <TabsTrigger value="history" className="rounded-xl px-8 h-12 text-xs font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Clock className="w-4 h-4 mr-2" /> History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rooms" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {upcomingBookings.length === 0 ? (
              <EmptyState 
                title="No Upcoming Stays" 
                description="Your upcoming room bookings will appear here once you've made a reservation."
                actionText="Explore Rooms"
                actionLink="/#rooms"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingBookings.map((booking) => (
                  <div key={booking.id} className={cn(booking.status?.toLowerCase() === "confirmed" && "col-span-full flex justify-center")}>
                    <BookingCard 
                      booking={booking} 
                      onPay={(amount) => setPaymentState({ open: true, amount, id: booking.id, type: "Stay" })}
                    />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="events" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {upcomingInquiries.length === 0 ? (
              <EmptyState 
                title="No Upcoming Events" 
                description="Thinking of celebrating? Your upcoming event inquiries will show up here."
                actionText="Enquire Now"
                actionLink="/#wedding"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingInquiries.map((inquiry) => (
                  <div key={inquiry.id} className={cn(inquiry.status?.toLowerCase() === "confirmed" && "col-span-full flex justify-center")}>
                    <InquiryCard 
                      inquiry={inquiry} 
                      onPay={() => setPaymentState({ open: true, amount: 5000, id: inquiry.id, type: "Event" })}
                    />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-12">
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center text-slate-500">
                    <Hotel className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Previous Stays</h3>
                </div>
                {pastBookings.length === 0 ? (
                  <div className="p-12 rounded-3xl border-2 border-dashed border-slate-200 bg-white/50 text-center">
                    <p className="text-slate-400 text-sm font-medium">No previous stays found.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pastBookings.map((booking) => (
                      <BookingCard key={booking.id} booking={booking} isHistory />
                    ))}
                  </div>
                )}
              </section>

              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center text-slate-500">
                    <PartyPopper className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Previous Events</h3>
                </div>
                {pastInquiries.length === 0 ? (
                  <div className="p-12 rounded-3xl border-2 border-dashed border-slate-200 bg-white/50 text-center">
                    <p className="text-slate-400 text-sm font-medium">No previous event inquiries found.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pastInquiries.map((inquiry) => (
                      <InquiryCard key={inquiry.id} inquiry={inquiry} isHistory />
                    ))}
                  </div>
                )}
              </section>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <PaymentDialog 
        open={paymentState.open} 
        onOpenChange={(open) => setPaymentState(prev => ({ ...prev, open }))}
        amount={paymentState.amount}
        bookingId={paymentState.id}
        type={paymentState.type}
      />
    </div>
  );
};

const BookingCard = ({ booking, isHistory, onPay }: { booking: Booking, isHistory?: boolean, onPay?: (amount: number) => void }) => {
  const isApproved = booking.status?.toLowerCase() === "confirmed";
  const nights = differenceInDays(new Date(booking.check_out), new Date(booking.check_in));
  const nightCount = Math.max(1, nights);
  const pricePerNight = booking.room_type === "ac" ? 1999 : 1299;
  const totalPrice = pricePerNight * nightCount;

  return (
    <div className={cn(
      "bg-white rounded-3xl border shadow-sm overflow-hidden group transition-all duration-500 w-full",
      isHistory ? "opacity-80 border-slate-200" : (isApproved ? "border-primary/40 shadow-2xl shadow-primary/20 ring-1 ring-primary/30 scale-[1.02] max-w-5xl mx-auto" : "border-slate-200 hover:shadow-xl hover:border-primary/20")
    )}>
      {isApproved && (
        <div className="gold-gradient p-6 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-10 transform translate-x-6 -translate-y-6">
            <Gift className="w-32 h-32" />
          </div>
          <div className="flex items-center justify-center gap-4">
            <span className="text-2xl animate-bounce">🎉</span>
            <h4 className="text-base font-black uppercase tracking-[0.3em] text-primary-foreground drop-shadow-md flex items-center gap-2">
              Booking Confirmed <CheckCircle2 className="w-5 h-5 text-white" />
            </h4>
            <span className="text-2xl animate-bounce">✅</span>
          </div>
        </div>
      )}

      <div className={cn("p-8 sm:p-12 text-left", isApproved && "bg-gradient-to-br from-white to-slate-50/50")}>
        <div className="flex justify-between items-start mb-10">
          <div className={cn(
            "flex items-center gap-3 px-6 py-2 rounded-full border text-xs font-black uppercase tracking-widest shadow-sm",
            isHistory 
              ? "bg-slate-50 text-slate-500 border-slate-100" 
              : (isApproved ? "bg-primary/10 text-primary border-primary/20" : "bg-emerald-50 text-emerald-700 border-emerald-100")
          )}>
            {!isHistory && !isApproved && <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>}
            {isHistory ? "Completed" : booking.status}
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-60">ID: {booking.id.toUpperCase()}</p>
        </div>

        <div className={cn("grid gap-12", isApproved ? "lg:grid-cols-2" : "grid-cols-1")}>
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl sm:text-4xl font-black text-slate-900 uppercase tracking-tight mb-4 leading-tight">
                {booking.room_type === "ac" ? "Super Deluxe AC Room" : "Standard Non-AC Room"}
              </h3>
              {isApproved && (
                <div className="flex items-baseline gap-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Stay</span>
                  <div className="text-3xl font-black text-primary flex items-center gap-2">
                    ₹{totalPrice.toLocaleString()}
                    <CreditCard className="w-6 h-6 opacity-40" />
                  </div>
                  <span className="text-xs text-slate-400 font-bold">/ {nightCount} Night{nightCount > 1 ? "s" : ""}</span>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 group-hover:border-primary/30 group-hover:text-primary transition-all duration-500">
                  <Calendar className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between max-w-md">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Check In Date</p>
                      <p className="text-lg font-black text-slate-800">{format(new Date(booking.check_in), "EEEE, MMM dd")}</p>
                    </div>
                    <div className="w-px h-10 bg-slate-100 mx-4" />
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Check Out Date</p>
                      <p className="text-lg font-black text-slate-800">{format(new Date(booking.check_out), "EEEE, MMM dd")}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-400">
                  <Clock className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Reservation for</p>
                  <p className="text-lg font-black text-slate-800">{booking.guests} Guest{booking.guests > 1 ? "s" : ""}</p>
                </div>
              </div>
            </div>
          </div>

          {isApproved && (
            <div className="space-y-8 pt-8 lg:pt-0 border-t lg:border-t-0 lg:border-l border-slate-100 lg:pl-12">
              <div className="grid sm:grid-cols-2 gap-8">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Customer Details</p>
                  <div className="flex items-center gap-3 text-sm font-black text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <Phone className="w-4 h-4 text-primary" /> {booking.phone}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 text-left">Hotel Location 📍</p>
                  <div className="flex items-start gap-3 text-sm font-black text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-tight text-left">
                    <MapPin className="w-5 h-5 text-primary shrink-0" />
                    <span>Near Railway Station, Satna,<br />Madhya Pradesh 🏨</span>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 pt-4">
                <Button 
                  onClick={() => onPay?.(totalPrice)}
                  className="w-full h-16 rounded-2xl gold-gradient text-white text-sm font-black uppercase tracking-[0.2em] gap-3 shadow-xl shadow-primary/30 hover:scale-[1.02] transition-transform active:scale-95"
                >
                  <CreditCard className="w-5 h-5" /> Pay Now
                </Button>
                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="w-full">
                  <Button variant="outline" className="w-full h-16 rounded-2xl border-2 text-xs font-black uppercase tracking-widest gap-2 hover:bg-slate-50 transition-colors">
                    <MapPin className="w-4 h-4" /> Get Directions
                  </Button>
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3 text-primary/60">
            <Building className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-widest">Hotel Omkar Signature Service</span>
          </div>
          <Button variant="ghost" size="sm" className="text-xs font-black uppercase tracking-widest group-hover:text-primary transition-colors">
            {isApproved ? "Digital Receipt" : "View Details"} <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const InquiryCard = ({ inquiry, isHistory, onPay }: { inquiry: EventInquiry, isHistory?: boolean, onPay?: () => void }) => {
  const isApproved = inquiry.status?.toLowerCase() === "confirmed";

  return (
    <div className={cn(
      "bg-white rounded-3xl border shadow-sm overflow-hidden group transition-all duration-500 w-full",
      isHistory ? "opacity-80 border-slate-200" : (isApproved ? "border-primary/40 shadow-2xl shadow-primary/20 ring-1 ring-primary/30 scale-[1.02] max-w-5xl mx-auto" : "border-slate-200 hover:shadow-xl hover:border-primary/20")
    )}>
      {isApproved && (
        <div className="gold-gradient p-6 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-10 transform translate-x-6 -translate-y-6">
            <PartyPopper className="w-32 h-32" />
          </div>
          <div className="flex items-center justify-center gap-4">
            <span className="text-2xl animate-bounce">🎊</span>
            <h4 className="text-base font-black uppercase tracking-[0.3em] text-primary-foreground drop-shadow-md flex items-center gap-2">
              Event Inquiry Approved <CheckCircle2 className="w-5 h-5 text-white" />
            </h4>
            <span className="text-2xl animate-bounce">✅</span>
          </div>
        </div>
      )}

      <div className={cn("p-8 sm:p-12 text-left", isApproved && "bg-gradient-to-br from-white to-amber-50/30")}>
        <div className="flex justify-between items-start mb-10">
          <div className={cn(
            "flex items-center gap-3 px-6 py-2 rounded-full border text-xs font-black uppercase tracking-widest shadow-sm",
            isHistory 
              ? "bg-slate-50 text-slate-500 border-slate-100" 
              : "bg-amber-50 text-amber-700 border-amber-100"
          )}>
            {!isHistory && !isApproved && <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>}
            {isHistory ? "Completed" : inquiry.status}
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-60">ID: {inquiry.id.toUpperCase()}</p>
        </div>

        <div className={cn("grid gap-12", isApproved ? "lg:grid-cols-2" : "grid-cols-1")}>
          <div className="space-y-8">
            <h3 className="text-2xl sm:text-4xl font-black text-slate-900 uppercase tracking-tight mb-4 leading-tight">
              {inquiry.event_type} Celebration 🎊
            </h3>

            <div className="space-y-6">
              <div className="flex items-center gap-6 text-left">
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-400">
                  <Calendar className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Event Date</p>
                  <p className="text-xl font-black text-slate-800 font-display">{format(new Date(inquiry.event_date), "EEEE, MMM dd, yyyy")}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-left">
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-400">
                  <Ticket className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Guests List</p>
                  <p className="text-xl font-black text-slate-800">{inquiry.expected_guests} Expected Guests</p>
                </div>
              </div>
            </div>
          </div>

          {isApproved && (
            <div className="space-y-8 pt-8 lg:pt-0 border-t lg:border-t-0 lg:border-l border-slate-100 lg:pl-12 font-body">
              <div className="grid sm:grid-cols-2 gap-8">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 text-left">Venue Location 📍</p>
                  <div className="flex items-start gap-3 text-sm font-black text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-tight text-left">
                    <MapPin className="w-5 h-5 text-primary shrink-0" />
                    <span>Marriage Garden & Banquet Hall<br />Hotel Omkar, Satna 🏨</span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 text-left">Need Assistance?</p>
                  <div className="flex items-center gap-3 text-sm font-black text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <Phone className="w-4 h-4 text-primary" /> +91 97522 33666
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  onClick={() => onPay?.()}
                  className="w-full h-16 rounded-2xl gold-gradient text-white text-sm font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/30 hover:scale-[1.02] transition-transform active:scale-95 text-center"
                >
                  Pay Reservation Deposit
                </Button>
                <p className="text-[10px] text-slate-400 mt-3 text-center font-bold">Please contact manager before making direct payments</p>
              </div>
            </div>
          )}
        </div>

        {!isApproved && (
          <div className="pt-10 mt-10 border-t border-slate-100">
            <Button className="w-full h-16 rounded-2xl gold-gradient text-white text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/30 hover:scale-[1.02] transition-transform">
              Call for Final Quote
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const EmptyState = ({ title, description, actionText, actionLink }: { title: string, description: string, actionText: string, actionLink: string }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6 border border-slate-100">
      <Hotel className="w-10 h-10 text-slate-300" />
    </div>
    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">{title}</h3>
    <p className="text-slate-500 max-w-sm mb-8">{description}</p>
    <a href={actionLink}>
      <Button className="gold-gradient text-white h-12 px-8 rounded-xl font-black uppercase tracking-widest">
        {actionText}
      </Button>
    </a>
  </div>
);

// Typescript helper
const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");

export default MyBookings;
