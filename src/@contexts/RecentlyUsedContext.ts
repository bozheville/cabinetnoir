import React from 'react';
import { useLocalStorage } from '@hooks';

interface ContextValue {
  recentlyUsed: string[];
  addRecentluUsed: (algorithm: string) => void;
};

export const useRecentlyUsedContext = () => {
  const [recentlyUsed, setRecentlyUsed] = useLocalStorage('recentlyUsed', []);

  const addRecentluUsed = (algorithm) => {
    setRecentlyUsed((current: string[]) => (
      current.includes(algorithm)
        ? current
        : [algorithm, ...current].slice(0,3)
    ));
  };

  return {
    recentlyUsed,
    addRecentluUsed,
  };
};

const RecentlyUsedContext = React.createContext<ContextValue>({
  recentlyUsed: [],
  addRecentluUsed: (algorithm: string) => {}
});

export default RecentlyUsedContext;
