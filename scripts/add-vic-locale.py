#!/usr/bin/env python3
"""Add the VIC cipher locale keys to one locale's common.json.

Usage: python3 scripts/add-vic-locale.py <en|fr|ua>

en writes the source strings; fr/ua get faithful translations of the
same structure. Idempotent: re-running overwrites the vic blocks.
"""
import json
import sys

LOCALE = sys.argv[1] if len(sys.argv) > 1 else 'en'
PATH = f'public/locales/{LOCALE}/common.json'

with open(PATH, encoding='utf-8') as handle:
    data = json.load(handle)

STRINGS = {
    'en': {
        'processing': {
            'title': 'VIC cipher',
            'short_title': 'VIC',
            'directAction': 'Encrypt',
            'reverseAction': 'Decrypt',
            'messageLabel': 'Cryptogram',
            'phraseLabel': 'Phrase',
            'dateLabel': 'Date',
            'personalNumberLabel': 'Personal №',
            'keygroupLabel': 'Keygroup',
            'alphabetLabel': 'Alphabet',
            'alphabets': {
                'latin': 'Latin (AT ONE SIR)',
                'cyrillic': 'Cyrillic (СНЕГОПА)',
            },
            'rollKeygroup': 'Roll a fresh keygroup',
            'settings': {
                'bisect': 'Bisect the message',
                'cutIndex': 'Cut at',
                'workings': 'Show the key workings',
            },
            'errors': {
                'phrase': 'The phrase needs at least 20 letters.',
                'date': 'The date needs six digits — day, month, year, e.g. 13/9/1959.',
                'personalNumber': 'The personal number is between 1 and 20.',
                'keygroup': 'The keygroup is five digits, fresh for every message.',
                'widths': 'These secrets derive tableaus too wide to write — roll another keygroup.',
                'board': 'The checkerboard cannot be built from this phrase and alphabet.',
                'ciphertext': 'The ciphertext must be five-digit groups — the keygroup rides inside.',
            },
            'worksheet': {
                'A': 'The keygroup: five random digits, fresh for every message.',
                'B': "The date's first five digits (day, month, year, no leading zeros).",
                'C': 'A minus B, digit by digit without borrowing.',
                "D": "The phrase's first twenty letters.",
                'E1': 'The first half of D, sequenced (ranked in alphabetical order).',
                'E2': 'The second half of D, sequenced.',
                'F1': 'C chain-added out to ten digits.',
                'F2': 'The standard sequence 1234567890.',
                'G': 'E1 plus F1, digit by digit without carrying.',
                'H': 'Each digit of G encoded under the E2 key line.',
                'J': 'H, sequenced.',
                'K': 'Chain block, row 1 — H chain-added fifty more digits.',
                'L': 'Chain block, row 2.',
                'M': 'Chain block, row 3.',
                'N': 'Chain block, row 4.',
                'P': 'Chain block, row 5.',
                'Q': 'The block read column by column under J — the first tableau key, a digits.',
                'R': 'The next b digits of the block read — the second tableau key.',
                'S': "P, sequenced — the checkerboard's column labels.",
                'widths': 'The tableau widths: the last two dissimilar digits of P plus the personal number.',
                'insertAt': "The keygroup's position: this many groups from the end (the date's sixth digit).",
            },
            'workings': {
                'title': 'Key workings — the pencil-and-paper schedule',
                'summary': 'Tableaus {{a}} × {{b}} wide; the keygroup rides {{insertAt}} group(s) from the end; {{pad}} filler letter(s) pad the message.',
            },
        },
        'learning': {
            'description': "The Cold War's finest hand cipher: a phrase, a date and a personal number unfold into a straddling checkerboard and two transpositions — five-figure groups no cryptanalyst ever broke without the key.",
            'era': '1950s (Cold War)',
            'origin': 'Soviet intelligence (KGB); carried by Reino Häyhänen, "VICTOR" of the Hollow Nickel case',
            'furtherReading': {
                'kahn': 'David Kahn, "Number One From Moscow" (CIA, Studies in Intelligence)',
            },
        },
        'timeline': {
            '1940s-ancestors': "Soviet illegals' hand ciphers grow checkerboards and number additives — Sorge's ring and the Rote Kapelle carry variants.",
            '1953-nickel': 'A Brooklyn newsboy splits a hollow nickel and finds microfilm with ten columns of five-figure groups; the FBI cannot read it.',
            '1957-defection': 'Reino Häyhänen defects and unlocks the nickel message; his handler Rudolf Abel is arrested. The cipher fell to defection, not cryptanalysis.',
            '1959-kahn': 'David Kahn reconstructs the system in "Number One From Moscow" — the finest mnemonic hand cipher ever made public.',
        },
        'tooltips': {
            'phrase': 'A memorable phrase of at least 20 letters — its first twenty letters feed the key schedule.',
            'date': "Day, month, year: the first five digits feed the key lines, the unused sixth hides the keygroup's position.",
            'personalNumber': "The agent's own number (Häyhänen's was 13). It sizes the two transposition tableaus.",
            'keygroup': 'Five random digits, fresh for every message — the only part of the key that travels with the ciphertext.',
            'keygroupExtracted': 'In decrypt mode the keygroup is read from the ciphertext itself.',
            'alphabet': 'The Latin board spells AT ONE SIR on top; the Cyrillic board spells СНЕГОПА — Häyhänen\u2019s own mnemonic, the Russian for snowfall.',
            'bisect': "Kahn's optional strengthening: cut the message at an agreed index and swap the halves before encoding.",
            'cutIndex': 'Where to cut — an agreed secret between you and your recipient.',
            'workings': 'Show the whole key schedule: worksheet lines A–S, the checkerboard and the tableau widths.',
        },
        'challenges': {
            'vic-easy-1': {
                'title': 'Decrypt with all four secrets',
                'hint1': 'The phrase is "Twas the night before Christmas"; the date is 13/9/1959; the personal number is 6.',
                'hint2': 'The keygroup is 72401 — it rides inside the message.',
            },
            'vic-medium-1': {
                'title': 'Decrypt a timed rendezvous',
                'hint1': 'The phrase is "A lonely accordion plays long into the night".',
                'hint2': 'The date is 3 September 1945; the personal number is 13.',
                'hint3': 'The keygroup is 20818.',
            },
            'vic-hard-1': {
                'title': 'Decrypt a bisected dispatch',
                'hint1': 'The phrase is "It was the best of times it was the worst of times".',
                'hint2': 'The date is 22 June 1941; the personal number is 8.',
                'hint3': 'The keygroup is 39614.',
                'hint4': 'The message was bisected: turn the toggle on and cut at 20.',
            },
        },
        'types_product': 'product cipher',
        'columns': {
            'worksheetLine': 'Line',
            'worksheetValue': 'Value',
        },
    },
    'fr': {
        'processing': {
            'title': 'Chiffre VIC',
            'short_title': 'VIC',
            'directAction': 'Chiffrer',
            'reverseAction': 'Déchiffrer',
            'messageLabel': 'Cryptogramme',
            'phraseLabel': 'Phrase',
            'dateLabel': 'Date',
            'personalNumberLabel': 'Numéro perso',
            'keygroupLabel': 'Groupe-clé',
            'alphabetLabel': 'Alphabet',
            'alphabets': {
                'latin': 'Latin (AT ONE SIR)',
                'cyrillic': 'Cyrillique (СНЕГОПА)',
            },
            'rollKeygroup': 'Tirer un groupe-clé frais',
            'settings': {
                'bisect': 'Bisecter le message',
                'cutIndex': 'Couper à',
                'workings': 'Montrer les calculs de clé',
            },
            'errors': {
                'phrase': 'La phrase doit contenir au moins 20 lettres.',
                'date': 'La date exige six chiffres — jour, mois, année, p. ex. 13/9/1959.',
                'personalNumber': 'Le numéro personnel est compris entre 1 et 20.',
                'keygroup': 'Le groupe-clé fait cinq chiffres, renouvelé à chaque message.',
                'widths': 'Ces secrets donnent des tableaux trop larges — tirez un autre groupe-clé.',
                'board': "L'échiquier ne peut pas être construit avec cette phrase et cet alphabet.",
                'ciphertext': 'Le cryptogramme doit être en groupes de cinq chiffres — le groupe-clé voyage dedans.',
            },
            'worksheet': {
                'A': 'Le groupe-clé : cinq chiffres aléatoires, neufs à chaque message.',
                'B': 'Les cinq premiers chiffres de la date (jour, mois, année, sans zéros de tête).',
                'C': 'A moins B, chiffre par chiffre sans emprunt.',
                'D': 'Les vingt premières lettres de la phrase.',
                'E1': 'La première moitié de D, séquencée (classée par ordre alphabétique).',
                'E2': 'La seconde moitié de D, séquencée.',
                'F1': 'C prolongée par addition en chaîne jusqu\u2019à dix chiffres.',
                'F2': 'La suite standard 1234567890.',
                'G': 'E1 plus F1, chiffre par chiffre sans report.',
                'H': 'Chaque chiffre de G encodé sous la ligne-clé E2.',
                'J': 'H, séquencée.',
                'K': 'Bloc de chaîne, rangée 1 — H prolongée de cinquante chiffres.',
                'L': 'Bloc de chaîne, rangée 2.',
                'M': 'Bloc de chaîne, rangée 3.',
                'N': 'Bloc de chaîne, rangée 4.',
                'P': 'Bloc de chaîne, rangée 5.',
                'Q': 'Le bloc lu colonne par colonne sous J — la clé du premier tableau, a chiffres.',
                'R': 'Les b chiffres suivants du bloc lu — la clé du second tableau.',
                'S': 'P, séquencée — les étiquettes de colonnes de l\u2019échiquier.',
                'widths': 'Les largeurs des tableaux : les deux derniers chiffres dissemblables de P plus le numéro personnel.',
                'insertAt': 'La position du groupe-clé : ce nombre de groupes depuis la fin (le sixième chiffre de la date).',
            },
            'workings': {
                'title': 'Calculs de clé — le programme papier-crayon',
                'summary': 'Tableaux de {{a}} × {{b}} de large ; le groupe-clé se glisse à {{insertAt}} groupe(s) de la fin ; {{pad}} lettre(s) de bourrage complètent le message.',
            },
        },
        'learning': {
            'description': 'Le meilleur chiffre manuel de la guerre froide : une phrase, une date et un numéro personnel déploient un échiquier à califourchon et deux transpositions — des groupes de cinq chiffres qu\u2019aucun cryptanalyste n\u2019a jamais percés sans la clé.',
            'era': 'Années 1950 (guerre froide)',
            'origin': 'Renseignement soviétique (KGB) ; porté par Reino Häyhänen, « VICTOR » de l\u2019affaire du nickel creux',
            'furtherReading': {
                'kahn': 'David Kahn, « Number One From Moscow » (CIA, Studies in Intelligence)',
            },
        },
        'timeline': {
            '1940s-ancestors': 'Les chiffres manuels des illégaux soviétiques gagnent échiquiers et additifs numériques — le réseau Sorge et la Kapelle rouge en portent des variantes.',
            '1953-nickel': 'Un journalier de Brooklyn fend une pièce de cinq cents creuse et y trouve une microfilm : dix colonnes de groupes de cinq chiffres ; le FBI ne sait pas le lire.',
            '1957-defection': 'Reino Häyhänen fait défection et ouvre le message du nickel ; son chef Rudolf Abel est arrêté. Le chiffre est tombé par trahison, pas par cryptanalyse.',
            '1959-kahn': 'David Kahn reconstitue le système dans « Number One From Moscow » — le plus beau chiffre mnémonique jamais rendu public.',
        },
        'tooltips': {
            'phrase': 'Une phrase mémorable d\u2019au moins 20 lettres — ses vingt premières lettres nourrissent le programme de clés.',
            'date': 'Jour, mois, année : les cinq premiers chiffres nourrissent les lignes de clé, le sixième inutilisé cache la position du groupe-clé.',
            'personalNumber': 'Le numéro propre de l\u2019agent (celui de Häyhänen était 13). Il fixe la largeur des deux tableaux.',
            'keygroup': 'Cinq chiffres aléatoires, neufs à chaque message — la seule partie de la clé qui voyage avec le cryptogramme.',
            'keygroupExtracted': 'En mode déchiffrement, le groupe-clé est lu dans le cryptogramme lui-même.',
            'alphabet': 'L\u2019échiquier latin épelle AT ONE SIR en haut ; le cyrillique épelle СНЕГОПА — le moyen mnémotechnique de Häyhänen, la « tourmente de neige » russe.',
            'bisect': 'Le renforcement facultatif de Kahn : couper le message à un index convenu et échanger les moitiés avant l\u2019encodage.',
            'cutIndex': 'Où couper — un secret convenu entre vous et votre correspondant.',
            'workings': 'Montrer tout le programme de clés : les lignes A–S, l\u2019échiquier et les largeurs des tableaux.',
        },
        'challenges': {
            'vic-easy-1': {
                'title': 'Déchiffrer avec les quatre secrets',
                'hint1': 'La phrase est « Twas the night before Christmas » ; la date est 13/9/1959 ; le numéro personnel est 6.',
                'hint2': 'Le groupe-clé est 72401 — il voyage dans le message.',
            },
            'vic-medium-1': {
                'title': 'Déchiffrer un rendez-vous minuté',
                'hint1': 'La phrase est « A lonely accordion plays long into the night ».',
                'hint2': 'La date est le 3 septembre 1945 ; le numéro personnel est 13.',
                'hint3': 'Le groupe-clé est 20818.',
            },
            'vic-hard-1': {
                'title': 'Déchiffrer une dépêche bisectée',
                'hint1': 'La phrase est « It was the best of times it was the worst of times ».',
                'hint2': 'La date est le 22 juin 1941 ; le numéro personnel est 8.',
                'hint3': 'Le groupe-clé est 39614.',
                'hint4': 'Le message a été bisecté : activez l\u2019interrupteur et coupez à 20.',
            },
        },
        'types_product': 'chiffre produit',
        'columns': {
            'worksheetLine': 'Ligne',
            'worksheetValue': 'Valeur',
        },
    },
    'ua': {
        'processing': {
            'title': 'Шифр VIC',
            'short_title': 'VIC',
            'directAction': 'Зашифрувати',
            'reverseAction': 'Розшифрувати',
            'messageLabel': 'Криптограма',
            'phraseLabel': 'Фраза',
            'dateLabel': 'Дата',
            'personalNumberLabel': 'Особистий №',
            'keygroupLabel': 'Ключова група',
            'alphabetLabel': 'Абетка',
            'alphabets': {
                'latin': 'Латиниця (AT ONE SIR)',
                'cyrillic': 'Кирилиця (СНЕГОПА)',
            },
            'rollKeygroup': 'Створити нову ключову групу',
            'settings': {
                'bisect': 'Розрізати повідомлення',
                'cutIndex': 'Різати на',
                'workings': 'Показати обчислення ключа',
            },
            'errors': {
                'phrase': 'Фраза має містити щонайменше 20 літер.',
                'date': 'Дата потребує шести цифр — день, місяць, рік, напр. 13/9/1959.',
                'personalNumber': 'Особистий номер — від 1 до 20.',
                'keygroup': 'Ключова група — п’ять цифр, нова для кожного повідомлення.',
                'widths': 'Ці секрети дають занадто широкі таблиці — створіть іншу ключову групу.',
                'board': 'Карту-шахівницю неможливо побудувати з цієї фрази та абетки.',
                'ciphertext': 'Криптограма має складатися з п’ятицифрових груп — ключова група їде всередині.',
            },
            'worksheet': {
                'A': 'Ключова група: п’ять випадкових цифр, нова для кожного повідомлення.',
                'B': 'Перші п’ять цифр дати (день, місяць, рік, без нулів спереду).',
                'C': 'A мінус B, цифра за цифрою без позичення.',
                'D': 'Перші двадцять літер фрази.',
                'E1': 'Перша половина D, секвенційна (ранжована за абеткою).',
                'E2': 'Друга половина D, секвенційна.',
                'F1': 'C, продовжена ланцюговим додаванням до десяти цифр.',
                'F2': 'Стандартна послідовність 1234567890.',
                'G': 'E1 плюс F1, цифра за цифрою без переносу.',
                'H': 'Кожна цифра G, закодована під ключовою лінією E2.',
                'J': 'H, секвенційна.',
                'K': 'Ланцюговий блок, рядок 1 — H, продовжена на п’ятдесят цифр.',
                'L': 'Ланцюговий блок, рядок 2.',
                'M': 'Ланцюговий блок, рядок 3.',
                'N': 'Ланцюговий блок, рядок 4.',
                'P': 'Ланцюговий блок, рядок 5.',
                'Q': 'Блок, прочитаний стовпцями під J — ключ першої таблиці, a цифр.',
                'R': 'Наступні b цифр прочитаного блоку — ключ другої таблиці.',
                'S': 'P, секвенційна — мітки стовпців шахівниці.',
                'widths': 'Ширини таблиць: останні дві різні цифри P плюс особистий номер.',
                'insertAt': 'Позиція ключової групи: стільки груп від кінця (шоста цифра дати).',
            },
            'workings': {
                'title': 'Обчислення ключа — олівцево-паперова програма',
                'summary': 'Таблиці шириною {{a}} × {{b}}; ключова група їде за {{insertAt}} груп(и) від кінця; {{pad}} літер(и)-заповнювачів доповнюють повідомлення.',
            },
        },
        'learning': {
            'description': 'Найкращий ручний шифр холодної війни: фраза, дата й особистий номер розгортаються в шахівницю та дві транспозиції — п’ятицифрові групи, які жоден криптоаналітик не зламав без ключа.',
            'era': '1950-ті (холодна війна)',
            'origin': 'Радянська розвідка (КДБ); носив Reino Häyhänen, «VICTOR» зі справи порожнього нікеля',
            'furtherReading': {
                'kahn': 'Девід Кан, «Number One From Moscow» (ЦРУ, Studies in Intelligence)',
            },
        },
        'timeline': {
            '1940s-ancestors': 'Ручні шифри радянських нелегалів обростають шахівницями та числовими добавками — мережа Зорге та «Червона капела» носили їхні варіанти.',
            '1953-nickel': 'Бруклінський газетяр розколює порожній п’ятицентовик і знаходить мікрофільм: десять стовпців п’ятицифрових груп; ФБР не може його прочитати.',
            '1957-defection': 'Reino Häyhänen переходить на Захід і відкриває повідомлення з нікеля; його куратора Рудольфа Абеля заарештовано. Шифр упав від зради, не від криптоаналізу.',
            '1959-kahn': 'Девід Кан відтворює систему в «Number One From Moscow» — найкращий мнемонічний ручний шифр, коли-небудь оприлюднений.',
        },
        'tooltips': {
            'phrase': 'Запам’ятовувана фраза щонайменше з 20 літер — її перші двадцять літер живлять програму ключів.',
            'date': 'День, місяць, рік: перші п’ять цифр живлять ключові лінії, невикористана шоста ховає позицію ключової групи.',
            'personalNumber': 'Власний номер агента (у Häyhänen — 13). Він задає ширину двох таблиць.',
            'keygroup': 'П’ять випадкових цифр, нові для кожного повідомлення — єдина частина ключа, що їде з криптограмою.',
            'keygroupExtracted': 'У режимі розшифрування ключова група читається з самої криптограми.',
            'alphabet': 'Латинська шахівниця пише вгорі AT ONE SIR; кирилична — СНЕГОПА, мнемоніка самого Häyhänen.',
            'bisect': 'Необов’язкове посилення Кана: розрізати повідомлення за узгодженим індексом і поміняти половини місцями до кодування.',
            'cutIndex': 'Де різати — узгоджена тайна між вами і вашим адресатом.',
            'workings': 'Показати всю програму ключів: лінії A–S, шахівницю та ширини таблиць.',
        },
        'challenges': {
            'vic-easy-1': {
                'title': 'Розшифрувати з чотирма секретами',
                'hint1': 'Фраза — «Twas the night before Christmas»; дата — 13/9/1959; особистий номер — 6.',
                'hint2': 'Ключова група — 72401; вона їде всередині повідомлення.',
            },
            'vic-medium-1': {
                'title': 'Розшифрувати призначену зустріч',
                'hint1': 'Фраза — «A lonely accordion plays long into the night».',
                'hint2': 'Дата — 3 вересня 1945; особистий номер — 13.',
                'hint3': 'Ключова група — 20818.',
            },
            'vic-hard-1': {
                'title': 'Розшифрувати розрізану депешу',
                'hint1': 'Фраза — «It was the best of times it was the worst of times».',
                'hint2': 'Дата — 22 червня 1941; особистий номер — 8.',
                'hint3': 'Ключова група — 39614.',
                'hint4': 'Повідомлення було розрізане: увімкніть перемикач і різати на 20.',
            },
        },
        'types_product': 'складений шифр',
        'columns': {
            'worksheetLine': 'Лінія',
            'worksheetValue': 'Значення',
        },
    },
}

