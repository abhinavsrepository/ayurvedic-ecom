'use client';

import { useEffect, useState } from 'react';

/**
 * Wrapper component that only renders children on the client.
 * Use this to avoid hydration mismatches caused by browser extensions.
 */
export default function ClientOnly({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
}
