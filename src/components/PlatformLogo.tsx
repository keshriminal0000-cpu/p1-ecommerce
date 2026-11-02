import React from 'react';
import { PlatformOrigin } from '../types';
import { Cpu, GraduationCap, ShoppingBag } from 'lucide-react';

interface PlatformLogoProps {
  platform: PlatformOrigin;
  className?: string;
  showText?: boolean;
}

export const PlatformLogo: React.FC<PlatformLogoProps> = ({ 
  platform, 
  className = 'h-5 w-5', 
  showText = false 
}) => {
  switch (platform) {
    case 'Amazon':
      return (
        <span className={`inline-flex items-center gap-1.5 font-semibold text-slate-800 ${className}`}>
          <span className="flex h-5 w-5 items-center justify-center rounded bg-amber-400 text-[11px] font-black text-slate-950 shadow-xs">
            a
          </span>
          {showText && <span className="text-xs font-bold tracking-tight text-amber-600">Amazon</span>}
        </span>
      );

    case 'Flipkart':
      return (
        <span className={`inline-flex items-center gap-1.5 font-semibold ${className}`}>
          <span className="flex h-5 w-5 items-center justify-center rounded bg-blue-600 text-[11px] font-black text-yellow-300 shadow-xs">
            F
          </span>
          {showText && <span className="text-xs font-bold tracking-tight text-blue-600">Flipkart</span>}
        </span>
      );

    case 'BestBuy':
      return (
        <span className={`inline-flex items-center gap-1.5 font-semibold ${className}`}>
          <span className="flex h-5 w-5 items-center justify-center rounded bg-yellow-400 text-[10px] font-black text-slate-950 shadow-xs">
            BB
          </span>
          {showText && <span className="text-xs font-bold tracking-tight text-yellow-700">Best Buy</span>}
        </span>
      );

    case 'ArduinoStore':
      return (
        <span className={`inline-flex items-center gap-1.5 font-semibold ${className}`}>
          <span className="flex h-5 w-5 items-center justify-center rounded bg-teal-600 text-white shadow-xs">
            <Cpu className="h-3.5 w-3.5" />
          </span>
          {showText && <span className="text-xs font-bold tracking-tight text-teal-700">Arduino Store</span>}
        </span>
      );

    case 'CampusStore':
      return (
        <span className={`inline-flex items-center gap-1.5 font-semibold ${className}`}>
          <span className="flex h-5 w-5 items-center justify-center rounded bg-indigo-600 text-white shadow-xs">
            <GraduationCap className="h-3.5 w-3.5" />
          </span>
          {showText && <span className="text-xs font-bold tracking-tight text-indigo-700">Campus Store</span>}
        </span>
      );

    case 'UniKart':
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 font-semibold ${className}`}>
          <span className="flex h-5 w-5 items-center justify-center rounded bg-emerald-600 text-white shadow-xs">
            <ShoppingBag className="h-3.5 w-3.5" />
          </span>
          {showText && <span className="text-xs font-bold tracking-tight text-emerald-700">UniKart Direct</span>}
        </span>
      );
  }
};
