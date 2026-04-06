'use client';
import dynamic from 'next/dynamic';

const ConsequenceCards = dynamic(() => import('./ConsequenceCards'), { ssr: false });

export default function Home() {
  return <ConsequenceCards />;
}
