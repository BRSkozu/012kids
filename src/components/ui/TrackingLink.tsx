'use client';

import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import {
  trackAgeClick,
  trackFirst3Click,
  trackTroubleClick,
  trackPopularClick,
} from '@/lib/analytics';

type TrackingType = 'age' | 'first3' | 'trouble' | 'popular';

interface Props extends ComponentProps<typeof Link> {
  trackingType: TrackingType;
  trackingId: string;
  trackingExtra?: string;
  children: ReactNode;
}

/**
 * Thin client-side wrapper for next/link that fires analytics tracking on click.
 * Lets the parent component remain a server component.
 */
export default function TrackingLink({
  trackingType,
  trackingId,
  trackingExtra,
  children,
  ...rest
}: Props) {
  const handleClick = () => {
    switch (trackingType) {
      case 'age':
        trackAgeClick(trackingId);
        break;
      case 'first3':
        trackFirst3Click(trackingId, trackingExtra);
        break;
      case 'trouble':
        trackTroubleClick(trackingId, trackingExtra);
        break;
      case 'popular':
        trackPopularClick(trackingId, trackingExtra);
        break;
    }
  };

  return (
    <Link {...rest} onClick={handleClick}>
      {children}
    </Link>
  );
}
