// Types for src/@learning/categories.js.
export interface CategoryInfo {
  parent: string | null;
  leather: string;
  thread?: string;
  id: string;
}
export interface CategoryMembers {
  live: string[];
  comingSoon: string[];
}

// Runtime re-exports from the CommonJS categories.js module (see config.d.ts
// for the established pattern).
export declare const CATEGORIES: Record<string, { parent: string | null; leather: string; thread?: string }>;
export declare const CIPHER_CATEGORIES: Record<string, string[]>;
export declare const COMING_SOON: Record<string, string[]>;
export declare const CIPHER_LADDER: string[];
export declare const MAX_DEPTH: number;
export declare const MIN_INDEXABLE_CIPHERS: number;
export declare function getCategory(id: string): CategoryInfo | null;
export declare function getChildren(id: string): string[];
export declare function getRootCategories(): string[];
export declare function getAncestry(id: string): string[];
export declare function categoryPath(id: string): string;
export declare function categoryFromSegments(segments: string[]): string | null;
export declare function getCipherCategories(cipher: string): string[] | null;
export declare function getPrimaryCategory(cipher: string): string | null;
export declare function isMemberOf(cipher: string, id: string): boolean;
export declare function getMembers(id: string, options?: { includeDescendants?: boolean }): CategoryMembers;
export declare function liveCount(id: string): number;
export declare function isIndexable(id: string): boolean;
export declare function getAllCategoryPaths(): string[][];
