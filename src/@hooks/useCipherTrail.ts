import React from 'react';
import { useTranslation } from 'next-i18next';
import type { Crumb } from '@lib/breadcrumbs';
import { categoryPath, getAncestry, getCategory, getPrimaryCategory, isMemberOf } from '@learning/categories';
import { useCategoryTrailContext } from '@contexts/CategoryTrailContext';

// The category part of a cipher page's breadcrumb trail: the visitor's
// remembered tree when it still contains this cipher, else the primary
// tree. Pure so SSR and the JSON-LD share one implementation.
export const primaryTrail = (cipher: string, t: (key: string) => string): Crumb[] =>
  getAncestry(getPrimaryCategory(cipher) ?? '')
    .filter(Boolean)
    .map((id) => ({
      label: t(`categories.${id}.shortName`),
      path: categoryPath(id),
    }));

export interface CipherTrailResult {
  trail: Crumb[];
  remembered: boolean;
}

export const useCipherTrail = (cipher: string): CipherTrailResult => {
  const { t } = useTranslation('common');
  const { trail } = useCategoryTrailContext();
  const remembered =
    !!trail && trail.cipher === cipher && isMemberOf(cipher, trail.categoryId);
  const categoryId = remembered ? trail!.categoryId : getPrimaryCategory(cipher);
  return {
    trail: primaryTrail(cipher, t).length > 0
      ? getAncestry(categoryId ?? '').filter(Boolean).map((id) => ({
          label: t(`categories.${id}.shortName`),
          path: categoryPath(id),
        }))
      : [],
    remembered,
  };
};
