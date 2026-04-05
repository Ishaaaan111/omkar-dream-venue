import { Plus, Minus, Users } from "lucide-react";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GuestSelectorProps {
  adults: number;
  setAdults: (n: number) => void;
  children: number;
  setChildren: (n: number) => void;
  rooms: number;
  setRooms: (n: number) => void;
}

export function GuestSelector({
  adults,
  setAdults,
  children,
  setChildren,
  rooms,
  setRooms
}: GuestSelectorProps) {
  const totalGuests = adults + children;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full h-12 justify-start text-left font-normal bg-background rounded-xl border-border hover:border-primary/50 transition-all shadow-sm",
          )}
        >
          <Users className="mr-2 h-4 w-4 text-primary" />
          <span className="truncate text-foreground font-medium">
            {adults} Adult{adults !== 1 ? "s" : ""}, {children} Child{children !== 1 ? "ren" : ""} 
            <span className="mx-1 text-muted-foreground">•</span> {rooms} Room{rooms !== 1 ? "s" : ""}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-6 bg-card border-border rounded-2xl shadow-2xl" align="start">
        <div className="space-y-6">
          {/* Adults */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-black text-foreground uppercase tracking-widest">Adults</p>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Ages 13+</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setAdults(Math.max(1, adults - 1))}
                className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                disabled={adults <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-4 text-center font-black text-foreground">{adults}</span>
              <button
                onClick={() => setAdults(adults + 1)}
                className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Children */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-black text-foreground uppercase tracking-widest">Children</p>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Ages 0 - 12</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setChildren(Math.max(0, children - 1))}
                className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                disabled={children <= 0}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-4 text-center font-black text-foreground">{children}</span>
              <button
                onClick={() => setChildren(children + 1)}
                className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Rooms */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-black text-foreground uppercase tracking-widest">Rooms</p>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Total Rooms</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setRooms(Math.max(1, rooms - 1))}
                className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                disabled={rooms <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-4 text-center font-black text-foreground">{rooms}</span>
              <button
                onClick={() => setRooms(rooms + 1)}
                className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
