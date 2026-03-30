import { useState } from "react";
import { useAuth } from "@/admin/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Settings, User, Lock, Loader2, Save } from "lucide-react";

const AdminSettings = () => {
  const { user } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in both fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSaving(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated successfully");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-2xl">
      {/* Profile Card */}
      <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-800/50 p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <User className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-base font-semibold text-white">Profile Information</h3>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-slate-500 uppercase tracking-wider">Email</label>
            <p className="text-sm text-white mt-1">{user?.email ?? "—"}</p>
          </div>
          <div>
            <label className="text-xs text-slate-500 uppercase tracking-wider">User ID</label>
            <p className="text-sm text-slate-400 mt-1 font-mono text-xs">{user?.id ?? "—"}</p>
          </div>
          <div>
            <label className="text-xs text-slate-500 uppercase tracking-wider">Last Sign In</label>
            <p className="text-sm text-slate-400 mt-1">
              {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Password Card */}
      <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-800/50 p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <Lock className="w-5 h-5 text-amber-400" />
          </div>
          <h3 className="text-base font-semibold text-white">Change Password</h3>
        </div>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-10 px-4 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-10 px-4 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="h-10 px-6 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-semibold flex items-center gap-2 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 transition-all shadow-lg shadow-amber-500/20"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;
