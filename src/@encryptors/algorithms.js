module.exports = {
  encodingsList: ['base64', 'rot13', 'morse'],
  encryptorsList: ['affine', 'alberti', 'atbash', 'caesar', 'polybius', 'enigma', 'keyword', 'columnar', 'railFence', 'playfair', 'vigenere', 'beaufort', 'autokey', 'nihilist', 'adfgvx', 'pigpen', 'saknussemm', 'vic'],
  // Ciphers where encrypting and decrypting are the same operation
  // (self-inverse): running the tool on its own output returns the
  // input. Their `direct` page carries an "encoder & decoder" title
  // (seo.toolTitle.selfInverse.direct) because both intents are served
  // by one tool — see specs/seo-indexing/indexing-log.md Issue 6.
  // Beaufort is absent on purpose: only its classic variant is
  // reciprocal, the variant Beaufort decrypts differently.
  selfInverseList: ['atbash', 'rot13', 'enigma'],
};
