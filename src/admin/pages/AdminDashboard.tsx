import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  BedDouble,
  CalendarCheck,
  DoorOpen,
  IndianRupee,
  TrendingUp,
  ArrowUpRight,
  Loader2,
  ConciergeBell,
  MinusCircle,
  PlusCircle,
  Clock,
  X,
  ChevronDown,
  ChevronUp,
  Plus
} from "lucide-react";

interface DashboardStats {
  totalRooms: number;
  totalBookings: number;
  availableRooms: number;
  revenue: number;
}

interface RecentBooking {
  id: string;
  name: string;
  room_type: string;
  check_in: string;
  check_out: string;
  status: string;
  created_at: string;
}

interface Room {
  id: string;
  room_number: string;
  type: string;
  price: number;
  status: string;
  created_at: string;
}

interface ServiceItem {
  name: string;
  quantity: number;
}

interface PastService {
  id: string;
  created_at: string;
  items: ServiceItem[];
}

const statCards = [
  {
    key: "totalRooms" as const,
    label: "Total Rooms",
    icon: BedDouble,
    gradient: "from-blue-500 to-blue-700",
    shadow: "shadow-blue-500/20",
    bgGlow: "bg-blue-500/10",
  },
  {
    key: "totalBookings" as const,
    label: "Total Bookings",
    icon: CalendarCheck,
    gradient: "from-emerald-500 to-emerald-700",
    shadow: "shadow-emerald-500/20",
    bgGlow: "bg-emerald-500/10",
  },
  {
    key: "availableRooms" as const,
    label: "Available Rooms",
    icon: DoorOpen,
    gradient: "from-violet-500 to-violet-700",
    shadow: "shadow-violet-500/20",
    bgGlow: "bg-violet-500/10",
  },
  {
    key: "revenue" as const,
    label: "Revenue (₹)",
    icon: IndianRupee,
    gradient: "from-amber-500 to-amber-700",
    shadow: "shadow-amber-500/20",
    bgGlow: "bg-amber-500/10",
  },
];

