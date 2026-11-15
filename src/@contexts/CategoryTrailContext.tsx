import React, { createContext, useContext, useState } from 'react';

// The history-aware category trail (spec: cipher-categories, task 05). One
// remembered tree per cipher, in memory only: no storage, no URL. It is set
// when a visitor clicks a Tool/Learn button on a category page and cleared
// by any navigation that leaves that cipher's pages.
export interface CategoryTrail {
  cipher: string;
  categoryId: string;
}

interface ContextValue {
  trail: CategoryTrail | null;
  setTrail: (trail: CategoryTrail | null) => void;
}

const CategoryTrailContext = createContext<ContextValue>({
  trail: null,
  setTrail: () => {},
});

export const useCategoryTrailContext = () => useContext(CategoryTrailContext);

export const CategoryTrailProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [trail, setTrail] = useState<CategoryTrail | null>(null);
  return (
    <CategoryTrailContext.Provider value={{ trail, setTrail }}>
      {children}
    </CategoryTrailContext.Provider>
  );
};

export default CategoryTrailContext;
