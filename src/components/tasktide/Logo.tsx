import { Waves } from "lucide-react";

export const Logo = ({ size = "default" }: { size?: "default" | "lg" }) => (
  <div className="flex items-center gap-2">
    <div
      className={`grid place-items-center rounded-xl bg-gradient-tide text-primary-foreground shadow-glow ${
        size === "lg" ? "h-11 w-11" : "h-8 w-8"
      }`}
    >
      <Waves className={size === "lg" ? "h-6 w-6" : "h-4 w-4"} strokeWidth={2.5} />
    </div>
    <span
      className={`font-display font-bold tracking-tight ${
        size === "lg" ? "text-2xl" : "text-lg"
      }`}
    >
      Task<span className="text-gradient">Tide</span>
    </span>
  </div>
);
