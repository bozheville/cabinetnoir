// GENERATED in part by scripts/generate-english-stats.py — do not
// edit by hand; regenerate with the script instead.
//
// CRIB_WORDS: the top 200 alphabetic English words by
// Google Books frequency (Norvig's count_1w.txt), the corpus-derived
// half of the Keyword cracker's pattern-word list.
//
// COMMON_SYLLABLES: the Fry-style classic syllable list of reading
// research with approximate shares of syllable occurrences — a curated
// constant, not corpus-derived; the generator keeps it here so every
// English table has one reproducible source.
//
// Both tables power hints only — statistics point, the user decides.

export const CRIB_WORDS: string[] =
  [
    "THE",
    "OF",
    "AND",
    "TO",
    "IN",
    "FOR",
    "IS",
    "ON",
    "THAT",
    "BY",
    "THIS",
    "WITH",
    "YOU",
    "IT",
    "NOT",
    "OR",
    "BE",
    "ARE",
    "FROM",
    "AT",
    "AS",
    "YOUR",
    "ALL",
    "HAVE",
    "NEW",
    "MORE",
    "AN",
    "WAS",
    "WE",
    "WILL",
    "HOME",
    "CAN",
    "US",
    "ABOUT",
    "IF",
    "PAGE",
    "MY",
    "HAS",
    "SEARCH",
    "FREE",
    "BUT",
    "OUR",
    "ONE",
    "OTHER",
    "DO",
    "NO",
    "TIME",
    "THEY",
    "SITE",
    "HE",
    "UP",
    "MAY",
    "WHAT",
    "WHICH",
    "THEIR",
    "NEWS",
    "OUT",
    "USE",
    "ANY",
    "THERE",
    "SEE",
    "ONLY",
    "SO",
    "HIS",
    "WHEN",
    "CONTACT",
    "HERE",
    "BUSINESS",
    "WHO",
    "WEB",
    "ALSO",
    "NOW",
    "HELP",
    "GET",
    "PM",
    "VIEW",
    "ONLINE",
    "FIRST",
    "AM",
    "BEEN",
    "WOULD",
    "HOW",
    "WERE",
    "ME",
    "SERVICES",
    "SOME",
    "THESE",
    "CLICK",
    "ITS",
    "LIKE",
    "SERVICE",
    "THAN",
    "FIND",
    "PRICE",
    "DATE",
    "BACK",
    "TOP",
    "PEOPLE",
    "HAD",
    "LIST",
    "NAME",
    "JUST",
    "OVER",
    "STATE",
    "YEAR",
    "DAY",
    "INTO",
    "EMAIL",
    "TWO",
    "HEALTH",
    "WORLD",
    "RE",
    "NEXT",
    "USED",
    "GO",
    "WORK",
    "LAST",
    "MOST",
    "PRODUCTS",
    "MUSIC",
    "BUY",
    "DATA",
    "MAKE",
    "THEM",
    "SHOULD",
    "PRODUCT",
    "SYSTEM",
    "POST",
    "HER",
    "CITY",
    "ADD",
    "POLICY",
    "NUMBER",
    "SUCH",
    "PLEASE",
    "SUPPORT",
    "MESSAGE",
    "AFTER",
    "BEST",
    "SOFTWARE",
    "THEN",
    "JAN",
    "GOOD",
    "VIDEO",
    "WELL",
    "WHERE",
    "INFO",
    "RIGHTS",
    "PUBLIC",
    "BOOKS",
    "HIGH",
    "SCHOOL",
    "THROUGH",
    "EACH",
    "LINKS",
    "SHE",
    "REVIEW",
    "YEARS",
    "ORDER",
    "VERY",
    "PRIVACY",
    "BOOK",
    "ITEMS",
    "COMPANY",
    "READ",
    "GROUP",
    "SEX",
    "NEED",
    "MANY",
    "USER",
    "SAID",
    "DE",
    "DOES",
    "SET",
    "UNDER",
    "GENERAL",
    "RESEARCH",
    "JANUARY",
    "MAIL",
    "FULL",
    "MAP",
    "REVIEWS",
    "PROGRAM",
    "LIFE",
    "KNOW",
    "GAMES",
    "WAY",
    "DAYS",
    "PART",
    "COULD",
    "GREAT",
    "UNITED",
    "HOTEL",
    "REAL",
    "ITEM",
    "CENTER",
    "EBAY",
    "MUST",
    "STORE",
    "TRAVEL"
  ];

