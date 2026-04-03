import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetFooter 
} from "@/components/ui/sheet";
import { 
  Receipt, 
  Trash2, 
  Printer, 
  Mail, 
  CreditCard, 
  Calculator,
  Plus,
  Minus,
  X,
  CreditCard as PaymentIcon,
  Clock,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface ServiceItem {
  name: string;
  price: number;
  quantity: number;
  added_at: string;
}

interface BillingSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room: {
    id: string;
    room_number: string;
    customer_name: string | null;
    price: number;
    check_in_time: string | null;
  } | null;
  onCheckoutComplete?: () => void;
}

const BillingSidebar = ({ open, onOpenChange, room, onCheckoutComplete }: BillingSidebarProps) => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [taxRate] = useState(0.12); // 12% GST
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Local editable state for items to allow inline editing
  const [editableItems, setEditableItems] = useState<any[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    if (open && room) {
      fetchServices();
    }
  }, [open, room]);

  const fetchServices = async () => {
    if (!room) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("room_services")
      .select("*")
      .eq("room_id", room.id);

    if (error) {
      console.error("Error fetching services:", error);
    } else {
      // Flatten the JSON items from all service records
      const allItems = (data || []).flatMap((record: any) => 
        record.items.map((item: any) => ({ ...item, recordId: record.id }))
      );
      setEditableItems(allItems);
    }
    setLoading(false);
  };

  const calculateDays = () => {
    if (!room?.check_in_time) return 1;
    const start = new Date(room.check_in_time);
    const end = new Date();
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  const days = calculateDays();
  const roomTotal = (room?.price || 0) * days;
  const servicesTotal = editableItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const subtotal = roomTotal + servicesTotal;
  const taxAmount = subtotal * taxRate;
  const grandTotal = subtotal + taxAmount - discount;

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...editableItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setEditableItems(newItems);
  };

  const removeItem = (index: number) => {
    const newItems = editableItems.filter((_, i) => i !== index);
    setEditableItems(newItems);
  };

  const handleCheckout = async () => {
    if (!room) return;
    setIsProcessing(true);

    try {
      const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      // 1. Create Invoice Record
      const { data: invoice, error: invoiceError } = await (supabase as any)
        .from("invoices")
        .insert({
          invoice_number: invoiceNumber,
          customer_name: room.customer_name || "Unknown",
          room_number: room.room_number,
          check_in: room.check_in_time,
          check_out: new Date().toISOString(),
          room_charges: roomTotal,
          service_items: editableItems,
          tax_amount: taxAmount,
          discount_amount: discount,
          grand_total: grandTotal
        })
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      // 2. Update Room Status (Make Available)
      const { error: roomError } = await supabase
        .from("rooms")
        .update({
          status: "available",
          customer_name: null,
          check_in_time: null,
          check_out_time: new Date().toISOString()
        })
        .eq("id", room.id);

      if (roomError) throw roomError;

      // 3. Delete Service Records for this room (Optional: Clean up)
      await supabase.from("room_services").delete().eq("room_id", room.id);

      toast.success("Checkout successful! Generating invoice...");
      
      // 4. Open Print View
      window.open(`/admin/invoice/${invoice.id}`, "_blank");
      
      onOpenChange(false);
      if (onCheckoutComplete) onCheckoutComplete();
    } catch (error: any) {
      toast.error(error.message || "Checkout failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md bg-slate-950/40 backdrop-blur-xl border-slate-800 flex flex-col p-0 shadow-2xl">
        {/* Modern Header */}
        <div className="p-6 border-b border-slate-800/50 bg-slate-900/40">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <Receipt className="w-4 h-4 text-amber-500" />
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">Billing POS</h2>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-lg border border-slate-700/50">
              {room?.room_number}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{room?.customer_name}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
                <Clock className="w-3 h-3" /> Stayed for {days} Day{days > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <ScrollArea className="flex-1 px-6 py-4">
          <div className="space-y-6">
            {/* Room Charges Section */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Accommodation</h4>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-800 text-slate-400"><BedDouble className="w-4 h-4" /></div>
                  <div>
                    <p className="text-sm font-medium text-slate-200">Room Rent (₹{room?.price} x {days})</p>
                    <p className="text-[10px] text-slate-500">Standard Check-in Rate</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-white">₹{roomTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Service Items Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Services & Amenities</h4>
                <div className="text-[10px] text-slate-600 font-bold">{editableItems.length} ITEMS</div>
              </div>
              
              <div className="space-y-2">
                {editableItems.map((item, index) => (
                  <div key={index} className="group relative p-3 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/30 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-slate-200">{item.name}</p>
                        <div className="flex items-center gap-2">
                          {/* Inline Edit Quantity */}
                          <button 
                            className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-amber-500 hover:bg-amber-500/10"
                            onClick={() => updateItem(index, 'quantity', Math.max(1, item.quantity - 1))}
                          ><Minus className="w-2.5 h-2.5" /></button>
                          <span className="text-xs font-bold text-slate-400">Qty: {item.quantity}</span>
                          <button 
                            className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-amber-500 hover:bg-amber-500/10"
                            onClick={() => updateItem(index, 'quantity', item.quantity + 1)}
                          ><Plus className="w-2.5 h-2.5" /></button>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-4">
                        <div className="flex flex-col items-end">
                          <span className="text-xs font-bold text-white">₹{(item.price * item.quantity).toLocaleString()}</span>
                          <button 
                            className="text-[10px] text-slate-500 hover:text-amber-400"
                            onClick={() => setEditingIndex(editingIndex === index ? null : index)}
                          >
                            ₹{item.price}/ea
                          </button>
                        </div>
                        <button 
                          onClick={() => removeItem(index)}
                          className="p-1.5 rounded-md text-slate-600 hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    {/* Inline Price Edit Input */}
                    {editingIndex === index && (
                      <div className="mt-2 pt-2 border-t border-slate-800 flex items-center gap-2 animate-in slide-in-from-top-2">
                        <span className="text-[10px] text-slate-500 font-bold uppercase">Price:</span>
                        <Input 
                          type="number" 
                          className="h-7 w-24 bg-slate-800 border-slate-700 text-xs" 
                          value={item.price}
                          onChange={(e) => updateItem(index, 'price', Number(e.target.value))}
                          autoFocus
                        />
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-7 w-7 p-0" 
                          onClick={() => setEditingIndex(null)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
                
                {editableItems.length === 0 && (
                  <p className="text-xs text-slate-600 italic text-center py-4">No additional services recorded.</p>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Sticky Billing Calculations Footer */}
        <div className="p-6 border-t border-slate-800/80 bg-slate-900/60 backdrop-blur-2xl">
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Subtotal</span>
              <span className="text-white font-medium">₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">GST (12%)</span>
              <span className="text-slate-400">₹{taxAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs items-center">
              <span className="text-slate-500">Discount</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-[10px]">₹</span>
                <input 
                  type="number" 
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-16 bg-transparent border-b border-slate-800 text-right text-emerald-500 outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>
            <Separator className="bg-slate-800/50" />
            <div className="flex justify-between items-center py-1">
              <span className="text-sm font-bold text-white uppercase tracking-wider">Grand Total</span>
              <span className="text-2xl font-black text-amber-500 tracking-tight">₹{Math.max(0, grandTotal).toLocaleString()}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <Button 
              className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold shadow-lg shadow-amber-500/20 gap-2 border-none"
              onClick={handleCheckout}
              disabled={isProcessing}
            >
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <PaymentIcon className="w-5 h-5" />}
              Complete Checkout & Print
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="rounded-xl border-slate-800 bg-slate-900/50 text-slate-400 font-bold hover:text-white" disabled>
                <Mail className="w-4 h-4 mr-2" /> Email
              </Button>
              <Button variant="outline" className="rounded-xl border-slate-800 bg-slate-900/50 text-slate-400 font-bold hover:text-white" disabled>
                <Printer className="w-4 h-4 mr-2" /> Print Preview
              </Button>
            </div>
          </div>
          <p className="text-[9px] text-center text-slate-600 mt-4 font-bold uppercase tracking-widest">Managed by OMKAR POS System v1</p>
        </div>
      </SheetContent>
    </Sheet>
  );
};

// Help helper for icons used that might be missing from direct imports above
const BedDouble = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bed-double"><path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"/><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"/><path d="M12 4v6"/><path d="M2 18h20"/></svg>;

export default BillingSidebar;
