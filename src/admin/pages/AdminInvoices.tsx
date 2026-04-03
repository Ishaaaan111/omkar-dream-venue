import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  FileText, 
  Search, 
  Loader2, 
  Printer, 
  Calendar,
  ChevronRight,
  Filter,
  ArrowUpDown,
  CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const AdminInvoices = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchInvoices = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from("invoices")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch billing history");
      console.error(error);
    } else {
      setInvoices(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const filteredInvoices = invoices.filter(inv => 
    inv.customer_name.toLowerCase().includes(search.toLowerCase()) ||
    inv.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
    inv.room_number.includes(search)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-amber-500" />
            Billing History
          </h2>
          <p className="text-slate-500 text-sm mt-1">View and manage all finalized guest invoices.</p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            placeholder="Search by Name or INV#..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 bg-slate-900 border-slate-800 text-white rounded-xl focus:ring-amber-500/20"
          />
        </div>
      </div>

      {/* Stats Summary (Mini) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Invoices</p>
          <p className="text-2xl font-black text-white">{invoices.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Revenue Generated</p>
          <p className="text-2xl font-black text-emerald-500">₹{invoices.reduce((sum, inv) => sum + Number(inv.grand_total), 0).toLocaleString()}</p>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        {filteredInvoices.length === 0 ? (
          <div className="p-20 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-white font-bold">No Invoices Found</h3>
            <p className="text-slate-500 text-sm mt-1">Finalize a room checkout to generate your first invoice.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-900/80">
                <TableRow className="hover:bg-transparent border-slate-800">
                  <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest py-4">Invoice #</TableHead>
                  <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Date</TableHead>
                  <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Customer</TableHead>
                  <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Room</TableHead>
                  <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Total Amount</TableHead>
                  <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id} className="border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <TableCell className="font-bold text-slate-400 text-xs">
                      {invoice.invoice_number}
                    </TableCell>
                    <TableCell className="text-slate-300 text-xs">
                      <div className="flex flex-col">
                        <span>{new Date(invoice.created_at).toLocaleDateString()}</span>
                        <span className="text-[10px] text-slate-500 font-medium">{new Date(invoice.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-white capitalize">
                      {invoice.customer_name}
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded bg-slate-800 text-amber-500 text-[10px] font-black">
                        ROOM {invoice.room_number}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-black text-white">
                      ₹{Number(invoice.grand_total).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-9 w-9 p-0 rounded-xl hover:bg-amber-500/10 hover:text-amber-500 transition-all"
                        onClick={() => window.open(`/admin/invoice/${invoice.id}`, "_blank")}
                        title="Re-print Invoice"
                      >
                        <Printer className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInvoices;
