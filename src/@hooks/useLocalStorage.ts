import { useEffect, useState } from 'react';

const readStorage = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') {
    return fallback;
  }

  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.log(error);
    return fallback;
  }
};

const useLocalStorage = <T = string>(key: string, initialValue: T): [T, (T) => void] => {
  // First render must match the server (which has no localStorage), so start
  // from initialValue and load the stored value only after hydration.
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    setStoredValue(readStorage(key, initialValue));
  }, [key]);

  const setValue = (value) => {
    try {
      // Base functional updates on storage, not state: child effects can call
      // this before the load effect above has run.
      const valueToStore =
        value instanceof Function ? value(readStorage(key, initialValue)) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
};

export default useLocalStorage;
