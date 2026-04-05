import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  Copy, 
  Check, 
  Phone, 
  QrCode, 
  Smartphone, 
  Building2, 
  Info,
  ExternalLink,
  ShieldCheck
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: number;
  bookingId: string;
  type: "Stay" | "Event";
}

const PaymentDialog = ({ open, onOpenChange, amount, bookingId, type }: PaymentDialogProps) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const upiId = "940743660@ybl";
  const accountName = "ISHAN TRIVEDI";
  const bankName = "HDFC Bank";
  const whatsappNumber = "+919752233666";

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success(`${field} copied to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleUPIDeepLink = () => {
    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(accountName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(`Payment for ${type} Booking ${bookingId.slice(0, 8)}`)}`;
    window.location.href = upiUrl;
  };

  const handleWhatsAppVerification = () => {
    const message = `Hi Hotel Omkar, I have just made a payment of ₹${amount.toLocaleString()} for my ${type} Booking ID: #${bookingId.slice(0, 8)}. Attached is the screenshot of the payment for verification.`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none bg-slate-950/95 backdrop-blur-2xl shadow-2xl ring-1 ring-white/10 outline-none">
        {/* Top Gold Bar */}
        <div className="w-full h-1.5 gold-gradient flex-shrink-0"></div>
        
        {/* Main Content Container with safe top padding */}
        <div className="p-8 pt-16">
          {/* Custom Header */}
          <div className="mb-10 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-white uppercase tracking-tight leading-tight italic">Complete Payment</h2>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] block">Secure Reservation</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 opacity-60">Payable Amount</p>
              <div className="text-3xl font-black text-primary drop-shadow-lg leading-none">₹{amount.toLocaleString()}</div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Quick Pay / UPI Section */}
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-xl group-hover:bg-primary/10 transition-colors"></div>
              <div className="relative bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <Smartphone className="w-5 h-5 text-primary" />
                  <h4 className="text-xs font-black text-white uppercase tracking-widest">Pay via UPI App</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative w-40 h-40 bg-slate-900 rounded-3xl p-3 shadow-2xl shadow-black/40 overflow-hidden group/qr transition-all hover:scale-105 duration-300 border border-white/5">
                      <img 
                        src="/payment-qr.jpg" 
                        alt="PhonePe QR Code" 
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/qr:opacity-100 transition-opacity"></div>
                    </div>
                    <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest">Scan to Pay</p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-3 bg-slate-900/50 rounded-xl border border-white/5">
                      <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">UPI ID</p>
                      <div className="flex items-center justify-between gap-2">
                        <code className="text-xs font-bold text-slate-200">{upiId}</code>
                        <button onClick={() => copyToClipboard(upiId, "UPI ID")} className="text-slate-400 hover:text-primary">
                          {copiedField === "UPI ID" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                    <Button 
                      onClick={handleUPIDeepLink} 
                      className="w-full gold-gradient text-white h-14 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform"
                    >
                      <Smartphone className="w-4 h-4 mr-2" /> Open UPI App
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Transfer Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 px-2">
                <Building2 className="w-4 h-4 text-slate-500" />
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Direct Bank Transfer</h4>
              </div>
              
              <div className="bg-slate-900/40 rounded-3xl p-6 border border-white/5 space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Bank Name</span>
                  <span className="text-xs font-black text-slate-200 uppercase">{bankName}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Account Name</span>
                  <span className="text-xs font-black text-slate-200 uppercase">{accountName}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Account Number</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-200 tracking-wider">XXXXXXXXXXXX</span>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-white/5 opacity-50" disabled>
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Footer */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="flex items-start gap-3 p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-200 mb-1 font-display uppercase tracking-widest">Verify payment</p>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                    Once paid, please send a screenshot on WhatsApp for instant confirmation.
                  </p>
                </div>
              </div>
              
              <Button 
                onClick={handleWhatsAppVerification} 
                className="w-full h-16 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] gap-3 shadow-xl shadow-emerald-900/20 transition-all hover:scale-[1.02]"
              >
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                Verify on WhatsApp
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/60 p-4 flex items-center justify-center gap-2">
           <Info className="w-3.5 h-3.5 text-slate-500" />
           <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Ref: #{bookingId.slice(0, 8).toUpperCase()}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
