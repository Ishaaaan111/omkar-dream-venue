import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Printer, ArrowLeft, Download, Mail, Hotel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const AdminInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      const { data, error } = await (supabase as any)
        .from("invoices")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching invoice:", error);
      } else {
        setInvoice(data);
        // Trigger print after a short delay to ensure rendering
        setTimeout(() => {
          window.print();
        }, 1000);
      }
      setLoading(false);
    };

    fetchInvoice();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white">
        <h1 className="text-2xl font-bold text-slate-800">Invoice Not Found</h1>
        <Button onClick={() => navigate("/admin/rooms")} className="mt-4">Back to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 print:p-0 print:bg-white">
      {/* Actions (Hidden on Print) */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center print:hidden">
        <Button variant="ghost" onClick={() => navigate(-1)} className="text-slate-600">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <div className="flex gap-2">
          <Button onClick={() => window.print()} className="bg-amber-600 hover:bg-amber-700">
            <Printer className="w-4 h-4 mr-2" /> Print Invoice
          </Button>
        </div>
      </div>

      {/* Invoice Paper */}
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl p-10 print:shadow-none print:p-0 print:rounded-none overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-slate-100 pb-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
              <Hotel className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter">HOTEL OMKAR</h1>
              <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">& Dream Venue</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-4xl font-black text-slate-200 uppercase">INVOICE</h2>
            <p className="text-sm font-bold text-slate-900 mt-1">#{invoice.invoice_number}</p>
            <p className="text-xs text-slate-500">{new Date(invoice.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-10 py-10">
          <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Billed To</h4>
            <p className="text-xl font-bold text-slate-900">{invoice.customer_name}</p>
            <p className="text-sm text-slate-500 mt-1">Customer of Room {invoice.room_number}</p>
          </div>
          <div className="text-right">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Stay Details</h4>
            <p className="text-sm font-bold text-slate-900">CHECK-IN: {new Date(invoice.check_in).toLocaleDateString()}</p>
            <p className="text-sm font-bold text-slate-900">CHECK-OUT: {new Date(invoice.check_out).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="mt-4">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 rounded-lg">
                <th className="text-left text-[10px] font-black text-slate-500 uppercase tracking-widest p-4 rounded-l-xl">Description</th>
                <th className="text-center text-[10px] font-black text-slate-500 uppercase tracking-widest p-4">Rate</th>
                <th className="text-center text-[10px] font-black text-slate-500 uppercase tracking-widest p-4">Qty</th>
                <th className="text-right text-[10px] font-black text-slate-500 uppercase tracking-widest p-4 rounded-r-xl">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Room Rent */}
              <tr>
                <td className="p-4">
                  <p className="font-bold text-slate-900">Room Accommodation</p>
                  <p className="text-xs text-slate-500 italic">Stay Charge (Room {invoice.room_number})</p>
                </td>
                <td className="p-4 text-center text-slate-700">₹{(invoice.room_charges / Math.ceil((new Date(invoice.check_out).getTime() - new Date(invoice.check_in).getTime()) / (1000 * 3600 * 24)) || invoice.room_charges).toLocaleString()}</td>
                <td className="p-4 text-center text-slate-700">{Math.ceil((new Date(invoice.check_out).getTime() - new Date(invoice.check_in).getTime()) / (1000 * 3600 * 24)) || 1}</td>
                <td className="p-4 text-right font-bold text-slate-900">₹{Number(invoice.room_charges).toLocaleString()}</td>
              </tr>
              {/* Services */}
              {invoice.service_items && invoice.service_items.map((item: any, index: number) => (
                <tr key={index}>
                  <td className="p-4">
                    <p className="font-bold text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-500 uppercase tracking-tighter">Room Service Item</p>
                  </td>
                  <td className="p-4 text-center text-slate-700">₹{item.price.toLocaleString()}</td>
                  <td className="p-4 text-center text-slate-700">{item.quantity}</td>
                  <td className="p-4 text-right font-bold text-slate-900">₹{(item.price * item.quantity).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Grand Total Area */}
        <div className="mt-10 pt-10 border-t border-slate-100">
          <div className="flex justify-end">
            <div className="w-80 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">Subtotal</span>
                <span className="text-slate-900 font-bold">₹{(Number(invoice.grand_total) - Number(invoice.tax_amount) + Number(invoice.discount_amount)).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">Taxes (GST)</span>
                <span className="text-slate-900 font-bold">₹{Number(invoice.tax_amount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">Discount</span>
                <span className="text-emerald-600 font-bold">- ₹{Number(invoice.discount_amount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-5 border-t-2 border-slate-900">
                <span className="text-lg font-black text-slate-900 uppercase tracking-tighter">Grand Total</span>
                <span className="text-2xl font-black text-slate-950">₹{Number(invoice.grand_total).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 pt-10 border-t border-slate-100 text-center">
          <p className="text-sm font-bold text-slate-900 uppercase mb-1">Thank you for staying with us!</p>
          <p className="text-xs text-slate-500">Omkar & Dream Venue • Survey No. 123, Mumbai-Pune Expressway, Near Somatne Phata, Pune.</p>
          <p className="text-[10px] text-slate-400 mt-4 leading-relaxed">This is a computer-generated invoice. For any queries, please contact admin@omkartarade.com</p>
        </div>
      </div>
    </div>
  );
};

export default AdminInvoice;