const PREDEFINED_SERVICES = ["Tea", "Coffee", "Water Bottle", "Extra Bed"];

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalRooms: 0,
    totalBookings: 0,
    availableRooms: 0,
    revenue: 0,
  });
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [occupiedRooms, setOccupiedRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Services State
  const [expandedRoomId, setExpandedRoomId] = useState<string | null>(null);
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([]);
  const [customItem, setCustomItem] = useState({ name: "", quantity: 1 });
  const [savingService, setSavingService] = useState(false);
  const [pastServices, setPastServices] = useState<PastService[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch rooms count
      const { count: totalRooms } = await supabase
        .from("rooms")
        .select("*", { count: "exact", head: true });

      const { count: availableRooms } = await supabase
        .from("rooms")
        .select("*", { count: "exact", head: true })
        .eq("status", "available");

      // Fetch bookings count
      const { count: totalBookings } = await supabase
        .from("room_bookings")
        .select("*", { count: "exact", head: true });

      // Fetch rooms for revenue calculation
      const { data: roomsData } = await supabase
        .from("rooms")
        .select("price, status, id, room_number, type, created_at");

      const revenue = roomsData?.reduce((sum, r) => sum + (Number(r.price) || 0), 0) ?? 0;
      
      const occupied = roomsData?.filter(r => r.status === "occupied") as Room[] ?? [];
      setOccupiedRooms(occupied.sort((a,b) => a.room_number.localeCompare(b.room_number)));

      // Fetch recent bookings
      const { data: bookings } = await supabase
        .from("room_bookings")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      setStats({
        totalRooms: totalRooms ?? 0,
        totalBookings: totalBookings ?? 0,
        availableRooms: availableRooms ?? 0,
        revenue,
      });

      setRecentBookings((bookings as RecentBooking[]) ?? []);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
      confirmed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
      rejected: "bg-red-500/15 text-red-400 border-red-500/20",
    };
    return styles[status] ?? "bg-slate-500/15 text-slate-400 border-slate-500/20";
  };

  const toggleExpandRoom = async (roomId: string) => {
    if (expandedRoomId === roomId) {
      setExpandedRoomId(null);
      return;
    }
    
    setExpandedRoomId(roomId);
    setServiceItems([]);
    setCustomItem({ name: "", quantity: 1 });
    
    // Fetch past services for this room
    const { data, error } = await supabase
      .from("room_services")
      .select("*")
      .eq("room_id", roomId)
      .order("created_at", { ascending: false });
      
    if (!error && data) {
      setPastServices(data as unknown as PastService[]);
    }
  };

  const handleServiceQtyChange = (name: string, delta: number) => {
    setServiceItems(current => {
      const existing = current.find(item => item.name === name);
      if (existing) {
        const newQty = existing.quantity + delta;
        if (newQty <= 0) {
          return current.filter(item => item.name !== name);
        }
        return current.map(item => item.name === name ? { ...item, quantity: newQty } : item);
      } else if (delta > 0) {
        return [...current, { name, quantity: delta }];
      }
      return current;
    });
  };

  const handleAddCustomItem = () => {
    if (!customItem.name.trim()) return;
    handleServiceQtyChange(customItem.name.trim(), customItem.quantity);
    setCustomItem({ name: "", quantity: 1 });
  };

  const handleSaveServices = async (roomId: string) => {
    if (serviceItems.length === 0) return;
    
    setSavingService(true);
    try {
      const { error } = await supabase.from("room_services").insert({
        room_id: roomId,
        items: serviceItems as any
      });

      if (error) throw error;
      
      toast.success("Services added to bill successfully");
      setServiceItems([]);
      // Refresh past services directly
      const { data } = await supabase
        .from("room_services")
        .select("*")
        .eq("room_id", roomId)
        .order("created_at", { ascending: false });
      if (data) setPastServices(data as unknown as PastService[]);
    } catch (error: any) {
      toast.error(error.message || "Failed to add services");
    } finally {
      setSavingService(false);
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
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.key}
            className="relative overflow-hidden bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-800/50 p-5 group hover:border-slate-700/50 transition-all duration-300"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 ${card.bgGlow} rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-500`} />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg ${card.shadow}`}>
                  <card.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex items-center gap-1 text-emerald-400 text-xs font-medium">
                  <TrendingUp className="w-3 h-3" />
                  <span>Live</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-white">
                {card.key === "revenue" ? `₹${stats[card.key].toLocaleString()}` : stats[card.key]}
              </p>
              <p className="text-sm text-slate-500 mt-0.5">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Occupied Rooms & Services */}
      <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-800/50 overflow-hidden">
        <div className="p-5 border-b border-slate-800/50 flex items-center justify-between bg-slate-800/20">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <ConciergeBell className="w-5 h-5 text-amber-500" />
            Occupied Rooms & Services
          </h3>
          <span className="text-xs font-medium bg-amber-500/20 text-amber-500 px-2 py-1 rounded-md">
            {occupiedRooms.length} Occupied
          </span>
        </div>

        {occupiedRooms.length === 0 ? (
          <div className="p-10 text-center">
            <DoorOpen className="w-10 h-10 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No rooms are currently occupied</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/50">
            {occupiedRooms.map((room) => (
              <div key={room.id} className="flex flex-col">
                {/* Room Row */}
                <div 
                  className="flex items-center justify-between p-5 hover:bg-slate-800/30 transition-colors cursor-pointer"
                  onClick={() => toggleExpandRoom(room.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
                      <BedDouble className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium text-sm">Room {room.room_number}</h4>
                      <p className="text-xs text-slate-500 capitalize">{room.type} • ₹{room.price}/night</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="text-xs font-medium text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors">
                      {expandedRoomId === room.id ? (
                        <>Close Services <ChevronUp className="w-4 h-4" /></>
                      ) : (
                        <>Add Services <ChevronDown className="w-4 h-4" /></>
                      )}
                    </button>
                  </div>
                </div>

                {/* Expandable Services Section */}
                {expandedRoomId === room.id && (
                  <div className="bg-slate-950/50 p-5 pt-2 border-t border-slate-800/50 animate-in slide-in-from-top-2 duration-200">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      
                      {/* Left side: Add items */}
                      <div className="space-y-5">
                        <h4 className="text-sm font-medium text-slate-300 border-b border-slate-800 pb-2">Add New Items</h4>
                        
                        <div className="grid grid-cols-2 gap-2">
                          {PREDEFINED_SERVICES.map(service => {
                            const currentQty = serviceItems.find(i => i.name === service)?.quantity || 0;
                            return (
                              <div key={service} className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between">
                                <span className="text-xs text-slate-300">{service}</span>
                                <div className="flex items-center gap-1.5">
                                  <button onClick={() => handleServiceQtyChange(service, -1)} disabled={currentQty === 0} className="text-slate-500 hover:text-white disabled:opacity-30 transition-colors">
                                    <MinusCircle className="w-4 h-4" />
                                  </button>
                                  <span className="w-4 text-center text-xs font-medium text-white">{currentQty}</span>
                                  <button onClick={() => handleServiceQtyChange(service, 1)} className="text-amber-500 hover:text-amber-400 transition-colors">
                                    <PlusCircle className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={customItem.name}
                            onChange={(e) => setCustomItem({ ...customItem, name: e.target.value })}
                            placeholder="Other item..."
                            className="flex-1 h-9 px-3 rounded-md bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
                          />
                          <input
                            type="number"
                            min="1"
                            value={customItem.quantity}
                            onChange={(e) => setCustomItem({ ...customItem, quantity: parseInt(e.target.value) || 1 })}
                            className="w-16 h-9 px-2 rounded-md bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500/50"
                          />
                          <button
                            onClick={handleAddCustomItem}
                            disabled={!customItem.name.trim()}
                            className="h-9 px-3 rounded-md bg-slate-800 text-white text-xs font-medium hover:bg-slate-700 disabled:opacity-50 transition-colors"
                          >
                            Add
                          </button>
                        </div>

                        {serviceItems.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-slate-800/50 flex items-center justify-between">
                            <button 
                              onClick={() => setServiceItems([])} 
                              className="text-xs text-slate-400 hover:text-slate-300"
                            >
                              Clear Selection
                            </button>
                            <button
                              onClick={() => handleSaveServices(room.id)}
                              disabled={savingService}
                              className="h-9 px-4 rounded-md bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 disabled:opacity-50 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                            >
                              {savingService ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                              Add to Bill
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Right side: Current Selection & History */}
                      <div className="space-y-5 bg-slate-900/50 p-4 rounded-xl border border-slate-800/30">
                        {serviceItems.length > 0 && (
                          <div>
                            <h4 className="text-xs font-bold text-amber-500 mb-2 uppercase tracking-wider">Staged Items</h4>
                            <ul className="space-y-1 bg-amber-500/10 rounded-md p-2">
                              {serviceItems.map((item, idx) => (
                                <li key={idx} className="flex justify-between items-center text-xs">
                                  <span className="text-slate-300">{item.name}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-white font-medium">x {item.quantity}</span>
                                    <button onClick={() => handleServiceQtyChange(item.name, -item.quantity)} className="text-red-400 hover:text-red-300">
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div>
                          <h4 className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" /> Billed History
                          </h4>
                          {pastServices.length === 0 ? (
                            <p className="text-xs text-slate-600 italic">No services billed to this room yet.</p>
                          ) : (
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                              {pastServices.map(session => (
                                <div key={session.id} className="bg-slate-900 rounded-md p-2.5 border border-slate-800/50">
                                  <div className="text-[10px] text-slate-500 mb-1.5 border-b border-slate-800 pb-1">
                                    {new Date(session.created_at).toLocaleString()}
                                  </div>
                                  <ul className="space-y-0.5">
                                    {session.items.map((item, i) => (
                                      <li key={i} className="flex justify-between text-xs text-slate-300">
                                        <span>{item.name}</span>
                                        <span className="text-slate-400">x {item.quantity}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Bookings */}
      <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-800/50 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-800/50">
          <h3 className="text-base font-semibold text-white">Recent Bookings</h3>
          <a
            href="/admin/bookings"
            className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium transition-colors"
          >
            View All <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>

        {recentBookings.length === 0 ? (
          <div className="p-10 text-center">
            <CalendarCheck className="w-10 h-10 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No bookings yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800/50">
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Guest</th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Room Type</th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Check-in</th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Check-out</th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/30">
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3.5 text-sm text-white font-medium">{booking.name}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-400 capitalize">{booking.room_type}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-400">{booking.check_in}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-400">{booking.check_out}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${getStatusBadge(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
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

export default AdminDashboard;
