import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BedDouble,
  CalendarCheck,
  Clock,
  Users,
  Settings,
  LogOut,
  Hotel,
  X,
  PartyPopper
} from "lucide-react";
import { useAuth } from "@/admin/context/AuthContext";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/rooms", icon: BedDouble, label: "Rooms" },
  { to: "/admin/bookings", icon: CalendarCheck, label: "Bookings" },
  { to: "/admin/pending", icon: Clock, label: "Pending Requests" },
  { to: "/admin/events", icon: PartyPopper, label: "Event Inquiries" },
  { to: "/admin/customers", icon: Users, label: "Customers" },
  { to: "/admin/settings", icon: Settings, label: "Settings" },
];

const AdminSidebar = ({ open, onClose }: AdminSidebarProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const fetchPendingCount = async () => {
      const { count } = await supabase
        .from("room_bookings")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");
      setPendingCount(count ?? 0);
    };
    fetchPendingCount();

    // Refresh every 30 seconds
    const interval = setInterval(fetchPendingCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[280px] bg-slate-950 border-r border-slate-800/50 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Hotel className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-wide">OMKAR</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-gradient-to-r from-amber-500/15 to-amber-600/5 text-amber-400 shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${
                      isActive ? "text-amber-400" : "text-slate-500 group-hover:text-slate-300"
                    }`}
                  />
                  <span className="flex-1">{item.label}</span>
                  {item.label === "Pending Requests" && pendingCount > 0 && (
                    <span className="ml-auto bg-red-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center animate-pulse">
                      {pendingCount}
                    </span>
                  )}
                  {isActive && (
                    <div className="w-1 h-5 bg-amber-400 rounded-full ml-1" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-slate-800/50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
          >
            <LogOut className="w-[18px] h-[18px]" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
