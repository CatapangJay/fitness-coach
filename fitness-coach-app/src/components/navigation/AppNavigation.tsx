'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LanguageSwitcher } from '@/components/settings/LanguageSwitcher';
import { UnitToggle } from '@/components/settings/UnitToggle';

import { 
  Home, 
  Search, 
  Calculator, 
  Utensils, 
  Dumbbell, 
  User,
  Settings,
  TrendingUp
} from 'lucide-react';

interface NavigationItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  disabled?: boolean;
}

const navigationItems: NavigationItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: <Home className="h-4 w-4" />,
  },
  {
    href: '/nutrition',
    label: 'Nutrition',
    icon: <Utensils className="h-4 w-4" />,
  },
  {
    href: '/food-search',
    label: 'Food Search',
    icon: <Search className="h-4 w-4" />,
  },
  {
    href: '/meal-planner',
    label: 'Meal Planner',
    icon: <Calculator className="h-4 w-4" />,
  },
  {
    href: '/exercises',
    label: 'Exercises',
    icon: <Dumbbell className="h-4 w-4" />,
  },
  {
    href: '/workout-planner',
    label: 'Workout Plans',
    icon: <Settings className="h-4 w-4" />,
  },
  {
    href: '/workout',
    label: 'Track Workout',
    icon: <Dumbbell className="h-4 w-4" />,
  },
  {
    href: '/progress',
    label: 'Progress',
    icon: <TrendingUp className="h-4 w-4" />,
  },
  {
    href: '/profile',
    label: 'Profile',
    icon: <User className="h-4 w-4" />,
    disabled: true,
  },
];

export function AppNavigation() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:block bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          {/* Segmented navigation */}
          <div
            className="flex items-center gap-1 overflow-x-auto rounded-lg border bg-gray-50 px-1 py-1"
            role="tablist"
            aria-label="Primary navigation"
          >
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;

              const baseClasses =
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors whitespace-nowrap";
              const activeClasses = "bg-white text-gray-900 shadow-sm";
              const inactiveClasses =
                "text-gray-600 hover:text-gray-900 hover:bg-white/70";
              const disabledClasses =
                "text-gray-400 cursor-not-allowed";

              if (item.disabled) {
                return (
                  <div
                    key={item.href}
                    className={`${baseClasses} ${disabledClasses}`}
                    aria-disabled
                    title="Coming soon"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
                  aria-current={isActive ? "page" : undefined}
                  role="tab"
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <Badge variant={isActive ? "default" : "outline"} className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </div>
          <div className="flex items-center">
            <div className="flex items-center gap-1 rounded-md border bg-gray-50 px-1 py-1">
              <UnitToggle />
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}