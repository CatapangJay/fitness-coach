'use client';

import { Button } from '@/components/ui/button';
import { useLocale } from '@/contexts/LocaleContext';
import { Ruler } from 'lucide-react';

export function UnitToggle() {
  const { unitSystem, setUnitSystem, t } = useLocale();

  const toggleUnits = () => setUnitSystem(unitSystem === 'metric' ? 'imperial' : 'metric');

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleUnits}
      aria-label={unitSystem === 'metric' ? t('units.metric') : t('units.imperial')}
      title={`${t('units.metric')}/${t('units.imperial')}`}
      className="relative"
    >
      <Ruler className="h-5 w-5" />
      <span className="absolute -bottom-1 -right-1 rounded px-1 text-[10px] bg-gray-200 text-gray-700">
        {unitSystem === 'metric' ? 'M' : 'I'}
      </span>
    </Button>
  );
}
