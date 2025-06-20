import { useEffect, useRef, useState } from 'react';
import { log } from '../constants/config';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  freezeOnceVisible?: boolean;
}

/**
 * Generic intersection observer hook
 * Useful for lazy loading, infinite scroll, animations, etc.
 */
export function useIntersectionObserver<T extends Element = HTMLDivElement>(
  options: UseIntersectionObserverOptions = {}
) {
  const {
    threshold = 0,
    root = null,
    rootMargin = '0%',
    freezeOnceVisible = false,
  } = options;

  const elementRef = useRef<T>(null);
  const [entry, setEntry] = useState<IntersectionObserverEntry>();

  const frozen = entry?.isIntersecting && freezeOnceVisible;

  useEffect(() => {
    const element = elementRef.current;
    const hasIOSupport = !!window.IntersectionObserver;

    if (!hasIOSupport || frozen || !element) return;

    const observerParams = { threshold, root, rootMargin };
    const observer = new IntersectionObserver(([entry]) => {
      log('Intersection observer triggered:', entry.isIntersecting);
      setEntry(entry);
    }, observerParams);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, root, rootMargin, frozen]);

  return {
    elementRef,
    entry,
    isIntersecting: !!entry?.isIntersecting,
    isVisible: !!entry?.isIntersecting,
  };
}

/**
 * Hook for triggering callbacks when element becomes visible
 */
export function useVisibilityCallback<T extends Element = HTMLDivElement>(
  callback: (entry: IntersectionObserverEntry) => void,
  options: UseIntersectionObserverOptions = {}
) {
  const { elementRef, entry } = useIntersectionObserver<T>(options);

  useEffect(() => {
    if (entry) {
      callback(entry);
    }
  }, [entry, callback]);

  return { elementRef };
} 