export interface CommonSyllable {
  syllable: string;
  // Approximate share of all syllable occurrences, per cent.
  percent: number;
}

export const COMMON_SYLLABLES: CommonSyllable[] =
  [
    {
      "syllable": "re",
      "percent": 6.4
    },
    {
      "syllable": "in",
      "percent": 4.2
    },
    {
      "syllable": "er",
      "percent": 3.6
    },
    {
      "syllable": "an",
      "percent": 3.1
    },
    {
      "syllable": "ti",
      "percent": 2.9
    },
    {
      "syllable": "es",
      "percent": 2.8
    },
    {
      "syllable": "on",
      "percent": 2.7
    },
    {
      "syllable": "at",
      "percent": 2.5
    },
    {
      "syllable": "en",
      "percent": 2.4
    },
    {
      "syllable": "nd",
      "percent": 2.2
    },
    {
      "syllable": "or",
      "percent": 2.1
    },
    {
      "syllable": "st",
      "percent": 2.0
    },
    {
      "syllable": "ed",
      "percent": 1.9
    },
    {
      "syllable": "te",
      "percent": 1.8
    },
    {
      "syllable": "ar",
      "percent": 1.7
    },
    {
      "syllable": "ne",
      "percent": 1.6
    },
    {
      "syllable": "ing",
      "percent": 1.5
    },
    {
      "syllable": "to",
      "percent": 1.5
    },
    {
      "syllable": "nt",
      "percent": 1.4
    },
    {
      "syllable": "is",
      "percent": 1.3
    },
    {
      "syllable": "al",
      "percent": 1.3
    },
    {
      "syllable": "ve",
      "percent": 1.2
    },
    {
      "syllable": "ng",
      "percent": 1.2
    },
    {
      "syllable": "it",
      "percent": 1.1
    },
    {
      "syllable": "as",
      "percent": 1.1
    },
    {
      "syllable": "se",
      "percent": 1.0
    },
    {
      "syllable": "le",
      "percent": 1.0
    },
    {
      "syllable": "ro",
      "percent": 1.0
    },
    {
      "syllable": "ra",
      "percent": 0.9
    },
    {
      "syllable": "li",
      "percent": 0.9
    },
    {
      "syllable": "ri",
      "percent": 0.9
    },
    {
      "syllable": "ho",
      "percent": 0.9
    },
    {
      "syllable": "ma",
      "percent": 0.8
    },
    {
      "syllable": "ic",
      "percent": 0.8
    },
    {
      "syllable": "ll",
      "percent": 0.8
    },
    {
      "syllable": "co",
      "percent": 0.8
    },
    {
      "syllable": "me",
      "percent": 0.8
    },
    {
      "syllable": "de",
      "percent": 0.7
    },
    {
      "syllable": "si",
      "percent": 0.7
    },
    {
      "syllable": "om",
      "percent": 0.7
    },
    {
      "syllable": "el",
      "percent": 0.7
    },
    {
      "syllable": "ta",
      "percent": 0.7
    },
    {
      "syllable": "la",
      "percent": 0.7
    },
    {
      "syllable": "io",
      "percent": 0.7
    },
    {
      "syllable": "ce",
      "percent": 0.6
    },
    {
      "syllable": "ea",
      "percent": 0.6
    },
    {
      "syllable": "ur",
      "percent": 0.6
    },
    {
      "syllable": "lo",
      "percent": 0.6
    },
    {
      "syllable": "ca",
      "percent": 0.6
    },
    {
      "syllable": "ei",
      "percent": 0.6
    },
    {
      "syllable": "us",
      "percent": 0.6
    },
    {
      "syllable": "ch",
      "percent": 0.5
    },
    {
      "syllable": "ha",
      "percent": 0.5
    },
    {
      "syllable": "he",
      "percent": 0.5
    },
    {
      "syllable": "bl",
      "percent": 0.5
    },
    {
      "syllable": "be",
      "percent": 0.5
    },
    {
      "syllable": "mi",
      "percent": 0.5
    },
    {
      "syllable": "mo",
      "percent": 0.5
    },
    {
      "syllable": "no",
      "percent": 0.5
    },
    {
      "syllable": "ut",
      "percent": 0.5
    },
    {
      "syllable": "ol",
      "percent": 0.4
    },
    {
      "syllable": "pr",
      "percent": 0.4
    },
    {
      "syllable": "ot",
      "percent": 0.4
    },
    {
      "syllable": "ac",
      "percent": 0.4
    },
    {
      "syllable": "ct",
      "percent": 0.4
    },
    {
      "syllable": "pl",
      "percent": 0.4
    },
    {
      "syllable": "il",
      "percent": 0.4
    },
    {
      "syllable": "id",
      "percent": 0.4
    },
    {
      "syllable": "di",
      "percent": 0.4
    },
    {
      "syllable": "ns",
      "percent": 0.4
    },
    {
      "syllable": "fi",
      "percent": 0.4
    },
    {
      "syllable": "fo",
      "percent": 0.4
    },
    {
      "syllable": "ty",
      "percent": 0.3
    },
    {
      "syllable": "pe",
      "percent": 0.3
    },
    {
      "syllable": "bo",
      "percent": 0.3
    },
    {
      "syllable": "ry",
      "percent": 0.3
    },
    {
      "syllable": "un",
      "percent": 0.3
    },
    {
      "syllable": "ul",
      "percent": 0.3
    },
    {
      "syllable": "wh",
      "percent": 0.3
    },
    {
      "syllable": "wo",
      "percent": 0.3
    },
    {
      "syllable": "sc",
      "percent": 0.3
    },
    {
      "syllable": "ge",
      "percent": 0.3
    },
    {
      "syllable": "na",
      "percent": 0.3
    },
    {
      "syllable": "wi",
      "percent": 0.3
    },
    {
      "syllable": "em",
      "percent": 0.3
    },
    {
      "syllable": "ad",
      "percent": 0.3
    },
    {
      "syllable": "ou",
      "percent": 0.3
    },
    {
      "syllable": "ow",
      "percent": 0.3
    },
    {
      "syllable": "pa",
      "percent": 0.3
    },
    {
      "syllable": "so",
      "percent": 0.3
    },
    {
      "syllable": "po",
      "percent": 0.3
    },
    {
      "syllable": "we",
      "percent": 0.2
    },
    {
      "syllable": "su",
      "percent": 0.2
    },
    {
      "syllable": "od",
      "percent": 0.2
    },
    {
      "syllable": "ap",
      "percent": 0.2
    },
    {
      "syllable": "av",
      "percent": 0.2
    },
    {
      "syllable": "do",
      "percent": 0.2
    },
    {
      "syllable": "ex",
      "percent": 0.2
    },
    {
      "syllable": "ir",
      "percent": 0.2
    },
    {
      "syllable": "fa",
      "percent": 0.2
    },
    {
      "syllable": "ke",
      "percent": 0.2
    },
    {
      "syllable": "gh",
      "percent": 0.2
    },
    {
      "syllable": "sh",
      "percent": 0.2
    },
    {
      "syllable": "ss",
      "percent": 0.2
    }
  ];
