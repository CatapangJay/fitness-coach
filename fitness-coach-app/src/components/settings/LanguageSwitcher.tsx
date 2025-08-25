'use client';

import { Button } from '@/components/ui/button';
import { useLocale } from '@/contexts/LocaleContext';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLocale();

  const toggleLanguage = () => setLanguage(language === 'en' ? 'fil' : 'en');

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleLanguage}
      aria-label={language === 'en' ? t('language.english') : t('language.filipino')}
      title={`${t('language.english')}/${t('language.filipino')}`}
      className="relative"
    >
      <Globe className="h-5 w-5" />
      <span className="absolute -bottom-1 -right-1 rounded px-1 text-[10px] bg-gray-200 text-gray-700">
        {language === 'en' ? 'EN' : 'FIL'}
      </span>
    </Button>
  );
}
