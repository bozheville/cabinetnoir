import { BodyCopy } from '@typography';
import React from 'react';

const MorseDescription: React.FC = () => {
  return (
    <div>
      <BodyCopy>
        <em>
          Extracted from{' '}
          <a href="https://en.wikipedia.org/wiki/Morse_code" target="_blank">
            Wikipedia
          </a>
        </em>
      </BodyCopy>
      <BodyCopy>
        The American artist Samuel F. B. Morse, the American physicist Joseph Henry, and mechanical engineer Alfred Vail developed an electrical telegraph system. It needed a method to transmit natural language using only electrical pulses and the silence between them. Around 1837, Morse, therefore developed an early forerunner to the modern International Morse code.
      </BodyCopy>
      <BodyCopy>
        The Morse system for telegraphy, which was first used in about 1844, was designed to make indentations on a paper tape when electric currents were received. Morse's original telegraph receiver used a mechanical clockwork to move a paper tape. When an electrical current was received, an electromagnet engaged an armature that pushed a stylus onto the moving paper tape, making an indentation on the tape. When the current was interrupted, a spring retracted the stylus and that portion of the moving tape remained unmarked. Morse code was developed so that operators could translate the indentations marked on the paper tape into text messages.
      </BodyCopy>
      <BodyCopy>
        In his earliest design for a code, Morse had planned to transmit only numerals, and to use a codebook to look up each word according to the number which had been sent. However, the code was soon expanded by Alfred Vail in 1840 to include letters and special characters, so it could be used more generally. Vail estimated the frequency of use of letters in the English language by counting the movable type he found in the type-cases of a local newspaper in Morristown, New Jersey. The shorter marks were called "dots" and the longer ones "dashes", and the letters most commonly used were assigned the shortest sequences of dots and dashes. This code, first used in 1844, became known as Morse landline code, American Morse code, or Railroad Morse, until the end of railroad telegraphy in the U.S. in the 1970s.
      </BodyCopy>
      <BodyCopy>
        Morse code has been in use for more than 160 years—longer than any other electrical coding system. What is called Morse code today is actually somewhat different from what was originally developed by Vail and Morse. The Modern International Morse code, or continental code, was created by Friedrich Clemens Gerke in 1848 and initially used for telegraphy between Hamburg and Cuxhaven in Germany. Gerke changed nearly half of the alphabet and all of the numerals, providing the foundation for the modern form of the code. After some minor changes, International Morse Code was standardized at the International Telegraphy Congress in 1865 in Paris and was later made the standard by the International Telecommunication Union (ITU). Morse's original code specification, largely limited to use in the United States and Canada, became known as American Morse code or railroad code. American Morse code is now seldom used except in historical re-enactments.
      </BodyCopy>
      <BodyCopy>
        International Morse code is composed of five elements:
        <ul>
          <li>short mark, dot or "dit" (&bull;): "dot duration" is one time unit long</li>
          <li>longer mark, dash or "dah" (&ndash;): three time units long</li>
          <li>inter-element gap between the dots and dashes within a character: one dot duration or one unit long</li>
          <li>short gap (between letters): three time units long</li>
          <li>medium gap (between words): seven time units long</li>
        </ul>
      </BodyCopy>
    </div>
  );
};

MorseDescription.displayName = 'MorseDescription';

export default MorseDescription;
