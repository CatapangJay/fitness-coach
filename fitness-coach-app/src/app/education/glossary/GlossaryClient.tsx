'use client';

import dynamic from 'next/dynamic';

const Glossary = dynamic(() => import('@/components/education/Glossary'), {
  ssr: false,
  loading: () => (
    <div className="p-6">
      <div className="h-6 w-40 rounded bg-gray-200 animate-pulse mb-4" />
      <div className="space-y-2">
        <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
        <div className="h-4 w-5/6 rounded bg-gray-200 animate-pulse" />
        <div className="h-4 w-2/3 rounded bg-gray-200 animate-pulse" />
      </div>
    </div>
  ),
});

export default function GlossaryClient() {
  return <Glossary />;
}
