import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  CalendarDays,
  CheckCircle2,
  XCircle,
  Loader2,
  User,
  Phone,
  Users,
  Search,
  Filter,
  PartyPopper,
  Clock,
  RefreshCw
} from "lucide-react";

interface EventInquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  event_date: string;
  expected_guests: number;
  event_type: string;
  status: string;
  created_at: string;
}

const tabs = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "rejected", label: "Rejected" },
  { value: "all", label: "All" },
];

const AdminEvents = () => {
  const [inquiries, setInquiries] = useState<EventInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [search, setSearch] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchInquiries = async () => {
    setLoading(true);
    let query = supabase
      .from("event_inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (activeTab !== "all") {
      query = query.eq("status", activeTab);
    }

    const { data, error } = await query;
    if (error) {
      toast.error("Failed to fetch event inquiries");
      console.error(error);
    } else {
      setInquiries((data as EventInquiry[]) ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInquiries();
  }, [activeTab]);

  const handleAction = async (id: string, status: "confirmed" | "rejected") => {
    setProcessingId(id);
    try {
      const { error } = await supabase
        .from("event_inquiries")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      if (status === "confirmed") {
        const inquiry = inquiries.find(i => i.id === id);
        if (inquiry) {
          // Trigger Supabase Edge Function
          const { data: emailData, error: emailError } = await supabase.functions.invoke("send-confirmation", {
            body: {
              type: "event_inquiry",
              id: inquiry.id,
              name: inquiry.name,
              email: inquiry.email,
              details: {
                event_type: inquiry.event_type,
                event_date: inquiry.event_date,
                expected_guests: inquiry.expected_guests
              }
            }
          });
          
          if (emailError) {
            console.error("Email error:", emailError);
            toast.error(`Email failed: ${emailError.message || "Unknown error"}`);
          } else {
            console.log("Email sent successfully:", emailData);
          }
        }
      }

      toast.success(
        status === "confirmed"
          ? "✅ Inquiry confirmed successfully!"
          : "❌ Inquiry rejected"
      );

      // Refresh data
      fetchInquiries();
    } catch (error: any) {
      toast.error(error.message || "Action failed");
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusStyle = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
      confirmed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
      rejected: "bg-red-500/15 text-red-400 border-red-500/20",
    };
    return styles[status] ?? "bg-slate-500/15 text-slate-400 border-slate-500/20";
  };

  const filteredInquiries = inquiries.filter(
    (i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.phone.includes(search) ||
      i.event_type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* Filters Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-slate-900/80 rounded-lg p-1 border border-slate-800/50">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.value
                  ? "bg-amber-500/15 text-amber-400 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search inquiries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-slate-900/80 border border-slate-800/50 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/40 transition-all"
            />
          </div>
          <button
            onClick={fetchInquiries}
            className="h-10 px-3 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors border border-slate-700/50"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Grid of Cards */}
      {loading && inquiries.length === 0 ? (
        <div className="flex items-center justify-center h-[40vh]">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        </div>
      ) : filteredInquiries.length === 0 ? (
        <div className="bg-slate-900/80 rounded-xl border border-slate-800/50 p-16 text-center shadow-xl">
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4 border border-slate-700/50 text-slate-500">
            <PartyPopper className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">No inquiries found</h3>
          <p className="text-sm text-slate-500">
            {search ? "Try searching for something else." : `No ${activeTab} enquiries yet.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {filteredInquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              className="bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-800/50 p-5 hover:border-slate-700/50 transition-all duration-300 group shadow-lg"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                  {/* Guest Info */}
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-0.5 font-bold">Guest Name</p>
                      <p className="text-sm font-semibold text-white">{inquiry.name}</p>
                    </div>
                  </div>

                  {/* Event Type */}
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <PartyPopper className="w-4 h-4 text-violet-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-0.5 font-bold">Event Type</p>
                      <p className="text-sm font-semibold text-white capitalize">{inquiry.event_type}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Phone className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-0.5 font-bold">Contact</p>
                      <p className="text-sm font-semibold text-white">{inquiry.phone}</p>
                      <p className="text-xs text-slate-400">{inquiry.email}</p>
                    </div>
                  </div>

                  {/* Date & Guests */}
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CalendarDays className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="flex gap-4">
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-0.5 font-bold">Event Date</p>
                        <p className="text-sm font-semibold text-white">{inquiry.event_date}</p>
                      </div>
                      <div className="border-l border-slate-800 pl-4">
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-0.5 font-bold">Guests</p>
                        <div className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-slate-500" />
                          <p className="text-sm font-semibold text-white">{inquiry.expected_guests}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Column */}
                <div className="flex flex-col items-end gap-3 sm:flex-shrink-0">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusStyle(inquiry.status)}`}>
                    {inquiry.status}
                  </span>
                  
                  {inquiry.status === "pending" && (
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => handleAction(inquiry.id, "confirmed")}
                        disabled={processingId === inquiry.id}
                        className="flex-1 sm:flex-none h-9 px-4 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-lg shadow-emerald-600/20"
                      >
                        {processingId === inquiry.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        )}
                        Confirm
                      </button>
                      <button
                        onClick={() => handleAction(inquiry.id, "rejected")}
                        disabled={processingId === inquiry.id}
                        className="flex-shrink-0 w-9 h-9 rounded-lg bg-slate-800 text-red-500 border border-red-500/20 hover:bg-red-600 hover:text-white flex items-center justify-center transition-all"
                        title="Reject"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer info */}
              <div className="mt-4 pt-3 border-t border-slate-800/30 flex items-center justify-between">
                <p className="text-[10px] text-slate-500 italic">
                  Received {new Date(inquiry.created_at).toLocaleString()}
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-600 font-medium">
                  <Clock className="w-3 h-3" />
                  ID: {inquiry.id.split('-')[0]}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminEvents;