S = STRINGS[LOCALE]

# processing.vic
data['processing']['vic'] = {
    **S['processing'],
    'settings': S['processing']['settings'],
    'errors': S['processing']['errors'],
    'worksheet': S['processing']['worksheet'],
    'workings': S['processing']['workings'],
    'alphabets': S['processing']['alphabets'],
}

# learning.vic (era/origin/description + furtherReading label)
data['learning']['vic'] = {
    'description': S['learning']['description'],
    'era': S['learning']['era'],
    'origin': S['learning']['origin'],
    'furtherReading': S['learning']['furtherReading'],
}

# learning.timeline.vic
data['learning']['timeline']['vic'] = S['timeline']

# learning.tooltips.vic
data['learning']['tooltips']['vic'] = S['tooltips']

# learning.challenges.vic-*
for challenge, block in S['challenges'].items():
    data['learning']['challenges'][challenge] = block

# learning.types.product
data['learning']['types']['product'] = S['types_product']

# learning.example.columns (worked-example headings)
data['learning']['example']['columns']['worksheetLine'] = S['columns']['worksheetLine']
data['learning']['example']['columns']['worksheetValue'] = S['columns']['worksheetValue']

# identify: catalogue name + rule reasons
data['identify']['ciphers']['vic'] = 'VIC'
data['identify']['reasons']['vicGroups'] = (
    'Digits in five-figure groups — the classic spy-radio presentation of a hand cipher like VIC.'
    if LOCALE == 'en' else
    'Des chiffres en groupes de cinq — la présentation radio-espion classique d\u2019un chiffre manuel comme VIC.'
    if LOCALE == 'fr' else
    'Цифри п’ятицифровими групами — класична радіошпигунська подача ручного шифру на кшталт VIC.'
)
data['identify']['reasons']['vicNotSums'] = (
    'The digit groups parse as no Nihilist sum sequence — the digits behave like uniform groups, not additive numbers.'
    if LOCALE == 'en' else
    'Les groupes de chiffres ne se lisent pas comme une suite de sommes nihilistes — des groupes uniformes, pas des additions.'
    if LOCALE == 'fr' else
    'Цифрові групи не читаються як послідовність нігілістичних сум — це рівномірні групи, не адитивні числа.'
)

