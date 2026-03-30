import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Users, Loader2, Search, CalendarCheck, Phone } from "lucide-react";

interface Customer {
  name: string;
  phone: string;
  totalBookings: number;
  lastBooking: string;
}

const AdminCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      const { data, error } = await supabase
        .from("room_bookings")
        .select("name, phone, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Failed to fetch customers");
        setLoading(false);
        return;
      }

      const customerMap = new Map<string, Customer>();
      (data ?? []).forEach((row: any) => {
        const key = row.phone;
        if (customerMap.has(key)) {
          customerMap.get(key)!.totalBookings += 1;
        } else {
          customerMap.set(key, {
            name: row.name,
            phone: row.phone,
            totalBookings: 1,
            lastBooking: row.created_at,
          });
        }
      });

      setCustomers(Array.from(customerMap.values()));
      setLoading(false);
    };
    fetchCustomers();
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-full border border-blue-500/20">
          <Users className="w-3.5 h-3.5" />
          <span className="text-sm font-medium">{customers.length} customers</span>
        </div>
        <div className="relative max-w-xs w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-lg bg-slate-900/80 border border-slate-800/50 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all"
          />
        </div>
      </div>

      <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-800/50 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No customers found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800/50">
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Customer</th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Phone</th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Bookings</th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Last Activity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/30">
                {filtered.map((c, i) => (
                  <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white text-xs font-bold">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-white">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-400">
                      <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" />{c.phone}</div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-300 font-medium">
                      <div className="flex items-center gap-2"><CalendarCheck className="w-3.5 h-3.5 text-amber-400" />{c.totalBookings}</div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-500">{new Date(c.lastBooking).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCustomers;
