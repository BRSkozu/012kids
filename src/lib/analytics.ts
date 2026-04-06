/**
 * GA4 event tracking utilities for homepage UI/UX improvement.
 * All events are sent via gtag() if GA is loaded.
 */

type GTagEvent = {
  action: string;
  params?: Record<string, string | number | undefined>;
};

function sendEvent({ action, params }: GTagEvent) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', action, params);
  }
}

// P0: Age navigation click
export function trackAgeClick(ageGroup: string) {
  sendEvent({ action: 'home_age_click', params: { age_group: ageGroup } });
}

// P0: "はじめての方へ" 3-card click
export function trackFirst3Click(ageGroup: string, articleId?: string) {
  sendEvent({
    action: 'home_first3_click',
    params: { age_group: ageGroup, section_name: 'hajimete', article_id: articleId },
  });
}

// P1: Worry category click
export function trackTroubleClick(worryId: string, sectionName?: string) {
  sendEvent({
    action: 'home_trouble_click',
    params: { section_name: sectionName ?? 'worry', article_id: worryId },
  });
}

// P2: Popular article click
export function trackPopularClick(articleId: string, ageGroup?: string) {
  sendEvent({
    action: 'home_popular_click',
    params: { article_id: articleId, age_group: ageGroup },
  });
}

// Scroll 50% tracking
export function trackScroll50() {
  sendEvent({ action: 'home_scroll_50', params: { section_name: 'homepage' } });
}
