import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  User,
  Phone,
  CalendarDays,
  BedDouble,
  RefreshCw,
  Mail,
} from "lucide-react";

interface PendingRequest {
  id: string;
  name: string;
  phone: string;
  email: string;
  room_type: string;
  check_in: string;
  check_out: string;
  guests: number;
  status: string;
  created_at: string;
}

const AdminPendingRequests = () => {
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchPending = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("room_bookings")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch pending requests");
      console.error(error);
    } else {
      setRequests((data as PendingRequest[]) ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleAction = async (id: string, status: "confirmed" | "rejected") => {
    setProcessingId(id);
    try {
      const { error } = await supabase
        .from("room_bookings")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      if (status === "confirmed") {
        const request = requests.find(r => r.id === id);
        if (request) {
          // Trigger Supabase Edge Function
          const { error: emailError } = await supabase.functions.invoke("send-confirmation", {
            body: {
              type: "room_booking",
              id: request.id,
              name: request.name,
              email: request.email,
              details: {
                room_type: request.room_type,
                check_in: request.check_in,
                check_out: request.check_out,
                guests: request.guests
              }
            }
          });
          if (emailError) console.error("Email error:", emailError);
        }
      }

      toast.success(
        status === "confirmed"
          ? "✅ Booking approved successfully!"
          : "❌ Booking rejected"
      );

      // Remove from pending list with animation
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (error: any) {
      toast.error(error.message || "Action failed");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-yellow-500/10 text-yellow-400 px-3 py-1.5 rounded-full border border-yellow-500/20">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-sm font-medium">{requests.length} pending</span>
          </div>
        </div>
        <button
          onClick={fetchPending}
          className="h-9 px-3 rounded-lg bg-slate-800 text-slate-300 text-sm font-medium flex items-center gap-2 hover:bg-slate-700 transition-colors border border-slate-700/50"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Empty State */}
      {requests.length === 0 ? (
        <div className="bg-slate-900/80 rounded-xl border border-slate-800/50 p-16 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">All caught up!</h3>
          <p className="text-sm text-slate-500">No pending booking requests at the moment.</p>
        </div>
      ) : (
        /* Request Cards */
        <div className="grid gap-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-800/50 p-5 hover:border-slate-700/50 transition-all duration-300 group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Info */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Guest Name</p>
                      <p className="text-sm font-semibold text-white">{req.name}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <BedDouble className="w-4 h-4 text-violet-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Room Type</p>
                      <p className="text-sm font-semibold text-white capitalize">{req.room_type}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CalendarDays className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Dates</p>
                      <p className="text-sm font-medium text-white">{req.check_in}</p>
                      <p className="text-xs text-slate-500">to {req.check_out}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Phone className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Contact</p>
                      <p className="text-sm font-semibold text-white">{req.phone}</p>
                      <p className="text-xs text-slate-400 truncate max-w-[150px]">{req.email}</p>
                      <p className="text-xs text-slate-500">{req.guests} guest{req.guests > 1 ? "s" : ""}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 lg:flex-shrink-0 lg:ml-4">
                  <button
                    onClick={() => handleAction(req.id, "confirmed")}
                    disabled={processingId === req.id}
                    className="flex-1 lg:flex-none h-10 px-5 rounded-lg bg-emerald-600 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-lg shadow-emerald-600/20"
                  >
                    {processingId === req.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(req.id, "rejected")}
                    disabled={processingId === req.id}
                    className="flex-1 lg:flex-none h-10 px-5 rounded-lg bg-slate-800 text-red-400 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white border border-red-500/20 disabled:opacity-50 transition-all"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              </div>

              {/* Submitted time */}
              <div className="mt-3 pt-3 border-t border-slate-800/30">
                <p className="text-xs text-slate-600">
                  Submitted {new Date(req.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPendingRequests;
