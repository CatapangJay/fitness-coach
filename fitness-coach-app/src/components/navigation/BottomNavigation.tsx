'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { 
  Home, 
  Search, 
  Calculator, 
  Utensils, 
  Dumbbell, 
  TrendingUp
} from 'lucide-react';

interface BottomItem {
  href: string;
  label: string;
  icon: ReactNode;
  disabled?: boolean;
}

const items: BottomItem[] = [
  { href: '/dashboard', label: 'Home', icon: <Home className="h-5 w-5" /> },
  { href: '/nutrition', label: 'Nutrition', icon: <Utensils className="h-5 w-5" /> },
  { href: '/meal-planner', label: 'Planner', icon: <Calculator className="h-5 w-5" /> },
  { href: '/food-search', label: 'Search', icon: <Search className="h-5 w-5" /> },
  { href: '/progress', label: 'Progress', icon: <TrendingUp className="h-5 w-5" /> },
];

export function BottomNavigation() {
  const pathname = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-gray-200">
      <div className="grid grid-cols-5">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center py-2 text-xs">
              <div className={`flex flex-col items-center ${isActive ? 'text-blue-600' : 'text-gray-600'}`}>
                {item.icon}
                <span className="mt-0.5">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
      {/* iOS safe area */}
      <div className="h-3 bg-white" />
    </nav>
  );
}
