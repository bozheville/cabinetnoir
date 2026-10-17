// Playfair's display-specific digraph helpers re-export the shared
// statistics; the math lives in the shared analysis library.
export {
  ENGLISH_DIGRAPHS,
  digraphScore,
  scoreDigraphs,
  topDigraphs,
  commonEnglishDigraphs,
} from '@encryptors/shared/analysis';