# glossary terms (shared shape across locales; fr/ua translated)
GLOSSARY = {
    'en': {
        'straddling-checkerboard': {
            'name': 'Straddling checkerboard',
            'definition': 'A grid where frequent letters take one digit and the rest take two — it turns text into digits faster than a Polybius square.',
        },
        'chain-addition': {
            'name': 'Chain addition',
            'definition': 'Extending a digit line by adding pairs of digits mod 10: the first two digits produce a new one after the last, the second and third the next, and so on.',
        },
        'sequencing': {
            'name': 'Sequencing',
            'definition': 'Ranking the characters of a line 1 to n in alphabetical order, ties numbered left to right; 0 counts as ten.',
        },
        'keygroup': {
            'name': 'Keygroup',
            'definition': 'Five random digits that travel with a VIC message and seed its key derivation — fresh for every message.',
        },
        'disrupted-transposition': {
            'name': 'Disrupted transposition',
            'definition': "A columnar transposition whose grid carries triangular 'disruption' areas filled last — it breaks the column regularity anagrammers exploit.",
        },
        'product-cipher': {
            'name': 'Product cipher',
            'definition': 'A cipher that layers substitution and transposition stages, so breaking one layer still leaves the others.',
        },
    },
    'fr': {
        'straddling-checkerboard': {
            'name': 'Échiquier à califourchon',
            'definition': 'Une grille où les lettres fréquentes prennent un chiffre et les autres deux — elle change le texte en chiffres plus vite qu\u2019un carré de Polybe.',
        },
        'chain-addition': {
            'name': 'Addition en chaîne',
            'definition': 'Prolonger une ligne de chiffres en additionnant des paires modulo 10 : les deux premiers chiffres en produisent un nouveau après le dernier, et ainsi de suite.',
        },
        'sequencing': {
            'name': 'Séquençage',
            'definition': 'Ranger les caractères d\u2019une ligne de 1 à n par ordre alphabétique, les ex æquo numérotés de gauche à droite ; 0 vaut dix.',
        },
        'keygroup': {
            'name': 'Groupe-clé',
            'definition': 'Cinq chiffres aléatoires qui voyagent avec un message VIC et amorcent sa dérivation de clé — renouvelés à chaque message.',
        },
        'disrupted-transposition': {
            'name': 'Transposition perturbée',
            'definition': 'Une transposition colonnaire dont la grille porte des zones triangulaires de « perturbation » remplies en dernier — elle brise la régularité que les anagrammeurs exploitent.',
        },
        'product-cipher': {
            'name': 'Chiffre produit',
            'definition': 'Un chiffre qui superpose substitution et transposition : casser une couche laisse encore les autres.',
        },
    },
    'ua': {
        'straddling-checkerboard': {
            'name': 'Шахівниця з розкиданими клітинами',
            'definition': 'Сітка, де часті літери беруть одну цифру, а решта — дві: вона перетворює текст на цифри швидше за квадрат Полібія.',
        },
        'chain-addition': {
            'name': 'Ланцюгове додавання',
            'definition': 'Продовження цифрової лінії додаванням пар цифр за модулем 10: перші дві цифри дають нову за останньою, друга й третя — наступну, і так далі.',
        },
        'sequencing': {
            'name': 'Секвенціювання',
            'definition': 'Ранжування символів лінії від 1 до n за абеткою, рівні нумеруються зліва праворуч; 0 рахується за десять.',
        },
        'keygroup': {
            'name': 'Ключова група',
            'definition': 'П’ять випадкових цифр, що їдуть із повідомленням VIC і сіють його виведення ключа — нові для кожного повідомлення.',
        },
        'disrupted-transposition': {
            'name': 'Порушена транспозиція',
            'definition': 'Стовпчикова транспозиція, чиєр сітка несе трикутні зони «порушення», заповнені останніми, — це ламає регулярність стовпців, яку експлуатують анаграмувальники.',
        },
        'product-cipher': {
            'name': 'Складений шифр',
            'definition': 'Шифр, що нашаровує стадії підстановки і транспозиції: зламавши один шар, лишаєш інші.',
        },
    },
}
for term, block in GLOSSARY[LOCALE].items():
    data['glossary'][term] = block

