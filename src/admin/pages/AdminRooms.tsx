import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import BillingSidebar from "@/admin/components/BillingSidebar";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  BedDouble,
  Search,
  Coffee,
  ConciergeBell,
  MinusCircle,
  PlusCircle,
  Clock
} from "lucide-react";

interface Room {
  id: string;
  room_number: string;
  type: string;
  price: number;
  status: string;
  customer_name: string | null;
  check_in_time: string | null;
  check_out_time: string | null;
  created_at: string;
}

interface RoomForm {
  room_number: string;
  type: string;
  price: string;
  status: string;
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

const emptyForm: RoomForm = { room_number: "", type: "ac", price: "", status: "available" };
const PREDEFINED_SERVICES = ["Tea", "Coffee", "Water Bottle", "Extra Bed"];

const AdminRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<RoomForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  
  const [selectedType, setSelectedType] = useState<"ac" | "nonac">("ac");
  const [billingOpen, setBillingOpen] = useState(false);
  const [selectedBillingRoom, setSelectedBillingRoom] = useState<any>(null);
  
  // Check-in state
  const [checkInModalOpen, setCheckInModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [processingAction, setProcessingAction] = useState(false);

  const fetchRooms = async () => {
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .order("room_number", { ascending: true });

    if (error) {
      toast.error("Failed to fetch rooms");
      console.error(error);
    } else {
      setRooms((data as Room[]) ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (room: Room) => {
    setEditingId(room.id);
    setForm({
      room_number: room.room_number,
      type: room.type,
      price: String(room.price),
      status: room.status,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.room_number || !form.price) {
      toast.error("Please fill in all fields");
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        const { error } = await supabase
          .from("rooms")
          .update({
            room_number: form.room_number,
            type: form.type,
            price: Number(form.price),
            status: form.status,
          })
          .eq("id", editingId);

        if (error) throw error;
        toast.success("Room updated successfully");
      } else {
        const { error } = await supabase.from("rooms").insert({
          room_number: form.room_number,
          type: form.type,
          price: Number(form.price),
          status: form.status,
        });

        if (error) throw error;
        toast.success("Room added successfully");
      }

      setModalOpen(false);
      fetchRooms();
    } catch (error: any) {
      toast.error(error.message || "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("rooms").delete().eq("id", id);
      if (error) throw error;
      toast.success("Room deleted");
      setDeleteConfirm(null);
      fetchRooms();
    } catch (error: any) {
      toast.error(error.message || "Delete failed");
    }
  };

  const handleCheckIn = async () => {
    if (!selectedRoom || !customerName.trim()) {
      toast.error("Please enter customer name");
      return;
    }

    setProcessingAction(true);
    try {
      const { error } = await supabase
        .from("rooms")
        .update({
          status: "occupied",
          customer_name: customerName.trim(),
          check_in_time: new Date().toISOString(),
          check_out_time: null
        })
        .eq("id", selectedRoom.id);

      if (error) throw error;
      toast.success(`Checked in room ${selectedRoom.room_number}`);
      setCheckInModalOpen(false);
      setCustomerName("");
      fetchRooms();
    } catch (error: any) {
      toast.error(error.message || "Check-in failed");
    } finally {
      setProcessingAction(false);
    }
  };

  const handleCheckOut = async (room: Room) => {
    setProcessingAction(true);
    try {
      const { error } = await supabase
        .from("rooms")
        .update({
          status: "available",
          customer_name: null,
          check_out_time: new Date().toISOString()
        })
        .eq("id", room.id);

      if (error) throw error;
      toast.success(`Checked out room ${room.room_number}`);
      fetchRooms();
    } catch (error: any) {
      toast.error(error.message || "Check-out failed");
    } finally {
      setProcessingAction(false);
    }
  };

  const filteredRooms = rooms.filter(
    (r) =>
      r.type === selectedType && (
        r.room_number.toLowerCase().includes(search.toLowerCase()) ||
        r.type.toLowerCase().includes(search.toLowerCase())
      )
  );

  const getStatusStyle = (status: string) => {
    const styles: Record<string, string> = {
      available: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
      occupied: "bg-red-500/15 text-red-400 border-red-500/20",
      maintenance: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
    };
    return styles[status] ?? "bg-slate-500/15 text-slate-400 border-slate-500/20";
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 bg-slate-900/80 rounded-lg p-1 border border-slate-800/50">
          <button
            onClick={() => setSelectedType("ac")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              selectedType === "ac"
                ? "bg-amber-500/15 text-amber-400 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            AC Rooms
          </button>
          <button
            onClick={() => setSelectedType("nonac")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              selectedType === "nonac"
                ? "bg-amber-500/15 text-amber-400 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Non-AC Rooms
          </button>
        </div>

        <div className="relative flex-1 max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search rooms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-lg bg-slate-900/80 border border-slate-800/50 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/40 transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-800/50 overflow-hidden">
        {filteredRooms.length === 0 ? (
          <div className="p-12 text-center">
            <BedDouble className="w-12 h-12 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">
              {search ? "No rooms match your search" : "No rooms found in this category"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800/50">
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Room No.</th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Customer</th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Type</th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Price / Night</th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Status</th>
                  <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/30">
                {filteredRooms.map((room) => (
                  <tr key={room.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-semibold text-white">{room.room_number}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-300">
                      {room.customer_name || <span className="text-slate-600 italic">No Guest</span>}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-400 capitalize">{room.type}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-300 font-medium">₹{Number(room.price).toLocaleString()}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${getStatusStyle(room.status)}`}>
                        {room.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-3">
                        {room.status === "available" && (
                          <button
                            onClick={() => {
                              setSelectedRoom(room);
                              setCheckInModalOpen(true);
                            }}
                            className="h-8 px-3 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
                          >
                            Check-In
                          </button>
                        )}
                        {room.status === "occupied" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedBillingRoom(room);
                                setBillingOpen(true);
                              }}
                              className="h-8 px-3 rounded-lg bg-amber-500/10 text-amber-500 text-xs font-semibold border border-amber-500/20 hover:bg-amber-500/20 transition-all"
                            >
                              Checkout
                            </button>
                            <button
                              onClick={() => handleCheckOut(room)}
                              disabled={processingAction}
                              className="h-8 px-3 rounded-lg bg-red-500/10 text-red-400 text-xs font-semibold border border-red-500/20 hover:bg-red-500/20 transition-all disabled:opacity-50"
                            >
                              Quick Out
                            </button>
                          </div>
                        )}
                        <div className="flex items-center gap-1 border-l border-slate-800 ml-1 pl-2">
                          <button
                            onClick={() => openEditModal(room)}
                            className="p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setModalOpen(false)}>
          <div
            className="bg-slate-900 border border-slate-800/50 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-white">
                {editingId ? "Edit Room" : "Add New Room"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">Room Number</label>
                <input
                  type="text"
                  value={form.room_number}
                  onChange={(e) => setForm({ ...form, room_number: e.target.value })}
                  placeholder="e.g. 101"
                  className="w-full h-10 px-4 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">Room Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full h-10 px-4 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all appearance-none"
                >
                  <option value="ac">AC Room</option>
                  <option value="nonac">Non-AC Room</option>
                  <option value="deluxe">Deluxe Room</option>
                  <option value="suite">Suite</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">Price per Night (₹)</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="e.g. 2500"
                  className="w-full h-10 px-4 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full h-10 px-4 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all appearance-none"
                >
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 h-10 rounded-lg bg-slate-800 text-slate-300 text-sm font-medium hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 h-10 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-semibold hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {editingId ? "Update" : "Add Room"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
          <div
            className="bg-slate-900 border border-slate-800/50 rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/15 flex items-center justify-center mb-4">
                <Trash2 className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">Delete Room</h3>
              <p className="text-sm text-slate-400 mb-6">This action cannot be undone. Are you sure?</p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 h-10 rounded-lg bg-slate-800 text-slate-300 text-sm font-medium hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 h-10 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Check-In Modal */}
      {checkInModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setCheckInModalOpen(false)}>
          <div
            className="bg-slate-900 border border-slate-800/50 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <ConciergeBell className="w-5 h-5 text-amber-500" />
                Check-In Room {selectedRoom?.room_number}
              </h3>
              <button onClick={() => setCheckInModalOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">Customer Name <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full h-10 px-4 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all"
                  autoFocus
                />
              </div>
              
              <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">Room Type</span>
                  <span className="text-slate-300 capitalize">{selectedRoom?.type}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Price / Night</span>
                  <span className="text-amber-500 font-semibold">₹{selectedRoom?.price.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setCheckInModalOpen(false)}
                className="flex-1 h-10 rounded-lg bg-slate-800 text-slate-300 text-sm font-medium hover:bg-slate-700 transition-colors"
                disabled={processingAction}
              >
                Cancel
              </button>
              <button
                onClick={handleCheckIn}
                disabled={processingAction || !customerName.trim()}
                className="flex-1 h-10 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-semibold hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {processingAction ? <Loader2 className="w-4 h-4 animate-spin" /> : "Complete Check-In"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Billing Sidebar */}
      <BillingSidebar 
        open={billingOpen} 
        onOpenChange={setBillingOpen} 
        room={selectedBillingRoom} 
        onCheckoutComplete={fetchRooms}
      />
    </div>
  );
};

export default AdminRooms;
