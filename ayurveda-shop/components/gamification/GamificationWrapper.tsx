'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import DoctorChatWidget from '@/components/shared/DoctorChatWidget';
import SpinWheel from '@/components/gamification/SpinWheel';
import ScratchCard from '@/components/gamification/ScratchCard';
import ReferralSystem from '@/components/gamification/ReferralSystem';

export default function GamificationWrapper() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  // Don't show gamification features on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <DoctorChatWidget />
      <SpinWheel />
      <ScratchCard />
      <ReferralSystem />
    </>
  );
}
