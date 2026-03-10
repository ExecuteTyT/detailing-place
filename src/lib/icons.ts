import {
  ShieldCheck,
  ScanBarcode,
  MessageCircle,
  Award,
  Users,
  Camera,
  Clock,
  Star,
  Wrench,
  Car,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  ShieldCheck,
  ScanBarcode,
  MessageCircle,
  Award,
  Users,
  Camera,
  Clock,
  Star,
  Wrench,
  Car,
  Sparkles,
};

export function resolveIcon(name: string): LucideIcon {
  return ICON_MAP[name] || ShieldCheck;
}
