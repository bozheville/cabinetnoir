import React from 'react';
import { useLocalStorage } from '@hooks';

interface ContextValue {
  recentlyUsed: string[];
  addRecentluUsed: (algorithm: string) => void;
};

export const useRecentlyUsedContext = () => {
  const [recentlyUsed, setRecentlyUsed] = useLocalStorage('recentlyUsed', []);

  const addRecentluUsed = (algorithm) => {
    if (!recentlyUsed.includes(algorithm)) {
      setRecentlyUsed(
        [algorithm, ...recentlyUsed].slice(0,3)
      );
    }
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