# home roadmap bullet
data['home']['roadmap']['built']['vic'] = (
    'The VIC cipher — the unbreakable Cold War hand cipher, with its full pencil-and-paper key worksheet'
    if LOCALE == 'en' else
    'Le chiffre VIC — le chiffre manuel infrangible de la guerre froide, avec sa fiche de clé papier-crayon complète'
    if LOCALE == 'fr' else
    'Шифр VIC — незламний ручний шифр холодної війни з повним олівцево-паперовим аркушем ключа'
)

# category description: mention VIC alongside ADFGVX and Nihilist.
data['categories']['product']['description'] = {
    'en': 'Product ciphers combine substitution with transposition: ADFGVX, Nihilist and VIC. The WWI field ciphers, the Cold War hand cipher, and how two of them were broken.',
    'fr': 'Les chiffres produits combinent substitution et transposition : ADFGVX, Nihiliste et VIC. Les chiffres de campagne de 14-18, le chiffre manuel de la guerre froide — et comment deux d\u2019entre eux sont tombés.',
    'ua': 'Складені шифри поєднують підстановку з транспозицією: ADFGVX, нігілістичний і VIC. Польові шифри Першої світової, ручний шифр холодної війни — і як два з них було зламано.',
}[LOCALE]

with open(PATH, 'w', encoding='utf-8') as handle:
    json.dump(data, handle, ensure_ascii=False, indent=2)
    handle.write('\n')

print(f'{LOCALE}: VIC keys written')
