import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import BillingSidebar from "@/admin/components/BillingSidebar";
import { 
  ConciergeBell, 
  Plus, 
  Search, 
  Loader2, 
  Utensils, 
  Coffee, 
  Bed, 
  Trash2,
  Clock,
  ChevronRight,
  Receipt
} from "lucide-react";

interface Room {
  id: string;
  room_number: string;
  customer_name: string | null;
  status: string;
}

interface ServiceRecord {
  id: string;
  room_id: string;
  items: any[];
  created_at: string;
}

const PREDEFINED_ITEMS = [
  { name: "Tea", price: 20, icon: Coffee },
  { name: "Coffee", price: 30, icon: Coffee },
  { name: "Water Bottle", price: 20, icon: Utensils },
  { name: "Breakfast", price: 150, icon: Utensils },
  { name: "Lunch/Dinner", price: 250, icon: Utensils },
  { name: "Extra Bed", price: 500, icon: Bed },
  { name: "Extra Blanket/Pillow", price: 100, icon: Bed },
];

const AdminServices = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [roomServices, setRoomServices] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [billingOpen, setBillingOpen] = useState(false);
  const [selectedBillingRoom, setSelectedBillingRoom] = useState<any>(null);

  const fetchOccupiedRooms = async () => {
    const { data, error } = await supabase
      .from("rooms")
      .select("id, room_number, customer_name, status")
      .eq("status", "occupied")
      .order("room_number", { ascending: true });

    if (error) {
      toast.error("Failed to fetch occupied rooms");
    } else {
      setRooms(data || []);
    }
    setLoading(false);
  };

  const fetchRoomServices = async (roomId: string) => {
    const { data, error } = await supabase
      .from("room_services")
      .select("*")
      .eq("room_id", roomId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching services:", error);
    } else {
      setRoomServices(data || []);
    }
  };

  useEffect(() => {
    fetchOccupiedRooms();
  }, []);

  const handleOpenService = (room: Room) => {
    setSelectedRoom(room);
    fetchRoomServices(room.id);
    setServiceModalOpen(true);
  };

  const addServiceItem = async (item: typeof PREDEFINED_ITEMS[0]) => {
    if (!selectedRoom) return;

    setSaving(true);
    try {
      const newItem = {
        name: item.name,
        price: item.price,
        quantity: 1,
        added_at: new Date().toISOString(),
      };

      // In this simple implementation, we'll just create a new record for each service call
      // or we could append to an existing one. Let's create a new one for better tracking.
      const { error } = await supabase.from("room_services").insert({
        room_id: selectedRoom.id,
        items: [newItem]
      });

      if (error) throw error;
      
      toast.success(`Added ${item.name} to Room ${selectedRoom.room_number}`);
      fetchRoomServices(selectedRoom.id);
    } catch (error: any) {
      toast.error(error.message || "Failed to add service");
    } finally {
      setSaving(false);
    }
  };

  const deleteServiceRecord = async (recordId: string) => {
    try {
      const { error } = await supabase
        .from("room_services")
        .delete()
        .eq("id", recordId);

      if (error) throw error;
      toast.success("Service removed from bill");
      if (selectedRoom) fetchRoomServices(selectedRoom.id);
    } catch (error: any) {
      toast.error(error.message || "Delete failed");
    }
  };

  const filteredRooms = rooms.filter(r => 
    r.room_number.includes(search) || 
    (r.customer_name?.toLowerCase() || "").includes(search.toLowerCase())
  );

  const calculateTotal = (services: any[]) => {
    return services.reduce((total, record) => {
      const recordTotal = record.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
      return total + recordTotal;
    }, 0);
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <ConciergeBell className="w-6 h-6 text-amber-500" />
            Room Services
          </h2>
          <p className="text-slate-400 text-sm mt-1">Manage food, beverages, and extra amenities for current guests.</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search room or guest..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-amber-500/20 transition-all"
          />
        </div>
      </div>

      {rooms.length === 0 ? (
        <div className="bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl p-20 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mx-auto mb-4">
            <Utensils className="w-8 h-8 text-slate-600" />
          </div>
          <h3 className="text-white font-medium">No Occupied Rooms</h3>
          <p className="text-slate-500 text-sm mt-1">Services can only be added to rooms that have guests.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRooms.map((room) => (
            <button
              key={room.id}
              onClick={() => handleOpenService(room)}
              className="group text-left p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/50 transition-all shadow-lg"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 font-bold text-lg group-hover:scale-110 transition-transform">
                  {room.room_number}
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Guest</span>
                  <p className="text-sm font-semibold text-white truncate max-w-[120px]">
                    {room.customer_name || "Unknown"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/50">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Plus className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">Add Service</span>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedBillingRoom(room);
                    setBillingOpen(true);
                  }}
                  className="h-8 px-3 rounded-lg bg-amber-500/10 text-amber-500 text-xs font-semibold border border-amber-500/20 hover:bg-amber-500/20 transition-all ml-auto"
                >
                  View Bill
                </button>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Service Management Modal */}
      {serviceModalOpen && selectedRoom && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 lg:p-10" onClick={() => setServiceModalOpen(false)}>
          <div 
            className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-5xl h-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/50">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center text-slate-950 font-extrabold text-2xl shadow-lg shadow-amber-500/20">
                  {selectedRoom.room_number}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedRoom.customer_name}</h3>
                  <p className="text-slate-500 text-xs uppercase tracking-widest font-bold">Manage Room Services</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right px-4 py-2 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider">Total Service Bill</span>
                  <span className="text-xl font-bold text-amber-500">₹{calculateTotal(roomServices).toLocaleString()}</span>
                </div>
                <button 
                  onClick={() => setServiceModalOpen(false)}
                  className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
                >
                  <Search className="w-5 h-5 rotate-45" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
              {/* Left: Predefined Items */}
              <div className="w-full lg:w-[400px] border-r border-slate-800 bg-slate-950 p-6 overflow-y-auto">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Add Items</h4>
                <div className="grid grid-cols-2 gap-3">
                  {PREDEFINED_ITEMS.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => addServiceItem(item)}
                      disabled={saving}
                      className="flex flex-col items-center text-center p-4 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/50 hover:bg-amber-500/5 group transition-all"
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mb-2 group-hover:bg-amber-500/20 transition-colors">
                        <item.icon className="w-5 h-5 text-slate-400 group-hover:text-amber-500 transition-colors" />
                      </div>
                      <span className="text-sm font-semibold text-slate-200 block truncate w-full">{item.name}</span>
                      <span className="text-xs font-bold text-amber-500 mt-1">₹{item.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right: Current Bill List */}
              <div className="flex-1 bg-slate-900/20 p-6 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Billing History</h4>
                  <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold">
                    <Clock className="w-3 h-3" /> LISTED BY RECENT
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                  {roomServices.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50">
                      <Receipt className="w-12 h-12 mb-3" />
                      <p className="text-sm">No items added to bill yet</p>
                    </div>
                  ) : (
                    roomServices.map((record) => (
                      <div key={record.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between group animate-in slide-in-from-right-4 duration-300">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
                            {record.items[0].name.toLowerCase().includes('tea') || record.items[0].name.toLowerCase().includes('coffee') ? <Coffee className="w-5 h-5" /> : 
                             record.items[0].name.toLowerCase().includes('bed') ? <Bed className="w-5 h-5" /> : <Utensils className="w-5 h-5" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-white">{record.items[0].name}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700">x{record.items[0].quantity}</span>
                            </div>
                            <span className="text-[10px] text-slate-500 font-medium">
                              {new Date(record.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • 
                              {new Date(record.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-bold text-amber-500">₹{(record.items[0].price * record.items[0].quantity).toLocaleString()}</span>
                          <button 
                            onClick={() => deleteServiceRecord(record.id)}
                            className="p-2 rounded-lg text-slate-600 hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Billing Sidebar */}
      <BillingSidebar 
        open={billingOpen} 
        onOpenChange={setBillingOpen} 
        room={selectedBillingRoom} 
        onCheckoutComplete={fetchOccupiedRooms}
      />
    </div>
  );
};

export default AdminServices;
