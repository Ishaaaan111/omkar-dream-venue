import { Menu, Bell, User } from "lucide-react";
import { useAuth } from "@/admin/context/AuthContext";
import { useLocation } from "react-router-dom";

interface AdminTopbarProps {
  onMenuToggle: () => void;
}

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/rooms": "Room Management",
  "/admin/bookings": "Bookings",
  "/admin/pending": "Pending Requests",
  "/admin/customers": "Customers",
  "/admin/settings": "Settings",
};

const AdminTopbar = ({ onMenuToggle }: AdminTopbarProps) => {
  const { user } = useAuth();
  const location = useLocation();
  const title = pageTitles[location.pathname] ?? "Admin Panel";

  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <p className="text-xs text-slate-500 hidden sm:block">
            Omkar Dream Venue — Hotel Management
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full" />
        </button>

        {/* Admin profile */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-white">Admin</p>
            <p className="text-[11px] text-slate-500 truncate max-w-[150px]">
              {user?.email ?? "admin@omkar.com"}
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
